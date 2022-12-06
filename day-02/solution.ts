import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) =>
  line.split(" ")
);

const part1 = () => {
  // Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock
  // A for Rock, B for Paper, and C for Scissors.
  // X for Rock, Y for Paper, and Z for Scissors

  const pairsWin = {
    X: "C",
    Y: "A",
    Z: "B",
  };

  const pairsDraw = {
    X: "A",
    Y: "B",
    Z: "C",
  };

  const scores = {
    X: 1,
    Y: 2,
    Z: 3,
  };

  let score = 0;

  for (const line of lines) {
    score += scores[line[1]];

    if (pairsWin[line[1]] === line[0]) {
      score += 6;
    } else if (pairsDraw[line[1]] === line[0]) {
      score += 3;
    }
  }

  return score;
};

const part2 = () => {
  // Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock
  // A for Rock, B for Paper, and C for Scissors.
  // X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win

  const pairsWin = {
    A: "B",
    B: "C",
    C: "A",
  };

  const pairsDraw = {
    A: "A",
    B: "B",
    C: "C",
  };

  const pairsLose = {
    A: "C",
    B: "A",
    C: "B",
  };

  const scores = {
    A: 1,
    B: 2,
    C: 3,
  };

  let score = 0;

  for (const line of lines) {
    let willShow = "";

    if (line[1] === "X") {
      willShow = pairsLose[line[0]];
    } else if (line[1] === "Y") {
      willShow = pairsDraw[line[0]];
      score += 3;
    } else if (line[1] === "Z") {
      willShow = pairsWin[line[0]];
      score += 6;
    }

    score += scores[willShow];
  }

  return score;
};

console.log(part1());
console.log(part2());
