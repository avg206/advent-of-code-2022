import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const HEAD_MOVES = {
  L: [0, -1],
  R: [0, +1],
  U: [+1, 0],
  D: [-1, 0],
};

type Rope = [number, number][];

const packCoords = ([x, y]: [number, number]): string => `${x}__${y}`;

const renderRope = (rope: Rope, useNumbers = true, size: number) => {
  const cells = {};

  for (let i = 0; i < rope.length; i++) {
    if (useNumbers) {
      cells[packCoords(rope[i])] = i === 0 ? "H" : i;
    } else {
      cells[packCoords(rope[i])] = "#";
    }
  }

  for (let i = -1 * size; i <= size; i++) {
    let row = "";

    for (let j = -1 * size; j <= size; j++) {
      const cell = cells[packCoords([i, j])];

      if (cell) {
        row = `${row}${cell}`;
      } else {
        row = `${row}.`;
      }
    }

    console.log(row);
  }
  console.log("--");
};

const solution = (ropeSize: number) => {
  const visitedCells = new Set();

  const calculateNewPositions = (rope: Rope, move: [number, number]): Rope => {
    const newRope = [...rope].map((cell) => [...cell]) as Rope;
    newRope[0][0] = rope[0][0] + move[0];
    newRope[0][1] = rope[0][1] + move[1];

    for (let i = 1; i < rope.length; i++) {
      const H = newRope[i - 1];
      const T = newRope[i];

      if (Math.abs(H[0] - T[0]) <= 1 && Math.abs(H[1] - T[1]) <= 1) {
        continue;
      }

      if (H[0] !== T[0]) {
        T[0] += T[0] < H[0] ? 1 : -1;
      }

      if (H[1] !== T[1]) {
        T[1] += T[1] < H[1] ? 1 : -1;
      }
    }

    return newRope;
  };

  let rope: Rope = new Array(ropeSize).fill([0, 0]);

  visitedCells.add(packCoords([0, 0]));

  for (const line of lines) {
    const [direction, steps] = line.split(" ");
    const stepsNumber = parseInt(steps, 10);

    for (let i = 0; i < stepsNumber; i++) {
      rope = calculateNewPositions(rope, HEAD_MOVES[direction]);

      visitedCells.add(`${packCoords(rope[rope.length - 1])}`);
    }
  }

  const result = Array.from(visitedCells);

  return result.length;
};

console.log(solution(2));
console.log(solution(10));
