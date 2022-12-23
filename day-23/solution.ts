import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

type Point = [number, number];

const MOVES = [
  // N
  [
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ],
  // S
  [
    [1, 0],
    [1, 1],
    [1, -1],
  ],
  // E
  [
    [0, -1],
    [-1, -1],
    [1, -1],
  ],
  // W
  [
    [0, 1],
    [-1, 1],
    [1, 1],
  ],
];

const ACTUAL_MOVES = [
  /* N */ [-1, 0],
  /* S */ [1, 0],
  /* E */ [0, -1],
  /* W */ [0, 1],
];

const readFieldAndElves = (
  size: number,
  gap: number
): [number[][], Point[]] => {
  let field = new Array(size + gap * 2)
    .fill(0)
    .map(() => new Array(size + gap * 2).fill(0));
  let elves = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = lines[i][j];

      if (cell === "#") {
        field[i + gap][j + gap] = 1;
        elves.push([i + gap, j + gap]);
      }
    }
  }

  return [field, elves];
};

const tryToMove = (
  field: number[][],
  elves: Point[],
  moveIndex: number
): [number[][], Point[], boolean] => {
  const newField = new Array(field.length)
    .fill(0)
    .map(() => new Array(field.length).fill(0));

  const elvesMoves = new Array(elves.length).fill(0).fill(null);
  const newCells = new Map();

  const newElves = [];

  // Find the move
  for (let i = 0; i < elves.length; i++) {
    const elf = elves[i];

    let currentIndex = moveIndex;

    let moves = [0, 1, 2, 3].map((ind) => {
      return MOVES[ind].some((move, index) => {
        const nx = elf[0] + move[0];
        const ny = elf[1] + move[1];

        return field[nx][ny] === 1;
      });
    });

    if (!moves.some((ind) => ind === true)) {
      continue;
    }

    do {
      if (!moves[currentIndex]) {
        const nx = elf[0] + ACTUAL_MOVES[currentIndex][0];
        const ny = elf[1] + ACTUAL_MOVES[currentIndex][1];

        const key = `${nx}_${ny}`;

        newCells.set(key, (newCells.get(key) || 0) + 1);
        elvesMoves[i] = [nx, ny];

        break;
      }

      currentIndex = (currentIndex + 1) % MOVES.length;
    } while (currentIndex !== moveIndex);
  }

  // Try to move
  for (let i = 0; i < elves.length; i++) {
    if (elvesMoves[i] !== null) {
      const [x, y] = elvesMoves[i];
      if (newCells.get(`${x}_${y}`) === 1) {
        newField[x][y] = 1;
        newElves.push([x, y]);

        continue;
      }
    }

    newField[elves[i][0]][elves[i][1]] = 1;
    newElves.push(elves[i]);
  }

  if (elves.length !== newElves.length) {
    throw new Error("Something went wrong");
  }

  return [newField, newElves, elvesMoves.some((move) => move !== null)];
};

const part1 = (rounds: number) => {
  const N = lines.length;
  const GAP = 20;

  let [field, elves] = readFieldAndElves(N, GAP);

  let moveIndex = 0;
  for (let r = 0; r < rounds; r++) {
    [field, elves] = tryToMove(field, elves, moveIndex);

    moveIndex = (moveIndex + 1) % MOVES.length;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1 * Infinity;
  let maxY = -1 * Infinity;

  for (const elf of elves) {
    minX = Math.min(minX, elf[0]);
    maxX = Math.max(maxX, elf[0]);

    minY = Math.min(minY, elf[1]);
    maxY = Math.max(maxY, elf[1]);
  }

  let answer = 0;
  for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
      if (field[i][j] === 0) {
        answer++;
      }
    }
  }

  return answer;
};

const part2 = () => {
  const N = lines.length;
  const GAP = 100;

  let [field, elves] = readFieldAndElves(N, GAP);
  let hasMoved = true;

  let moveIndex = 0;
  let r = 0;

  while (true) {
    [field, elves, hasMoved] = tryToMove(field, elves, moveIndex);

    if (!hasMoved) {
      return r + 1;
    }

    r++;
    moveIndex = (moveIndex + 1) % MOVES.length;
  }
};

console.log("Part 1 - ", part1(10));
console.log("Part 2 - ", part2());
