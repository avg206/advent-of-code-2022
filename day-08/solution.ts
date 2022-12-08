import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) =>
  line.split("").map((item) => parseInt(item, 10))
);

const checkTree = (i: number, j: number): [number, number] => {
  const n = lines.length;
  const m = lines[0].length;

  const STEPS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const map = new Array(n).fill(0).map(() => new Array(m).fill(0));
  map[i][j] = 1;

  let reachedTheCorner = false;
  let sidesMultiplication = 1;

  for (const step of STEPS) {
    const tree = lines[i][j];
    let sideLength = 0;

    for (
      let x = i + step[0], y = j + step[1];
      x >= 0 && y >= 0 && x < n && y < m;
      x += step[0], y += step[1]
    ) {
      map[x][y] = 1;
      sideLength++;

      if (lines[x][y] >= tree) {
        break;
      }

      if (x === 0 || x === n - 1 || y === 0 || y === m - 1) {
        reachedTheCorner = true;
        break;
      }
    }

    sidesMultiplication *= sideLength;
  }

  return [sidesMultiplication, reachedTheCorner ? 1 : 0];
};

const solution = () => {
  const n = lines.length;
  const m = lines[0].length;
  const treesMap = new Array(n).fill(0).map(() => new Array(m).fill(0));

  let visibleTrees = 0;
  let bestViewFromTree = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (i === 0 || j === 0 || i === n - 1 || j === m - 1) {
        treesMap[i][j] = 1;
        visibleTrees++;

        continue;
      }

      const [viewSize, checkResult] = checkTree(i, j);

      treesMap[i][j] = checkResult;
      bestViewFromTree = Math.max(bestViewFromTree, viewSize);

      visibleTrees += treesMap[i][j];
    }
  }

  console.log("Part 1:", visibleTrees);
  console.log("Part 2:", bestViewFromTree);

  // console.log(result.map((line) => line.join()).join("\n"));
};

solution();
