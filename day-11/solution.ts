import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

interface Monkey {
  items: number[];
  operation: string;
  divisible: number;
  whereToGoIfTrue: number;
  whereToGoIfFalse: number;
  inspections: number;
}

const parseMonkeys = (): Monkey[] => {
  const monkeys: Monkey[] = [];

  for (let i = 0; i < lines.length; i += 7) {
    const [_1, items] = lines[i + 1].split(": ");
    const [_2, operation] = lines[i + 2].split(" = ");
    const [_3, divisible] = lines[i + 3].split("divisible by ");
    const [_4, whereToGoIfTrue] = lines[i + 4].split("throw to monkey ");
    const [_5, whereToGoIfFalse] = lines[i + 5].split("throw to monkey ");

    monkeys.push({
      items: items.split(", ").map((item) => parseInt(item, 10)),
      operation,
      divisible: parseInt(divisible, 10),
      whereToGoIfTrue: parseInt(whereToGoIfTrue, 10),
      whereToGoIfFalse: parseInt(whereToGoIfFalse, 10),
      inspections: 0,
    });
  }

  return monkeys;
};

const part1 = (rounds: number) => {
  const monkeys = parseMonkeys();

  // rounds
  for (let i = 0; i < rounds; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      while (monkeys[j].items.length) {
        const item = monkeys[j].items.shift();
        monkeys[j].inspections++;

        let worryLevel = eval(monkeys[j].operation.replaceAll("old", String(item)));
        worryLevel = Math.floor(worryLevel / 3);

        if (worryLevel % monkeys[j].divisible === 0) {
          monkeys[monkeys[j].whereToGoIfTrue].items.push(worryLevel);
        } else {
          monkeys[monkeys[j].whereToGoIfFalse].items.push(worryLevel);
        }
      }
    }
  }

  const levels = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);

  console.log(levels[0] * levels[1]);
};

const part2 = (rounds: number) => {
  const createNormalizer = (monkeys: Monkey[]) => {
    let scope = 1;

    for (const monkey of monkeys) {
      scope = scope * monkey.divisible;
    }

    return (worryLevel: number): number => {
      return worryLevel % scope;
    };
  };

  const monkeys = parseMonkeys();
  const normalizer = createNormalizer(monkeys);

  // rounds
  for (let i = 0; i < rounds; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      while (monkeys[j].items.length) {
        const item = monkeys[j].items.shift();
        monkeys[j].inspections++;

        let worryLevel = normalizer(
          eval(monkeys[j].operation.replaceAll("old", String(item)))
        );

        if (worryLevel % monkeys[j].divisible === 0) {
          monkeys[monkeys[j].whereToGoIfTrue].items.push(worryLevel);
        } else {
          monkeys[monkeys[j].whereToGoIfFalse].items.push(worryLevel);
        }
      }
    }
  }

  const levels = monkeys
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);

  console.log(levels[0] * levels[1]);
};

console.log(part1(20));
console.log("--------");
console.log(part2(10_000));
