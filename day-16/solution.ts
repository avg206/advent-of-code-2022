import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const buildKey = (v1: string, v2: string) => {
  if (v1 > v2) {
    return `${v2}_${v1}`;
  }

  return `${v1}_${v2}`;
};

interface Valve {
  rate: number;
  tunnels: string[];
}
const readValves = (): [
  Record<string, Valve>,
  Record<string, boolean>,
  string[],
  Record<string, number>
] => {
  const valves = {};
  const opened = {};
  const ratedValves = [];

  for (const line of lines) {
    // Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
    const [valve, tunnels] = line.slice(6).split("; ");

    const [valveName, rate] = valve.split(" has flow rate=");
    const toTunnels = tunnels
      .split(", ")
      .map((tunnel) => tunnel.split(" ").slice(-1)[0]);

    opened[valveName] = false;
    valves[valveName] = {
      rate: parseInt(rate, 10),
      tunnels: toTunnels,
    };

    if (valves[valveName].rate > 0) {
      ratedValves.push(valveName);
    }
  }

  const shortestPath = (from: string): Record<string, number> => {
    const paths = Object.keys(valves).reduce((acc, curr) => {
      acc[buildKey(from, curr)] = Infinity - 1;
      return acc;
    }, {});

    paths[buildKey(from, from)] = 0;
    const queue = [from];

    while (queue.length) {
      const now = queue.shift();
      const nKey = buildKey(from, now);

      for (const to of valves[now].tunnels) {
        const key = buildKey(from, to);

        if (paths[key] > paths[nKey] + 1) {
          paths[key] = paths[nKey] + 1;

          queue.push(to);
        }
      }
    }

    return paths;
  };

  let distances: Record<string, number> = {};

  for (const from of Object.keys(valves)) {
    distances = {
      ...distances,
      ...shortestPath(from),
    };
  }

  return [valves, opened, ratedValves, distances];
};

const part1 = () => {
  const [valves, opened, ratedValves, distances] = readValves();

  opened["AA"] = true;

  const findMaxestRate = (
    currentValve: string,
    time: number,
    rate: number,
    path: string
  ): [number, string] => {
    if (time === 0) {
      return [rate, path];
    }

    let bestNewRate = rate;
    let bestPath = path;

    for (const valve of ratedValves) {
      const key = buildKey(currentValve, valve);

      if (distances[key] + 1 > time || opened[valve]) {
        continue;
      }

      opened[valve] = true;
      const [possibleRate, possiblePath] = findMaxestRate(
        valve,
        time - distances[key] - 1,
        rate + (time - distances[key] - 1) * valves[valve].rate,
        `${path}->${valve}(${distances[key] + 1})`
      );
      opened[valve] = false;

      if (possibleRate > bestNewRate) {
        bestNewRate = possibleRate;
        bestPath = possiblePath;
      }
    }

    return [bestNewRate, bestPath];
  };

  const [maxestRate] = findMaxestRate("AA", 30, 0, "AA");

  return maxestRate;
};

/**
 * Wait for 100 - 150 seconds and use last answer
 */
const part2 = () => {
  const [valves, opened, ratedValves, distances] = readValves();

  opened["AA"] = true;

  let maxRateFind = 0;
  const findMaxestRate = (
    currentValve: string,
    time: number,
    rate: number,
    path: string,
    elephant: boolean
  ) => {
    if (rate > maxRateFind) {
      console.log(rate, path);
      maxRateFind = rate;
    }

    if (time === 0) return;

    for (const valve of ratedValves) {
      const key = buildKey(currentValve, valve);

      if (distances[key] + 1 > time || opened[valve]) {
        continue;
      }

      opened[valve] = true;
      findMaxestRate(
        valve,
        time - distances[key] - 1,
        rate + (time - distances[key] - 1) * valves[valve].rate,
        `${path}->${valve}(${distances[key] + 1})`,
        elephant
      );

      if (!elephant) {
        findMaxestRate(
          "AA",
          26,
          rate + (time - distances[key] - 1) * valves[valve].rate,
          `${path}->${valve}(${distances[key] + 1})   `,
          true
        );
      }
      opened[valve] = false;
    }
  };

  findMaxestRate("AA", 26, 0, "", false);

  return maxRateFind;
};

console.log("Part 1 - ", part1());
console.log("Part 2 - ", part2());
