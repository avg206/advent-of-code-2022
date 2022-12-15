import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

/**
 * BEGIN
 */

interface Sensor {
  sensor: [number, number];
  beacon: [number, number];
  distanceToBeacon: number;
}

const calcDistance = ([x0, y0], [x1, y1]) =>
  Math.abs(x1 - x0) + Math.abs(y1 - y0);

const readTheLine = (line: string): Sensor => {
  // Sensor at x=2, y=18: closest beacon is at x=-2, y=15

  const [sensor, beacon] = line.slice(10).split(": closest beacon is at ");

  const sensorCoords = sensor
    .slice(2)
    .split(", y=")
    .map((item) => parseInt(item, 10)) as [number, number];

  const beaconCoords = beacon
    .slice(2)
    .split(", y=")
    .map((item) => parseInt(item, 10)) as [number, number];

  return {
    sensor: sensorCoords,
    beacon: beaconCoords,
    distanceToBeacon: calcDistance(sensorCoords, beaconCoords),
  };
};

const readSensors = (): Sensor[] => {
  return lines.map((line) => readTheLine(line));
};

const createChecker = (sensors: Sensor[]) => {
  return (x: number, y: number): boolean => {
    for (const sensor of sensors) {
      const distance = calcDistance([x, y], sensor.sensor);

      if (
        distance <= sensor.distanceToBeacon &&
        calcDistance([x, y], sensor.beacon) !== 0
      ) {
        return true;
      }
    }

    return false;
  };
};

const part1 = (y: number) => {
  const sensors = readSensors();
  const checkCoordinate = createChecker(sensors);
  const cells = new Set();

  for (const { sensor, beacon, distanceToBeacon } of sensors) {
    const dY = Math.abs(sensor[1] - y);

    const minX = sensor[0] + -1 * (distanceToBeacon + 1 - dY);
    const maxX = sensor[0] + (distanceToBeacon + 1 - dY);

    for (let nX = minX; nX <= maxX; nX++) {
      if (checkCoordinate(nX, y)) {
        cells.add(`${nX}__${y}`);
      }
    }
  }

  return cells.size;
};

const part2 = (limit: number) => {
  const sensors = readSensors();
  const checkCoordinate = createChecker(sensors);

  const MOVES = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (const { sensor, distanceToBeacon } of sensors) {
    for (const move of MOVES) {
      for (let dX = 0; dX <= distanceToBeacon + 1; dX++) {
        const dY = distanceToBeacon + 1 - dX;

        const nX = sensor[0] + dX * move[0];
        const nY = sensor[1] + dY * move[1];

        if (nX < 0 || nX > limit || nY < 0 || nY > limit) {
          continue;
        }

        if (!checkCoordinate(nX, nY)) {
          return nX * limit + nY;
        }
      }
    }
  }
};

console.log("Part 1 - ", part1(2000000));
console.log("Part 2 - ", part2(4000000));
