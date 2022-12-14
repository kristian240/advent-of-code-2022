import { inspect } from "util";
import data from "./data";

interface IMonkey {
  name: string;
  items: Array<number>;
  operation: (old: number) => number;
  test: (item: number) => boolean;
  throwTo: {
    true: string;
    false: string;
  };
  inspectionCount: number;
  testDivisibleBy: number;
}

function getMonkeys() {
  const monkeysRaw = data.split("\n\n");

  return monkeysRaw.map((monkeyRaw): IMonkey => {
    const [
      nameRaw,
      startingItemsRaw,
      operationRaw,
      testRaw,
      throwToTrueRaw,
      throwToFalseRase,
    ] = monkeyRaw.split("\n");

    const operationFnString = operationRaw.split("=")[1].trim();
    const testDivisibleBy = parseInt(
      testRaw.trim().match(/(\d+)/)?.[1] ?? "1",
      10
    );

    return {
      // operationFnString,
      testDivisibleBy,
      name: nameRaw.match(/(\d)+:/)?.[1] ?? "",
      items: startingItemsRaw
        .split(":")[1]
        .trim()
        .split(",")
        .map((item) => parseInt(item.trim(), 10)),
      operation: (old) =>
        eval(operationFnString.replaceAll("old", old.toString())),
      test: (value) => value % testDivisibleBy === 0,
      throwTo: {
        true: throwToTrueRaw.split(" ").pop() || "",
        false: throwToFalseRase.split(" ").pop() || "",
      },
      inspectionCount: 0,
    };
  });
}

function simulateRounds(
  n: number,
  monkeys: Array<IMonkey>,
  reduce?: (v: number, monkey: IMonkey) => number
) {
  for (let i = 0; i < n; i++) {
    for (const monkey of monkeys) {
      const items = monkey.items;

      for (const item of items) {
        let newItem = monkey.operation(item);

        if (reduce) newItem = reduce(newItem, monkey);

        const nextMonkeyName =
          monkey.throwTo[String(monkey.test(newItem)) as "true" | "false"];

        monkeys.find((m) => m.name === nextMonkeyName)?.items.push(newItem);
      }

      monkey.inspectionCount += items.length;
      monkey.items = [];
    }
  }
}

const getScore = (monkeys: Array<IMonkey>) => {
  const sortedInspections1 = monkeys.sort((a, b) => {
    return b.inspectionCount - a.inspectionCount;
  });
  return (
    sortedInspections1[0].inspectionCount *
    sortedInspections1[1].inspectionCount
  );
};

export async function main() {
  const monkeys1 = getMonkeys();
  simulateRounds(20, monkeys1, (v) => Math.floor(v / 3));
  const score1 = getScore(monkeys1);

  const monkeys2 = getMonkeys();
  const reducer = monkeys2
    .map((m) => m.testDivisibleBy)
    .reduce((a, b) => a * b);
  simulateRounds(10_000, monkeys2, (v, monkey) => Math.floor(v % reducer));
  const score2 = getScore(monkeys2);

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
