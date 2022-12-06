import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) =>
  parseInt(line, 10)
);

const snacks = [0];

for (const line of lines) {
  if (Number.isNaN(line)) {
    snacks.push(0);
    continue;
  }

  snacks[snacks.length - 1] += line;
}

const sorted = snacks.sort((a, b) => b - a);

// part one
console.log(sorted[0]);

// part two
console.log(sorted[0] + sorted[1] + sorted[2]);
