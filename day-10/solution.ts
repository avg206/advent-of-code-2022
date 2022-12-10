import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

const part1 = () => {
  const checkpoints = [20, 60, 100, 140, 180, 220];

  let register = 1;
  let cycle = 1;
  let streangth = 0;

  let i = 0;
  while (i < lines.length) {
    const [command, addition] = lines[i].split(" ");

    switch (command) {
      case "noop": {
        if (checkpoints.includes(cycle)) {
          streangth = streangth + register * cycle;
        }
        cycle++;
        break;
      }

      case "addx": {
        if (checkpoints.includes(cycle)) {
          streangth = streangth + register * cycle;
        }

        if (checkpoints.includes(cycle + 1)) {
          streangth = streangth + register * (cycle + 1);
        }

        register += parseInt(addition, 10);
        cycle += 2;

        break;
      }
    }

    i++;
  }

  return streangth;
};

const part2 = () => {
  let register = 1;
  let cycle = 1;

  let rowString = "";

  const logCell = (cycle: number, sign: string) => {
    rowString += sign;

    if (cycle % 40 === 0) {
      console.log(rowString);
      rowString = "";
    }
  };

  const checkCycleAndCTR = (cycle: number, register: number): boolean => {
    const localCycle = cycle % 40 === 0 ? 40 : cycle % 40;

    return (
      localCycle - 1 === register ||
      localCycle - 1 === register - 1 ||
      localCycle - 1 === register + 1
    );
  };

  let i = 0;
  while (i < lines.length) {
    const [command, addition] = lines[i].split(" ");

    switch (command) {
      case "noop": {
        logCell(cycle, checkCycleAndCTR(cycle, register) ? "#" : ".");
        cycle++;
        break;
      }

      case "addx": {
        logCell(cycle, checkCycleAndCTR(cycle, register) ? "#" : ".");
        logCell(cycle + 1, checkCycleAndCTR(cycle + 1, register) ? "#" : ".");

        register += parseInt(addition, 10);
        cycle += 2;

        break;
      }
    }

    i++;
  }
};

console.log(part1());
console.log(part2());
