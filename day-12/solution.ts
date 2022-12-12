import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const solution = () => {
  const n = lines.length;
  const m = lines[0].length;
  const map = new Array(n).fill(0).map(() => new Array(m).fill(0));

  let start = [];
  let end = [];
  const aCode = "a".charCodeAt(0);
  const aCells = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (lines[i][j] === "S") {
        map[i][j] = 0;
        start = [i, j];
        continue;
      }

      if (lines[i][j] === "E") {
        map[i][j] = "z".charCodeAt(0) - aCode;
        end = [i, j];
        continue;
      }

      if (lines[i][j] === "a") {
        aCells.push([i, j]);
      }

      map[i][j] = lines[i][j].charCodeAt(0) - aCode;
    }
  }

  aCells.push(start);

  const MOVES = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ];
  const visited = new Array(n).fill(0).map(() => new Array(m).fill(0));
  const queue = [end];
  visited[end[0]][end[1]] = 1;

  while (queue.length) {
    const cell = queue.shift();

    for (const move of MOVES) {
      const newCell = [cell[0] + move[0], cell[1] + move[1]];

      if (
        newCell[0] < 0 ||
        newCell[0] === n ||
        newCell[1] < 0 ||
        newCell[1] === m
      ) {
        continue;
      }

      if (visited[newCell[0]][newCell[1]] !== 0) {
        continue;
      }

      if (map[newCell[0]][newCell[1]] - map[cell[0]][cell[1]] < -1) {
        continue;
      }

      visited[newCell[0]][newCell[1]] = visited[cell[0]][cell[1]] + 1;
      queue.push(newCell);
    }
  }

  const levels = aCells
    .map(([i, j]) => visited[i][j])
    .sort((a, b) => a - b)
    .filter((item) => item !== 0);

  // console.log(map.map((line) => line.join(" ")).join("\n"));
  // console.log("---");
  // console.log(visited.map((line) => line.join(" ")).join("\n"));
  // console.log("---");

  console.log("Part1:", visited[start[0]][start[1]] - 1);
  console.log("Part2:", levels[0] - 1);
};

solution();
