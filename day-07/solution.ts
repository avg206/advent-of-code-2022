import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

type Node = {
  parent: Node | null;
  path: string;
  sum: number;
  next: Node[];
  type: "dir" | "file";
};

const createNode = (path: string, type: "dir" | "file"): Node => ({
  parent: null,
  path,
  sum: 0,
  next: [],
  type,
});

const updateTreeWithSums = (currentNode: Node): number => {
  if (currentNode.next.length === 0) {
    return currentNode.sum;
  }

  let sum = 0;
  for (const node of currentNode.next) {
    sum += updateTreeWithSums(node);
  }

  currentNode.sum = sum;

  return sum;
};

const countFoldersWithSize = (currentNode: Node, limit: number): number => {
  if (currentNode.type === "file") {
    return 0;
  }

  let sum = 0;

  if (currentNode.type === "dir" && currentNode.sum <= limit) {
    sum += currentNode.sum;
  }

  for (const node of currentNode.next) {
    sum = sum + countFoldersWithSize(node, limit);
  }

  return sum;
};

const unfoldTreeSizes = (currentNode: Node): number[] => {
  if (currentNode.type === "file") {
    return [];
  }

  let result = [currentNode.sum];

  for (const node of currentNode.next) {
    result = result.concat(unfoldTreeSizes(node));
  }

  return result;
};

const solution = () => {
  const path = [];
  const treeRoot = createNode("", "dir");
  let parent = treeRoot;

  let i = 0;

  do {
    if (lines[i][0] !== "$") {
      i++;
      continue;
    }

    const [_, command, folder] = lines[i].split(" ");

    switch (command) {
      case "cd": {
        if (folder === "..") {
          path.pop();
          parent = parent.parent;

          i++;
          continue;
        }

        path.push(folder);
        const newNode = createNode(path.join("_"), "dir");
        newNode.parent = parent;

        parent.next.push(newNode);
        parent = newNode;
        break;
      }

      case "ls": {
        while (i < lines.length - 1) {
          i++;

          if (lines[i][0] === "$") {
            break;
          }

          const [a, b] = lines[i].split(" ");

          if (a === "dir") {
            continue;
          }

          const newNode = createNode([...path, b].join("_"), "file");
          newNode.parent = parent;
          newNode.sum = parseInt(a, 10);

          parent.next.push(newNode);
        }
        i--;
        break;
      }
    }

    i++;
  } while (i < lines.length - 1);

  const totalSum = updateTreeWithSums(treeRoot);
  const count = countFoldersWithSize(treeRoot, 100_000);

  console.log("Part 1:");
  console.log(count);

  const TOTAL = 70_000_000;
  const TARGET = 30_000_000;
  const sizes = unfoldTreeSizes(treeRoot).sort((a, b) => a - b);
  const left = TOTAL - totalSum;

  console.log("Part 2:");

  for (let i = 0; i < sizes.length; i++) {
    if (left + sizes[i] >= TARGET) {
      console.log(sizes[i]);
      break;
    }
  }
};

solution();
