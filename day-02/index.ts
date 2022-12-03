import { main as partOneMain } from "./part-one";
import { main as partTwoMain } from "./part-two";

export async function main() {
  const partOneResult = partOneMain();
  const partTwoResult = partTwoMain();

  console.log("Results:");
  console.log("  1st part:", partOneResult);
  console.log("  2nd part:", partTwoResult);
}

main();
