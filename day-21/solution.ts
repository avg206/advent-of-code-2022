import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

interface Monkey {
  number: number | null;
  name1: string | null;
  name2: string | null;
  sign: string | null;
}

const readMonkeysMap = () => {
  const map = new Map<string, Monkey>();

  for (const line of lines) {
    const [name, math] = line.split(": ");
    let number = null;
    let name1 = null;
    let name2 = null;
    let sign = null;

    if (!isNaN(parseInt(math, 10))) {
      number = parseInt(math, 10);
    } else {
      [name1, sign, name2] = math.split(" ");
    }

    map.set(name, { number, name1, name2, sign });
  }

  return map;
};

const calculateTree = (map: Map<string, Monkey>, from: string): number => {
  const { number, name1, name2, sign } = map.get(from);

  if (number || isNaN(number)) return number;

  switch (sign) {
    case "+":
      return calculateTree(map, name1) + calculateTree(map, name2);
    case "-":
      return calculateTree(map, name1) - calculateTree(map, name2);
    case "*":
      return calculateTree(map, name1) * calculateTree(map, name2);
    case "/":
      return calculateTree(map, name1) / calculateTree(map, name2);
  }

  throw new Error("fatal");
};

const part1 = () => {
  const map = readMonkeysMap();

  return calculateTree(map, "root");
};

const part2 = () => {
  const MY_CELL = "humn";

  const map = readMonkeysMap();

  map.set("root", { ...map.get("root"), sign: "=" });
  map.set(MY_CELL, { ...map.get(MY_CELL), number: NaN });

  const goDeep = (cell: string, needToMatch: number): number => {
    if (cell === MY_CELL) {
      return needToMatch;
    }

    const { name1, name2, sign } = map.get(cell);

    const left = calculateTree(map, name1);
    const right = calculateTree(map, name2);

    switch (sign) {
      case "=": {
        if (isNaN(left)) return goDeep(name1, right);
        if (isNaN(right)) return goDeep(name2, left);
        break;
      }
      case "+": {
        if (isNaN(left)) return goDeep(name1, needToMatch - right);
        if (isNaN(right)) return goDeep(name2, needToMatch - left);
        break;
      }
      case "-": {
        if (isNaN(left)) return goDeep(name1, needToMatch + right);
        if (isNaN(right)) return goDeep(name2, left - needToMatch);
        break;
      }
      case "*": {
        if (isNaN(left)) return goDeep(name1, needToMatch / right);
        if (isNaN(right)) return goDeep(name2, needToMatch / left);
        break;
      }
      case "/": {
        if (isNaN(left)) return goDeep(name1, needToMatch * right);
        if (isNaN(right)) return goDeep(name2, left / needToMatch);
        break;
      }
    }

    throw new Error("fatal");
  };

  return goDeep("root", 0);
};

console.log("Part 1 - ", part1());
console.log("Part 2 - ", part2());
