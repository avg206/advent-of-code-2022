import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const readInstructions = () => {
  return lines[lines.length - 1].split("R").reduce((acc, curr, index) => {
    const cell = curr.split("L").reduce((acc1, curr1, index1) => {
      if (index1 !== 0) acc1.push("L");
      acc1 = acc1.concat(parseInt(curr1, 10));
      return acc1;
    }, []);

    if (index !== 0) acc.push("R");
    acc = acc.concat(cell);
    return acc;
  }, []);
};

const part1 = () => {
  const DIRECTIONS = {
    0: [0, 1],
    1: [1, 0],
    2: [0, -1],
    3: [-1, 0],
  };

  const N = lines.length - 2;
  const M = Math.max(
    ...lines.slice(0, lines.length - 1).map((line) => line.length)
  );

  const map = new Array(N + 2).fill(0).map(() => new Array(M + 2).fill(0));

  let position = null;

  for (let i = 0; i < N; i++) {
    if (lines[i] === "\n") break;

    for (let j = 0; j < M; j++) {
      if (lines[i][j] === ".") map[i + 1][j + 1] = 1;
      if (lines[i][j] === "#") map[i + 1][j + 1] = 2;

      if (lines[i][j] === "." && position === null) {
        position = [i + 1, j + 1];
      }
    }
  }

  const steps = [...map].map((row) => [...row]);

  const move = (position: [number, number], dir: number): [number, number] => {
    let nx = position[0] + DIRECTIONS[dir][0];
    let ny = position[1] + DIRECTIONS[dir][1];

    while (map[nx][ny] === 0) {
      nx = nx + DIRECTIONS[dir][0];
      ny = ny + DIRECTIONS[dir][1];

      if (nx < 0) nx = map.length - 1;
      if (nx === map.length) nx = 0;
      if (ny < 0) ny = map[0].length - 1;
      if (ny === map[0].length) ny = 0;
    }

    if (map[nx][ny] === 1) return [nx, ny];
    if (map[nx][ny] === 2) return position;

    return [nx, ny];
  };

  let instructions = readInstructions();
  let dir = 0;

  for (const instr of instructions) {
    if (instr === "R") {
      dir = (dir + 1) % 4;
      continue;
    }
    if (instr === "L") {
      dir = dir - 1;
      if (dir === -1) dir = 3;
      continue;
    }

    for (let j = 0; j < instr; j++) {
      steps[position[0]][position[1]] = 3 + dir;
      position = move(position, dir);
    }
  }

  return position[0] * 1000 + position[1] * 4 + dir;
};

const part2 = () => {
  const DIRECTIONS = {
    0: [0, 1], //   right
    1: [1, 0], //   down
    2: [0, -1], //  left
    3: [-1, 0], //  up
  };

  const MOVES = {
    1: {
      0: null,
      1: null,
      2: [4, 0],
      3: [6, 0],
    },
    2: {
      0: [5, 2],
      1: [3, 2],
      2: null,
      3: [6, 3],
    },
    3: {
      0: [2, 3],
      1: null,
      2: [4, 1],
      3: null,
    },
    4: {
      0: null,
      1: null,
      2: [1, 0],
      3: [3, 0],
    },
    5: {
      0: [2, 2],
      1: [6, 2],
      2: null,
      3: null,
    },
    6: {
      0: [5, 3],
      1: [2, 1],
      2: [1, 1],
      3: null,
    },
  };

  const MUTATORS = {
    "1_4": {
      x: (dx: number, dy: number): number => ZONE_SIDE - dx - 1,
      y: (dx: number, dy: number): number => 0,
    },
    "1_6": {
      x: (dx: number, dy: number): number => dy,
      y: (dx: number, dy: number): number => 0,
    },
    "2_5": {
      x: (dx: number, dy: number): number => ZONE_SIDE - dx - 1,
      y: (dx: number, dy: number): number => ZONE_SIDE - 1,
    },
    "2_3": {
      x: (dx: number, dy: number): number => dy,
      y: (dx: number, dy: number): number => ZONE_SIDE - 1,
    },
    "2_6": {
      x: (dx: number, dy: number): number => ZONE_SIDE - 1,
      y: (dx: number, dy: number): number => dy,
    },
    "3_2": {
      x: (dx: number, dy: number): number => ZONE_SIDE - 1,
      y: (dx: number, dy: number): number => dx,
    },
    "3_4": {
      x: (dx: number, dy: number): number => 0,
      y: (dx: number, dy: number): number => dx,
    },
    "4_1": {
      x: (dx: number, dy: number): number => ZONE_SIDE - dx - 1,
      y: (dx: number, dy: number): number => 0,
    },
    "4_3": {
      x: (dx: number, dy: number): number => dy,
      y: (dx: number, dy: number): number => 0,
    },
    "5_2": {
      x: (dx: number, dy: number): number => ZONE_SIDE - dx - 1,
      y: (dx: number, dy: number): number => ZONE_SIDE - 1,
    },
    "5_6": {
      x: (dx: number, dy: number): number => dy,
      y: (dx: number, dy: number): number => ZONE_SIDE - 1,
    },
    "6_5": {
      x: (dx: number, dy: number): number => ZONE_SIDE - 1,
      y: (dx: number, dy: number): number => dx,
    },
    "6_2": {
      x: (dx: number, dy: number): number => 0,
      y: (dx: number, dy: number): number => dy,
    },
    "6_1": {
      x: (dx: number, dy: number): number => 0,
      y: (dx: number, dy: number): number => dx,
    },
  };

  const N = lines.length - 2;
  const M = Math.max(
    ...lines.slice(0, lines.length - 1).map((line) => line.length)
  );

  const map = new Array(N + 2).fill(0).map(() => new Array(M + 2).fill(0));

  let position = null;

  for (let i = 0; i < N; i++) {
    if (lines[i] === "\n") break;

    for (let j = 0; j < M; j++) {
      if (lines[i][j] === ".") map[i + 1][j + 1] = 1;
      if (lines[i][j] === "#") map[i + 1][j + 1] = 2;

      if (lines[i][j] === "." && position === null) {
        position = [i + 1, j + 1];
      }
    }
  }

  const ZONE_SIDE = 50;
  const ZONES_INDEX = [1, 2, 3, 4, 5, 6];
  const ZONES = {
    1: [
      [1, 50],
      [51, 100],
    ],
    2: [
      [1, 50],
      [101, 150],
    ],
    3: [
      [51, 100],
      [51, 100],
    ],
    4: [
      [101, 150],
      [1, 50],
    ],
    5: [
      [101, 150],
      [51, 100],
    ],
    6: [
      [151, 200],
      [1, 50],
    ],
  };
  const ZONE_POSITION = {
    1: [1, 2],
    2: [1, 3],
    3: [2, 2],
    4: [3, 1],
    5: [3, 2],
    6: [4, 1],
  };

  const steps = [...map].map((row) => [...row]);

  const rotateCoordinates = (
    position: [number, number],
    from_zone: number,
    to_zone: number
  ): [number, number] => {
    let tx = position[0] - (ZONE_POSITION[from_zone][0] - 1) * ZONE_SIDE - 1;
    let ty = position[1] - (ZONE_POSITION[from_zone][1] - 1) * ZONE_SIDE - 1;

    const mutator = MUTATORS[`${from_zone}_${to_zone}`];

    let nx = mutator.x(tx, ty);
    let ny = mutator.y(tx, ty);

    nx = nx + (ZONE_POSITION[to_zone][0] - 1) * ZONE_SIDE + 1;
    ny = ny + (ZONE_POSITION[to_zone][1] - 1) * ZONE_SIDE + 1;

    return [nx, ny];
  };

  const move = (
    position: [number, number],
    dir: number
  ): [[number, number], number] => {
    let nx = position[0] + DIRECTIONS[dir][0];
    let ny = position[1] + DIRECTIONS[dir][1];

    if (map[nx][ny] === 0) {
      const zone = ZONES_INDEX.find(
        (index) =>
          position[0] >= ZONES[index][0][0] &&
          position[0] <= ZONES[index][0][1] &&
          position[1] >= ZONES[index][1][0] &&
          position[1] <= ZONES[index][1][1]
      );

      if (zone === undefined) throw new Error("fatal");

      const [to_zone, new_dir] = MOVES[zone][dir];

      [nx, ny] = rotateCoordinates(position, zone, to_zone);
      if (map[nx][ny] !== 2) dir = new_dir;
    }

    if (map[nx][ny] === 1) return [[nx, ny], dir];
    if (map[nx][ny] === 2) return [position, dir];

    throw new Error("fatal");
  };

  let instructions = readInstructions();
  let dir = 0;

  for (const instr of instructions) {
    if (instr === "R") {
      dir = (dir + 1) % 4;
      continue;
    }
    if (instr === "L") {
      dir = dir - 1;
      if (dir === -1) dir = 3;
      continue;
    }

    for (let j = 0; j < instr; j++) {
      steps[position[0]][position[1]] = 3 + dir;
      [position, dir] = move(position, dir);
    }
  }

  return position[0] * 1000 + position[1] * 4 + dir;
};

console.log("Part 1 - ", part1());
console.log("Part 2 - ", part2());
