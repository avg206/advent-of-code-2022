import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

type Point = [number, number];
const isPoint = (point: unknown): point is Point => Array.isArray(point);

const solution = (addBottomLine: boolean) => {
  const n = 1000;
  let map = new Array(n).fill(0).map(() => new Array(n).fill(0));
  let maxY = 0;

  for (const line of lines) {
    const points = line.split(" -> ").map((point) =>
      point
        .split(",")
        .reverse()
        .map((coord) => parseInt(coord, 10))
    );

    let from = points[0];
    maxY = Math.max(from[0], maxY);

    for (let i = 1; i < points.length; i++) {
      const to = points[i];
      maxY = Math.max(to[0], maxY);

      if (from[0] === to[0]) {
        for (
          let j = Math.min(from[1], to[1]);
          j <= Math.max(from[1], to[1]);
          j++
        ) {
          map[from[0]][j] = 1;
        }
      }

      if (from[1] === to[1]) {
        for (
          let j = Math.min(from[0], to[0]);
          j <= Math.max(from[0], to[0]);
          j++
        ) {
          map[j][from[1]] = 1;
        }
      }

      from = to;
    }
  }

  if (addBottomLine) {
    for (let i = 0; i < n; i++) {
      map[maxY + 2][i] = 1;
    }
  }

  const putSand = (start) => {
    const checkCell = ([x, y]: Point): -1 | 1 | 0 => {
      if (x < 0 || x >= n || y < 0 || y >= n) return -1;
      if (map[x][y] === 0) return 1;
      if (map[x][y] === -1) return -1;

      return 0;
    };

    const MOVES = [
      [+1, 0],
      [+1, -1],
      [+1, +1],
    ];

    const moveSand = (point: Point): -1 | 0 | Point => {
      const check = checkCell(point);

      if (check === -1) return -1;
      if (check === 0) return 0;

      for (const move of MOVES) {
        const newPoint: Point = [point[0] + move[0], point[1] + move[1]];
        const check = moveSand(newPoint);

        if (isPoint(check)) return check;

        if (check === -1) {
          map[point[0]][point[1]] = -1;
          return -1;
        }
      }

      return point;
    };

    const check = moveSand(start);

    if (check === -1) throw new Error("finish");
    if (check === 0) throw new Error("finish");

    return check;
  };

  let answer = 0;
  while (true) {
    try {
      const [x, y] = putSand([0, 500]);

      map[x][y] = 2;
      answer++;
    } catch {
      break;
    }
  }

  // console.log(
  //   map
  //     .slice(0, 10)
  //     .map((row) =>
  //       row
  //         .slice(490)
  //         .map((cell) => {
  //           if (cell === 0) return ".";
  //           if (cell === 1) return "#";
  //           if (cell === 2) return "o";
  //           if (cell === -1) return "~";
  //         })
  //         .join("")
  //     )
  //     .join("\n")
  // );

  return answer;
};

console.log(solution(false));
console.log(solution(true));
