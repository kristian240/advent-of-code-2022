import data from "./data";

export async function main() {
  const assignmentPairs = data.split("\n").map((line) => {
    const [assignmentLeft, assignmentRight] = line.split(",");

    return [
      assignmentLeft.split("-").map((v) => parseInt(v)),
      assignmentRight.split("-").map((v) => parseInt(v)),
    ];
  });

  const part1 = assignmentPairs.filter(
    ([aLeft, aRight]) =>
      (aLeft[0] <= aRight[0] && aLeft[1] >= aRight[1]) || // right is inside left
      (aLeft[0] >= aRight[0] && aLeft[1] <= aRight[1]) // left is inside right
  ).length;

  const part2 = assignmentPairs.filter(
    ([aLeft, aRight]) => !(aLeft[1] < aRight[0] || aRight[1] < aLeft[0]) // no overlap
  ).length;

  console.log("Results:");
  console.log("  1st part:", part1);
  console.log("  2nd part:", part2);
}

main();
