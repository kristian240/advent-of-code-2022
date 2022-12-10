import data from "./data";

const score1RegistersToFollow = [20, 60, 100, 140, 180, 220];

export async function main() {
  const instructions = data.split("\n");
  let cycle = 0;
  let registerX = 1;
  const monitorOutput: string[] = [];

  let score1 = 0;

  const increaseCycle = () => {
    monitorOutput.push(Math.abs(registerX - (cycle % 40)) < 2 ? "#" : ".");
    cycle++;
    if (cycle % 40 === 0) monitorOutput.push("\n");
    if (score1RegistersToFollow.includes(cycle)) score1 += registerX * cycle;
  };

  for (const instruction of instructions) {
    increaseCycle();

    const [command, value] = instruction.split(" ");
    if (command === "noop") continue;

    increaseCycle();

    registerX += parseInt(value, 10);
  }

  const score2 = monitorOutput.join("");

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:");
  console.log(score2);
}

main();
