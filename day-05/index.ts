import data from "./data";

const STACK_CELL_REGEX = /\[([A-Z])\]/g;

export async function main() {
  const [stacksRaw, movesRaw] = data.split("\n\n");

  const stacksLines = stacksRaw.split("\n");
  const stackNames = stacksLines.at(-1)?.trim().split("   ") ?? [];
  const stacks = stacksLines.slice(0, -1).reduceRight(
    (acc, line, index, arr) => {
      let leftover = line;
      while (leftover.trim().length > 0) {
        let cell = new RegExp(STACK_CELL_REGEX).exec(leftover);

        const stackNameIndex = cell!.index / 4;
        acc[stackNames[stackNameIndex]].push(cell![1]);

        leftover = leftover.replace(cell![0], "   ");
      }

      return acc;
    },
    stackNames?.reduce((acc, name) => {
      acc[name] = [];
      return acc;
    }, {} as Record<string, string[]>)
  );

  const moves = movesRaw.split("\n").map((move) => {
    const [count, from, to] = move.match(/\d+/g)!;
    return { count: Number(count), from, to };
  });

  const stacks1 = JSON.parse(JSON.stringify(stacks)) as typeof stacks;
  for (const { count, from: fromStack, to: toStack } of moves) {
    for (let i = 0; i < count; i++) {
      const items = stacks1[fromStack].splice(-1);
      stacks1[toStack].push(...items);
    }
  }

  const stacks2 = JSON.parse(JSON.stringify(stacks)) as typeof stacks;
  for (const { count, from: fromStack, to: toStack } of moves) {
    const items = stacks2[fromStack].splice(-count);
    stacks2[toStack].push(...items);
  }

  const score1 = Object.values(stacks1).reduce(
    (acc, stack) => acc + stack.at(-1)!,
    ""
  );

  const score2 = Object.values(stacks2).reduce(
    (acc, stack) => acc + stack.at(-1)!,
    ""
  );

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
