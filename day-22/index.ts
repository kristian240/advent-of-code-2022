import data from "./data";

const Direction = {
  Right: 0,
  Down: 1,
  Left: 2,
  Up: 3,
} as const;

function posToScore(pos: { x: number; y: number; rotation: number }) {
  return pos.rotation + (pos.x + 1) * 4 + (pos.y + 1) * 1000;
}

export async function main() {
  const [mapRaw, instructionsRaw] = data.split("\n\n");

  const map = mapRaw.split("\n").map((line) => line.split(""));
  const instructions = instructionsRaw
    .split(/(\d+|[LR])/g)
    .filter(Boolean)
    .map((instruction) => {
      if (instruction === "L" || instruction === "R") return instruction;
      return parseInt(instruction, 10);
    });

  const pos1 = {
    x: map[0].findIndex((i) => i === "."),
    y: 0,
    rotation: Direction.Right as typeof Direction[keyof typeof Direction],
  };

  for (const instruction of instructions) {
    if (instruction === "L") {
      pos1.rotation = ((pos1.rotation + 3) %
        4) as typeof Direction[keyof typeof Direction];
      continue;
    }

    if (instruction === "R") {
      pos1.rotation = ((pos1.rotation + 1) %
        4) as typeof Direction[keyof typeof Direction];
      continue;
    }

    for (let i = 0; i < instruction; i++) {
      const nextPos = { ...pos1 };
      if (pos1.rotation === Direction.Up) {
        nextPos.y--;

        if (!map[nextPos.y]?.[nextPos.x] || map[nextPos.y][nextPos.x] === " ") {
          nextPos.y += map
            .map((r) => r[nextPos.x])
            .filter((s) => s?.trim()).length;
        }
      } else if (pos1.rotation === Direction.Right) {
        nextPos.x++;

        if (!map[nextPos.y]?.[nextPos.x] || map[nextPos.y][nextPos.x] === " ")
          nextPos.x -= map[nextPos.y].filter((s) => s?.trim()).length;
      } else if (pos1.rotation === Direction.Down) {
        nextPos.y++;

        if (!map[nextPos.y]?.[nextPos.x] || map[nextPos.y][nextPos.x] === " ") {
          nextPos.y -= map
            .map((r) => r[nextPos.x])
            .filter((s) => s?.trim()).length;
        }
      } else if (pos1.rotation === Direction.Left) {
        nextPos.x--;

        if (!map[nextPos.y]?.[nextPos.x] || map[nextPos.y][nextPos.x] === " ")
          nextPos.x += map[nextPos.y].filter((s) => s?.trim()).length;
      }

      if (map[nextPos.y][nextPos.x] === "#") break;

      pos1.x = nextPos.x;
      pos1.y = nextPos.y;
    }
  }

  const score1 = posToScore(pos1);

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:");
}

main();
