import { main as partOneMain } from "./part-one";
import { main as partTwoMain } from "./part-two";

export async function main() {
  const partOneResult = partOneMain();
  const partTwoResult = partTwoMain();

  console.log("Results:");
  console.log("  Total score:", partOneResult, "(part-one)");
  console.log("  Total score:", partTwoResult, "(part-two)");
}

main();
