import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const MAP = {
  "2": 2,
  "1": 1,
  "0": 0,
  "-": -1,
  "=": -2,
};

const REVERSE_MAP = {
  0: "0",
  1: "1",
  2: "2",
  3: "=",
  4: "-",
};

const snafuToNumeric = (snafu: string): number => {
  let result = 0;

  for (let i = 0; i < snafu.length; i++) {
    result += MAP[snafu[i]] * 5 ** (snafu.length - i - 1);
  }

  return result;
};

const numericToSnafu = (number: number): string => {
  const result = [];

  let tmp = 0;
  while (number) {
    const v = (number + tmp) % 5;

    if (v > 2) {
      tmp = 1;
    } else {
      tmp = 0;
    }

    result.push(REVERSE_MAP[v]);

    number = Math.trunc(number / 5);
  }

  return result.reverse().join("");
};

const part1 = () => {
  let sum = 0;

  for (const line of lines) {
    const number = snafuToNumeric(line);
    // console.log(line, " -> ", number);
    sum += number;
  }

  // console.log("Sum", sum);

  return numericToSnafu(sum);
};

console.log("Part 1 - ", part1());
