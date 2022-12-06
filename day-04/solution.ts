import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const part1 = () => {
  let result = 0;

  lines.forEach((line) => {
    const [pair1, pair2] = line.split(",");
    const [pair1A, pair1B] = pair1.split("-").map((item) => parseInt(item, 10));
    const [pair2A, pair2B] = pair2.split("-").map((item) => parseInt(item, 10));

    if (pair1A <= pair2A && pair1B >= pair2B) {
      result++;
    } else if (pair1A >= pair2A && pair1B <= pair2B) {
      result++;
    }
  });

  return result;
};

const part2 = () => {
  let result = 0;


  lines.forEach((line) => {
    const [pair1, pair2] = line.split(",");
    const [pair1A, pair1B] = pair1.split("-").map((item) => parseInt(item, 10));
    const [pair2A, pair2B] = pair2.split("-").map((item) => parseInt(item, 10));

    if (pair2A >= pair1A && pair2A <= pair1B) {
      result++;
    } else if (pair2B >= pair1A && pair2B <= pair1B) {
      result++;
    } else if (pair1A >= pair2A && pair1A <= pair2B) {
      result++;
    } else if (pair1B >= pair2A && pair1B <= pair2B) {
      result++;
    }
  });

  return result;
};

console.log(part1());
console.log(part2());
