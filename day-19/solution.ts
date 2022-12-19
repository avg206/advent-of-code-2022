import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

interface Blueprint {
  ore: [number];
  clay: [number];
  obsidian: [number, number];
  geode: [number, number];
}

const readBlueprints = (): Blueprint[] => {
  return lines.map((line) => {
    const items = line
      .slice(15)
      .split(". ")
      .map((item) =>
        item
          .split(" ")
          .filter((item) => !isNaN(Number(item)))
          .map((item) => parseInt(item, 10))
      );

    return {
      ore: items[0],
      clay: items[1],
      obsidian: items[2],
      geode: items[3],
    } as Blueprint;
  });
};

const calculateQuality = (blueprint: Blueprint, TIME: number): number => {
  const memo = new Map<string, number>();

  const search = (
    ore: number,
    clay: number,
    obsidian: number,
    n_ore: number,
    n_clay: number,
    n_obsidian: number,
    time: number
  ): number => {
    const key = [ore, clay, obsidian, n_ore, n_clay, n_obsidian, time].join(
      "_"
    );

    if (memo.has(key)) {
      return memo.get(key);
    }

    if (time === 0) return 0;

    if (ore >= blueprint.geode[0] && obsidian >= blueprint.geode[1]) {
      return (
        search(
          ore + n_ore - blueprint.geode[0],
          clay + n_clay,
          obsidian + n_obsidian - blueprint.geode[1],
          n_ore,
          n_clay,
          n_obsidian,
          time - 1
        ) +
        (time - 1) * 1 // added geodes
      );
    }

    let max = 0;

    if (ore >= blueprint.ore[0]) {
      max = Math.max(
        max,
        search(
          ore + n_ore - blueprint.ore[0],
          clay + n_clay,
          obsidian + n_obsidian,
          n_ore + 1,
          n_clay,
          n_obsidian,
          time - 1
        )
      );
    }

    if (ore >= blueprint.clay[0]) {
      max = Math.max(
        max,
        search(
          ore + n_ore - blueprint.clay[0],
          clay + n_clay,
          obsidian + n_obsidian,
          n_ore,
          n_clay + 1,
          n_obsidian,
          time - 1
        )
      );
    }

    if (ore >= blueprint.obsidian[0] && clay >= blueprint.obsidian[1]) {
      max = Math.max(
        max,
        search(
          ore + n_ore - blueprint.obsidian[0],
          clay + n_clay - blueprint.obsidian[1],
          obsidian + n_obsidian,
          n_ore,
          n_clay,
          n_obsidian + 1,
          time - 1
        )
      );
    }

    if (ore < 4) {
      max = Math.max(
        max,
        search(
          ore + n_ore,
          clay + n_clay,
          obsidian + n_obsidian,
          n_ore,
          n_clay,
          n_obsidian,
          time - 1
        )
      );
    }

    memo.set(key, max);
    return max;
  };

  return search(0, 0, 0, 1, 0, 0, TIME);
};

const part1 = () => {
  const blueprints = readBlueprints();
  let answer = 0;

  for (let i = 0; i < blueprints.length; i++) {
    const best = calculateQuality(blueprints[i], 24);

    console.log("step", i, "--", best);
    answer += (i + 1) * best;
  }

  return answer;
};

const part2 = () => {
  const blueprints = readBlueprints();
  let answer = 1;

  for (let i = 0; i < 3; i++) {
    const best = calculateQuality(blueprints[i], 32);

    console.log("step", i, "--", best);
    answer *= best;
  }

  return answer;
};

console.log("Part 1 - ", part1());
console.log("Part 2 - ", part2());
