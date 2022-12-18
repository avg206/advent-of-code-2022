import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const MOVES = [
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
  [1, 0, 0],
  [-1, 0, 0],
];

const part1 = () => {
  const cubes = [];
  const cubesSet = new Set();

  for (const line of lines) {
    const [x, y, z] = line.split(",").map((cell) => parseInt(cell, 10));

    cubes.push([x, y, z]);
    cubesSet.add(`${x}__${y}__${z}`);
  }

  let answer = 0;

  for (const cube of cubes) {
    for (const move of MOVES) {
      const nx = cube[0] + move[0];
      const ny = cube[1] + move[1];
      const nz = cube[2] + move[2];

      if (!cubesSet.has(`${nx}__${ny}__${nz}`)) {
        answer++;
      }
    }
  }

  return answer;
};

const part2 = () => {
  const N = 30; //max coordinate + gap
  const GAP = 5;

  const cubes = [];
  const cubesSet = new Set();

  const map = new Array(N)
    .fill(0)
    .map(() => new Array(N).fill(0).map(() => new Array(N).fill(0)));

  for (const line of lines) {
    const [x, y, z] = line.split(",").map((cell) => parseInt(cell, 10) + GAP);

    map[x][y][z] = 1;

    cubes.push([x, y, z]);
    cubesSet.add(`${x}__${y}__${z}`);
  }

  const queue = [[0, 0, 0]];

  while (queue.length) {
    const [x, y, z] = queue.shift();

    for (const move of MOVES) {
      const nx = x + move[0];
      const ny = y + move[1];
      const nz = z + move[2];

      if (nx < 0 || nx === N || ny < 0 || ny === N || nz < 0 || nz === N) {
        continue;
      }

      if (map[nx][ny][nz] === 1) {
        continue;
      }

      map[nx][ny][nz] = 1;
      queue.push([nx, ny, nz]);
    }
  }

  let answer = 0;

  for (const cube of cubes) {
    for (const move of MOVES) {
      const nx = cube[0] + move[0];
      const ny = cube[1] + move[1];
      const nz = cube[2] + move[2];

      if (!cubesSet.has(`${nx}__${ny}__${nz}`) && map[nx][ny][nz] === 1) {
        answer++;
      }
    }
  }

  return answer;
};

console.log("Part 1 - ", part1());
console.log("Part 2 - ", part2());
