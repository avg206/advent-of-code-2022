import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const compare = (left: unknown, right: unknown): number => {
  if (typeof left === "number" && typeof right === "number") {
    return right - left;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      const result = compare(left[i], right[i]);

      if (result !== 0) {
        return result;
      }
    }

    return right.length - left.length;
  }

  if (typeof left === "number") {
    return compare([left], right);
  }

  if (typeof right === "number") {
    return compare(left, [right]);
  }

  throw new Error(`Wrong input - ${left}, ${right}`);
};

const part1 = () => {
  let answer = 0;
  let index = 0;

  for (let i = 0; i < lines.length; i += 3) {
    index++;
    const left = JSON.parse(lines[i]);
    const right = JSON.parse(lines[i + 1]);

    if (compare(left, right) > 0) {
      answer += index;
      // console.log("++", " ", index, " ", left, " - ", right);
    } else {
      // console.log("--", " ", index, " ", left, " - ", right);
    }
  }

  return answer;
};

const part2 = () => {
  const pack2 = [[2]];
  const pack6 = [[6]];

  let packages = [pack2, pack6];

  for (let i = 0; i < lines.length; i += 3) {
    packages.push(JSON.parse(lines[i]));
    packages.push(JSON.parse(lines[i + 1]));
  }

  packages = packages.sort(compare).reverse();

  const index2 = packages.findIndex((pack) => pack === pack2) + 1;
  const index6 = packages.findIndex((pack) => pack === pack6) + 1;

  // console.log(packages.map((pack) => JSON.stringify(pack)).join("\n"));

  return index2 * index6;
};

console.log(part1());
console.log(part2());
