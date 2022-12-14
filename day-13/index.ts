import data from "./data";

const arrayToString = (arr: number | number[] | number[][]): string =>
  Array.isArray(arr)
    ? `[${arr.map((item) => arrayToString(item)).join(",")}]`
    : String(arr);

const comparePair = (
  left: number | number[] | number[][],
  right: number | number[] | number[][],
  depth = 0
): number => {
  // const space = Array(depth).fill("  ").join("");
  // console.log(
  //   `${space}Compare pair: ${arrayToString(left)}, ${arrayToString(right)}`
  // );

  if (typeof left === "undefined" && typeof right !== "undefined") return -1;
  if (typeof right === "undefined" && typeof left !== "undefined") return 1;

  const leftIsArray = Array.isArray(left);
  const rightIsArray = Array.isArray(right);

  if (leftIsArray && rightIsArray) {
    const max = Math.max(left.length, right.length);
    for (let index = 0; index < max; index++) {
      const leftItem = left[index];
      const rightItem = right[index];

      const c = comparePair(leftItem, rightItem, depth + 1);

      if (c === 0) continue;

      return c;
    }

    return 0;
  }

  if (leftIsArray) {
    return comparePair(left, [right as number], depth + 1);
  }

  if (rightIsArray) {
    return comparePair([left], right, depth + 1);
  }

  return Math.sign(left - right);
};

export async function main() {
  const pairs = data
    .split("\n\n")
    .map((pair) => pair.split("\n").map((l) => JSON.parse(l)));

  const score1 = pairs.reduce(
    (acc, [left, right], index) =>
      acc + (comparePair(left, right) < 0 ? index + 1 : 0),
    0
  );

  const dividerPackages = [[[2]], [[6]]];

  const score2 = [
    ...pairs.map((p) => p[0]),
    ...pairs.map((p) => p[1]),
    ...dividerPackages,
  ]
    .sort(comparePair)
    .reduce((acc, item, index) => {
      if (!dividerPackages.includes(item)) {
        return acc;
      }

      return acc * (index + 1);
    }, 1);

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
