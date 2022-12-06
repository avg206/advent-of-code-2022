import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const solution = (input: string, number: number) => {
  for (let i = 0; i < input.length - number; i++) {
    const set = new Set();

    for (let j = 0; j < number; j++) {
      set.add(input[i + j]);
    }

    const arr = Array.from(set.values());

    if (arr.length === number) {
      return i + number;
    }
  }

  return -1;
};

console.log(solution("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 4));
console.log(solution("bvwbjplbgvbhsrlpgdmjqwftvncz", 4));
console.log(solution("nppdvjthqldpwncqszvftbrmjlhg", 4));
console.log(solution("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 4));
console.log(solution("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 4));
console.log(solution(lines[0], 4));

console.log("---");

console.log(solution("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14));
console.log(solution("bvwbjplbgvbhsrlpgdmjqwftvncz", 14));
console.log(solution("nppdvjthqldpwncqszvftbrmjlhg", 14));
console.log(solution("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 14));
console.log(solution("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 14));
console.log(solution(lines[0], 14));
