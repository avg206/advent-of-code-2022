const fs = require("fs");
const path = require("path");

export const readFile = (dayFolder, fileName) => {
  return fs.readFileSync(path.resolve(dayFolder, fileName)).toString();
};

export const readFileLines = <T>(
  dayFolder,
  fileName,
  mapLines: (line: string) => T
): T[] => {
  const text = readFile(dayFolder, fileName);

  return text.split("\n").map(mapLines);
};

export const defaultLineMapper = (line: string): string => line;
