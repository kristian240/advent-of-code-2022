import data from "./data";

export async function main() {
  const calories = data
    .split("\n\n") // split by elves
    .map(
      (group) =>
        group
          .split("\n") // split by calorie group
          .map((value) => parseInt(value, 10)) // convert to number
    );

  const elfTotals = calories.map(
    // sum elf calories
    (elfCalories) => elfCalories.reduce((a, b) => a + b)
  );

  // sort from highest to lowest
  elfTotals.sort((a, b) => b - a);

  console.log("Results:");
  console.log("  1st:", elfTotals[0], "(part-one answer)");
  console.log("  2nd:", elfTotals[1]);
  console.log("  3rd:", elfTotals[2]);
  console.log(
    "  Sum:",
    elfTotals[0] + elfTotals[1] + elfTotals[2],
    "(part-two-answer)"
  );
}

main();
