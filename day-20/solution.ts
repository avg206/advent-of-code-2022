import { readFileLines } from "@tooling/read";

const lines = readFileLines(import.meta.dir, "input.txt", (line) => line);

interface Node {
  value: bigint;
  prev: Node;
  next: Node;
}

class List {
  public head: Node = null;
  public end: Node = null;
  public zero: Node = null;

  public length = 0n;

  constructor() {}

  public addNode(value: bigint) {
    const node: Node = {
      value: value,
      prev: this.end,
      next: null,
    };

    if (this.end) {
      this.end.next = node;
    }

    if (this.head === null) {
      this.head = node;
    }

    this.end = node;

    this.length++;

    if (value === 0n) {
      this.zero = node;
    }

    return node;
  }

  public getList(from: Node, to: Node) {
    const result = [];

    let node = from;

    do {
      result.push(node.value);
      node = node.next;
    } while (node !== to);

    return result;
  }

  public swapNodes(a: Node, b: Node) {
    if (a.next !== b) {
      const tmp = b;
      b = a;
      a = tmp;
    }

    const old_a = a;
    const old_b = b;

    if (old_a === this.head) {
      this.head = old_a.next;
    } else if (old_b === this.head) {
      this.head = old_b.next;
    }

    if (old_a === this.end) {
      this.end = old_a.prev;
    } else if (old_b === this.end) {
      this.end = a;
    }

    const aPrev = a.prev;
    const bNext = b.next;

    a.prev = b;
    b.next = a;

    aPrev.next = b;
    bNext.prev = a;

    a.next = bNext;
    b.prev = aPrev;
  }

  public moveNode(node: Node, steps: bigint) {
    if (steps > 0) {
      let rest = steps % (this.length - 1n);
      let cNode = node;

      while (rest !== 0n) {
        const to = cNode.next;
        this.swapNodes(cNode, to);

        rest--;
      }
    }

    if (steps < 0) {
      let rest = steps % (this.length - 1n);
      let cNode = node;

      while (rest !== 0n) {
        const to = cNode.prev;

        this.swapNodes(cNode, to);

        rest++;
      }
    }
  }
}

const solution = (multiply: bigint, cycles: number) => {
  const list = new List();

  const originalList = [];

  for (const line of lines) {
    const number = BigInt(parseInt(line, 10)) * multiply;

    const node = list.addNode(number);
    originalList.push({ number, node });
  }

  // Cycle list
  list.head.prev = list.end;
  list.end.next = list.head;

  for (let f = 0; f < cycles; f++) {
    for (let i = 0; i < originalList.length; i++) {
      const { node } = originalList[i];
      list.moveNode(node, node.value);
    }
  }

  let answer = 0n;
  const positions = [1000n, 2000n, 3000n];

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i] % list.length;

    let node = list.zero;
    for (let j = 0; j < position; j++) {
      node = node.next;
    }

    answer += node.value;
  }

  return answer;
};

console.log("Part 1 - ", solution(1n, 1));
console.log("Part 2 - ", solution(811589153n, 10));
