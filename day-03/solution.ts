import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const convertCharToPriority = (char: string): number => {
  const ACode = "A".charCodeAt(0);
  const aCode = "a".charCodeAt(0);

  const charCode = char.charCodeAt(0);

  if (char >= "A" && char <= "Z") {
    return charCode - ACode + 1 + 26;
  } else {
    return charCode - aCode + 1;
  }
};

const part1 = () => {
  const findItemInLine = (line: string): string => {
    const setL = new Set<string>();
    const setR = new Set<string>();

    for (let i = 0; i < line.length; i++) {
      if (i < line.length / 2) {
        setL.add(line[i]);
      } else {
        setR.add(line[i]);
      }
    }

    for (const i of setL.values()) {
      if (setR.has(i)) {
        return i;
      }
    }

    for (const i of setR.values()) {
      if (setL.has(i)) {
        return i;
      }
    }

    throw new Error(`nothing - ${line}`);
  };

  return lines
    .map(findItemInLine)
    .map(convertCharToPriority)
    .reduce((acc, char) => acc + char, 0);
};

const part2 = () => {
  const findItemInLine = (
    line1: string,
    line2: string,
    line3: string
  ): string => {
    const set1 = new Set<string>();
    const set2 = new Set<string>();
    const set3 = new Set<string>();

    for (const char of line1) {
      set1.add(char);
    }

    for (const char of line2) {
      set2.add(char);
    }

    for (const char of line3) {
      set3.add(char);
    }

    for (const i of set1.values()) {
      if (set2.has(i) && set3.has(i)) {
        return i;
      }
    }

    for (const i of set2.values()) {
      if (set1.has(i) && set3.has(i)) {
        return i;
      }
    }

    for (const i of set3.values()) {
      if (set2.has(i) && set1.has(i)) {
        return i;
      }
    }

    throw new Error(`nothing - ${line1}`);
  };

  const result = [];
  let index = 0;

  while (index < lines.length - 1) {
    result.push(
      findItemInLine(lines[index], lines[index + 1], lines[index + 2])
    );

    index += 3;
  }

  return result.map(convertCharToPriority).reduce((acc, char) => acc + char, 0);
};

console.log(part1());
console.log(part2());
