import data from "./data-one";

async function main() {
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

  const maxTotal = Math.max(...elfTotals);

  console.log(maxTotal);
}

main();
