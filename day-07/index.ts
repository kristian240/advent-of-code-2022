import data from "./data";

const TOTAL_SPACE = 70_000_000;
const NEEDED_SPACE = 30_000_000;

export async function main() {
  const fsSizes: Record<string, number> = {};
  const workingDirectory: Array<string> = [];

  const commands = data.split("$ ");

  let pwd: string = "";
  for (const command of commands) {
    if (command.startsWith("cd")) {
      const [, folder] = command.trim().split(" ");

      if (folder === "..") workingDirectory.pop();
      else workingDirectory.push(folder === "/" ? folder : folder + "/");

      pwd = workingDirectory.join("");
      fsSizes[pwd] ??= 0;
    } else if (command.startsWith("ls")) {
      const [, ...contents] = command.trim().split("\n");

      for (const content of contents.filter((c) => !c.startsWith("dir"))) {
        const [sizeOrDir, name] = content.split(" ");

        const fileSize = parseInt(sizeOrDir, 10);
        const filePath = pwd + name;
        fsSizes[filePath] = fileSize;

        let temp = filePath.substring(0, filePath.lastIndexOf("/"));
        while (1) {
          fsSizes[temp + "/"] += fileSize;
          if (!temp) break;
          temp = temp.substring(0, temp.lastIndexOf("/"));
        }
      }
    }
  }

  const score1 = Object.entries(fsSizes)
    .filter(([name, size]) => size < 100_000 && name.endsWith("/"))
    .reduce((acc, curr) => acc + curr[1], 0);

  const missingFreeSpace = NEEDED_SPACE - (TOTAL_SPACE - fsSizes["/"]);
  let score2 = 0;
  if (missingFreeSpace > 0) {
    score2 = Object.entries(fsSizes)
      .filter(([name, size]) => size >= missingFreeSpace && name.endsWith("/"))
      .map(([, size]) => size)
      .sort((a, b) => a - b)[0];
  }

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
