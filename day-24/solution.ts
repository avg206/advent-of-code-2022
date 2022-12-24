import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const MOVES = {
  ">": [0, 1],
  "<": [0, -1],
  "^": [-1, 0],
  v: [1, 0],
};

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [1, 0],
];

type Point = [number, number];
type Blizzard = { dir: string; point: Point };

const moveBlizzards = (
  current: Blizzard[],
  N: number,
  M: number
): [Blizzard[], Set<string>] => {
  const newBlizzards = [];
  const newBlizzardsPoints = new Set<string>();

  for (const { dir, point } of current) {
    let nx = point[0] + MOVES[dir][0];
    let ny = point[1] + MOVES[dir][1];

    // validate
    if (nx === 0) {
      nx = N - 2;
    } else if (nx === N - 1) {
      nx = 1;
    } else if (ny === 0) {
      ny = M - 2;
    } else if (ny === M - 1) {
      ny = 1;
    }

    newBlizzards.push({ dir, point: [nx, ny] });
    newBlizzardsPoints.add(`${nx}_${ny}`);
  }

  return [newBlizzards, newBlizzardsPoints];
};

const solution = (moves: [string, string][]) => {
  const N = lines.length;
  const M = lines[0].length;

  let blizzards = [];
  let blizzardsPoints = new Set();

  let start = null;
  let finish = null;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (lines[i][j] === "." && i === 0) {
        start = [i, j];
      }

      if (lines[i][j] === "." && i === N - 1) {
        finish = [i, j];
      }

      if (lines[i][j] !== "#" && lines[i][j] !== ".") {
        blizzards.push({ dir: lines[i][j], point: [i, j] });
        blizzardsPoints.add(`${i}_${j}`);
      }
    }
  }

  let answer = 0;

  const startKey = `${start[0]}_${start[1]}`;
  const finalKey = `${finish[0]}_${finish[1]}`;

  const MOVEMENTS = moves.map((move) =>
    move.map((point) => {
      if (point === "S") return startKey;
      if (point === "F") return finalKey;

      throw new Error("unknown point");
    })
  );

  for (const move of MOVEMENTS) {
    let currentCells = new Set<string>([move[0]]);
    let time = 0;

    while (!currentCells.has(move[1])) {
      time = time + 1;

      [blizzards, blizzardsPoints] = moveBlizzards(blizzards, N, M);
      const newCells = new Set<string>();

      for (const cell of currentCells.keys()) {
        const [x, y] = cell.split("_").map((c) => parseInt(c, 10));

        if (!blizzardsPoints.has(cell)) {
          newCells.add(cell);
        }

        for (const dir of DIRECTIONS) {
          const nx = x + dir[0];
          const ny = y + dir[1];

          const key = `${nx}_${ny}`;

          if (nx < 0 || nx === N || ny < 0 || ny === M) {
            continue;
          }

          if (lines[nx][ny] === "#") {
            continue;
          }

          if (!blizzardsPoints.has(key)) {
            newCells.add(key);
          }
        }
      }

      currentCells = newCells;
    }

    // console.log(`${move[0]} -> ${move[1]}`, time);
    answer += time;
  }

  return answer;
};

console.log("Part 1 - ", solution([["S", "F"]]));
console.log(
  "Part 2 - ",
  solution([
    ["S", "F"],
    ["F", "S"],
    ["S", "F"],
  ])
);
