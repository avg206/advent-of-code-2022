import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

type Point = [number, number];

const rocks: Point[][] = [
  // ####
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  // .#.
  // ###
  // .#.
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
  ],
  // ..#
  // ..#
  // ###
  [
    [0, 2],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  // #
  // #
  // #
  // #
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  // ##
  // ##
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
];
const rocksOffset = [0, 2, 2, 3, 1];

const part1 = (rocksLimit: number) => {
  const depth = 100000;
  const width = 7;
  const camber = new Array(depth).fill(0).map(() => new Array(width).fill(0));
  const instructions = lines[0].split("");

  const heightOffset = 3;
  let heightLevel = 1;

  const calculateNewHeightLevel = () => {
    for (let i = depth - 1; i >= 0; i--) {
      let empty = true;

      for (let j = 0; j < width; j++) {
        if (camber[i][j] === 1) {
          empty = false;
        }
      }

      if (empty) {
        return depth - i;
      }
    }

    throw new Error("no empty lines");
  };

  const renderCamber = (point?: Point, rock?: Point[]) => {
    const cells = [];

    if (point && rock) {
      for (const item of rock) {
        cells.push(`${point[0] + item[0]}__${point[1] + item[1]}`);
      }
    }

    for (let i = depth - heightLevel - heightOffset - 4; i < depth; i++) {
      let rowString = "";
      for (let j = 0; j < width; j++) {
        if (cells.includes(`${i}__${j}`)) {
          rowString += "@";
        } else if (camber[i][j] === 1) {
          rowString += "#";
        } else {
          rowString += ".";
        }
      }

      console.log(`|${rowString}|`);
    }

    console.log("+-------+");
  };

  const checkRockPoint = (point: Point, rock: Point[]): boolean => {
    for (const cell of rock) {
      const x = point[0] + cell[0];
      const y = point[1] + cell[1];

      if (x < 0 || x >= depth || y < 0 || y >= width) {
        return false;
      }

      if (camber[x][y] === 1) {
        return false;
      }
    }

    return true;
  };

  const placeRock = (point: Point, rock: Point[]) => {
    for (const cell of rock) {
      const x = point[0] + cell[0];
      const y = point[1] + cell[1];

      camber[x][y] = 1;
    }
  };

  let currentRock = 0;
  let instructionIndex = 0;
  const debugItem = null;
  let lastHeight = heightLevel;

  const diffs = [];

  for (let i = 0; i < rocksLimit; i++) {
    const rock = rocks[currentRock];

    let pointX = depth - heightOffset - heightLevel - rocksOffset[currentRock];
    let pointY = 2;

    if (i === debugItem) {
      console.log(i, "start");
      renderCamber([pointX, pointY], rock);
    }

    while (true) {
      const instruction = instructions[instructionIndex];
      instructionIndex = (instructionIndex + 1) % instructions.length;

      // Left/Right
      if (instruction === "<") {
        if (checkRockPoint([pointX, pointY - 1], rock)) {
          pointY = pointY - 1;
        }
      } else {
        if (checkRockPoint([pointX, pointY + 1], rock)) {
          pointY = pointY + 1;
        }
      }
      if (i === debugItem) {
        console.log(i, "left/right", instruction);
        renderCamber([pointX, pointY], rock);
      }
      // Bottom
      if (checkRockPoint([pointX + 1, pointY], rock)) {
        pointX = pointX + 1;
      } else {
        placeRock([pointX, pointY], rock);
        break;
      }

      if (i === debugItem) {
        console.log(i, "bottom");
        renderCamber([pointX, pointY], rock);
      }
    }

    heightLevel = calculateNewHeightLevel();

    if (currentRock === 0 && i !== 0) {
      // console.log(
      //   String(i).padStart(5),
      //   "-",
      //   String(lastHeight).padStart(5),
      //   "->",
      //   String(heightLevel).padStart(5),
      //   "--",
      //   heightLevel - lastHeight
      // );
      // console.log(i);
      diffs.push(heightLevel - lastHeight);
      lastHeight = heightLevel;
    }

    // renderCamber();
    currentRock = (currentRock + 1) % rocks.length;
  }

  // console.log(diffs);

  return heightLevel - 1;
};

const part2 = (rocks: bigint) => {
  let INITIAL_HEIGHT = 69n; // sum of first 9 repeats
  let INITIAL_NUMBER_OF_STEPS = 45n;
  let STEP_SIZE = 5n;

  const cycle =
    "8, 6, 8, 9, 8, 9, 8, 6, 12, 8, 10, 9, 9, 8, 9, 7, 9, 9, 10, 11, 7, 9, 8, 11, 11, 10, 6, 10, 6, 6, 8, 9, 5, 6, 10, 7, 7, 8, 8, 9, 6, 7, 5, 10, 7, 10, 11, 10, 11, 7, 4, 11, 3, 6, 6, 9, 6, 9, 11, 7, 6, 8, 6, 6, 8, 9, 10, 4, 11, 6, 6, 10, 6, 4, 6, 8, 6, 8, 12, 3, 7, 10, 9, 6, 8, 4, 13, 6, 8, 9, 7, 7, 6, 9, 8, 7, 9, 5, 10, 6, 6, 11, 8, 3, 7, 8, 7, 5, 8, 11, 9, 9, 7, 8, 6, 9, 11, 6, 10, 5, 6, 8, 13, 6, 8, 10, 9, 6, 9, 9, 10, 8, 9, 9, 9, 8, 7, 9, 6, 8, 10, 6, 10, 5, 7, 6, 6, 10, 7, 6, 11, 8, 5, 9, 12, 8, 10, 6, 7, 9, 8, 7, 6, 7, 7, 9, 10, 9, 7, 7, 10, 8, 9, 7, 6, 7, 11, 5, 8, 6, 4, 7, 6, 9, 5, 6, 9, 8, 10, 8, 8, 8, 13, 11, 6, 7, 3, 7, 6, 8, 8, 12, 8, 9, 7, 6, 6, 10, 7, 7, 7, 6, 8, 9, 9, 5, 6, 6, 6, 11, 7, 9, 9, 6, 13, 6, 6, 4, 7, 6, 12, 11, 8, 11, 7, 10, 6, 9, 7, 8, 11, 9, 8, 10, 6, 8, 9, 8, 7, 5, 7, 5, 6, 7, 6, 9, 11, 9, 8, 10, 11, 3, 7, 4, 6, 9, 6, 12, 8, 8, 6, 6, 11, 8, 6, 8, 9, 8, 9, 9, 13, 9, 5, 11, 5, 11, 9, 4, 8, 10, 9, 10, 12, 8, 6, 9, 10, 12, 8, 6, 3, 9, 6, 10, 12, 5, 10, 6, 13, 6, 10, 6, 8, 9, 10, 8, 7, 7, 7, 7, 8, 7, 8, 12, 10, 5, 9, 7, 6, 8, 10, 7, 11, 8, 9, 7, 9, 8, 7, 8, 9, 4, 6, 9, 12, 6, 10, 11, 5"
      .split(", ")
      .map((diff) => parseInt(diff, 10))
      .map((diff) => BigInt(diff));

  let cycleSum = cycle.reduce((a, b) => a + b, 0n);
  let cycleLength = BigInt(cycle.length) * STEP_SIZE;

  let rocksToCalc = rocks - INITIAL_NUMBER_OF_STEPS;

  let leftAfterCycles = rocksToCalc % cycleLength;
  let cycles = (rocksToCalc - leftAfterCycles) / cycleLength;

  let answer = INITIAL_HEIGHT + cycles * cycleSum;

  for (let i = 0; i < leftAfterCycles / STEP_SIZE; i++) {
    answer = answer + BigInt(cycle[i]);
  }

  return answer - 2n; // 1 from first chunk, 1 from all cycles
};

console.log("Part 1 - ", part1(2022));
console.log("Part 2 - ", part2(1000000000000n));
