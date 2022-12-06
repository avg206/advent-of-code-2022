import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const readStacks = (): [string[][], number] => {
  let stacks = [];

  let i = 0;
  while (true) {
    if (lines[i] === "") {
      break;
    }

    const line = lines[i];

    for (let j = 0, f = 0; j < line.length; j += 4, f++) {
      const name = line[j + 1];

      if (stacks.length <= f) {
        stacks.push([]);
      }

      if (name === " ") {
        continue;
      }

      if (name === "1") {
        break;
      }

      stacks[f].push(name);
    }

    i++;
  }

  return [stacks.map((stack) => stack.reverse()), i + 1];
};

const readMovingLine = (line: string): [number, number, number] => {
  const [_1, amount, _2, from, _3, to] = line
    .split(" ")
    .map((s) => parseInt(s, 10));

  return [amount, from, to];
};

const part1 = () => {
  let [stacks, index] = readStacks();

  while (index < lines.length) {
    const [amount, from, to] = readMovingLine(lines[index]);

    for (let j = 0; j < amount; j++) {
      const item = stacks[from - 1].pop();
      stacks[to - 1].push(item);
    }

    index++;
  }

  return stacks.map((stack) => stack[stack.length - 1]).join("");
};

const part2 = () => {
  let [stacks, index] = readStacks();

  while (index < lines.length) {
    const [amount, from, to] = readMovingLine(lines[index]);

    let movingPart = [];

    for (let j = 0; j < amount; j++) {
      const item = stacks[from - 1].pop();
      movingPart.push(item);
    }

    movingPart = movingPart.reverse();
    stacks[to - 1] = [...stacks[to - 1], ...movingPart];

    index++;
  }

  return stacks.map((stack) => stack[stack.length - 1]).join("");
};

console.log(part1());
console.log(part2());
