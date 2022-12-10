import data from "./data";

interface IPosition {
  x: number;
  y: number;
}

type MoveMapType = Record<string, { tailVisited: Array<number> }>;

const positionToString = (position: IPosition) => `${position.x},${position.y}`;

const zeroArray = (length: number) => Array.from({ length }, () => 0);

const runSimulation = (
  moves: Array<{ distance: number; direction: string }>,
  tailLength = 1
) => {
  const knotCount = tailLength + 1;
  const positions = Array.from(
    { length: knotCount },
    () => ({ x: 0, y: 0 } as IPosition)
  );
  const moveMap: MoveMapType = { "0,0": { tailVisited: zeroArray(knotCount) } };

  for (const move of moves) {
    for (let i = 0; i < move.distance; i++) {
      if (move.direction === "U") positions[0].y++;
      else if (move.direction === "R") positions[0].x++;
      else if (move.direction === "D") positions[0].y--;
      else if (move.direction === "L") positions[0].x--;

      moveMap[positionToString(positions[0])] ??= {
        tailVisited: zeroArray(knotCount),
      };

      for (let j = 1; j < positions.length; j++) {
        const posJ = positionToString(positions[j]);
        const xDistance = positions[j - 1].x - positions[j].x;
        const yDistance = positions[j - 1].y - positions[j].y;

        if (Math.abs(xDistance) <= 1 && Math.abs(yDistance) <= 1) {
          moveMap[posJ] ??= { tailVisited: zeroArray(knotCount) };
          moveMap[posJ].tailVisited[j]++;
          break;
        }

        if (xDistance == 0 && Math.abs(yDistance) == 2)
          positions[j].y += Math.sign(yDistance);
        else if (Math.abs(xDistance) == 2 && yDistance == 0)
          positions[j].x += Math.sign(xDistance);
        else if (Math.abs(xDistance) == 2 || Math.abs(yDistance) == 2) {
          positions[j].x += Math.sign(xDistance);
          positions[j].y += Math.sign(yDistance);
        }

        moveMap[posJ] ??= { tailVisited: zeroArray(knotCount) };
        moveMap[posJ].tailVisited[j]++;
      }
    }
  }

  return moveMap;
};

export async function main() {
  const moves = data.split("\n").map((moveRaw) => {
    const [direction, distance] = moveRaw.split(" ");
    return { direction, distance: parseInt(distance, 10) };
  });

  const map1 = runSimulation(moves, 1);
  const score1 = Object.values(map1).reduce(
    (acc, { tailVisited }) => acc + Number(Boolean(tailVisited[1])),
    0
  );

  const map2 = runSimulation(moves, 9);
  const score2 = Object.values(map2).reduce(
    (acc, { tailVisited }) => acc + Number(Boolean(tailVisited[9])),
    0
  );

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
