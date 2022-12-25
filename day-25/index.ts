import data from "./data";

function snafuToDecimal(snafu: string) {
  let decimal = 0;

  for (let i = 0; i < snafu.length; i++) {
    const weight = 5 ** (snafu.length - i - 1);

    if (snafu[i] === "1") decimal += weight;
    else if (snafu[i] === "2") decimal += weight * 2;
    else if (snafu[i] === "-") decimal -= weight;
    else if (snafu[i] === "=") decimal -= weight * 2;
  }

  return decimal;
}

function decimalToSnafu(_decimal: number) {
  let decimal = _decimal;
  let snafu = "";

  if (decimal === 0) return "0";

  let weightExp = Math.round(Math.log(Math.abs(decimal)) / Math.log(5));
  do {
    const weight = 5 ** weightExp;
    const weightNum = Math.round(decimal / weight);

    if (weightNum === 0) {
      snafu += "0";
      continue;
    }

    snafu +=
      weightNum < 0 ? (weightNum === -1 ? "-" : "=") : Math.round(weightNum);
    decimal -= Math.round(weightNum) * weight;
  } while (--weightExp >= 0);

  return snafu;
}

export async function main() {
  const fuelRequirements = data.split("\n");

  const fuelRequirementsDecimal = fuelRequirements.map((snafu) =>
    snafuToDecimal(snafu)
  );

  const score1 = decimalToSnafu(
    fuelRequirementsDecimal.reduce((acc, cur) => acc + cur)
  );

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part: Check other days 😊🎄");
}

main();
