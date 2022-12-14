import data from "./data";

const startSymbol = "S";
const endSymbol = "E";

interface ILocation {
  x: number;
  y: number;
  z: number;
}

function printGrid(grid: Array<Array<string>>) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function getToEnd(
  grid: Array<Array<string>>,
  currLocation: ILocation,
  path: Array<ILocation>
): Array<ILocation> {
  if (grid[currLocation.y][currLocation.x] === endSymbol)
    return [...path, currLocation];

  const cell = grid[currLocation.y][currLocation.x];
  const newLocation = { ...currLocation };
  for (let i = -1; i <= 1; i++) {
    if (!grid[currLocation.y + i]) continue;

    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      const cell = grid[currLocation.y + i][currLocation.x + j];
      if (!cell) continue;

      const newZ = cell.charCodeAt(0);
      if (newZ < currLocation.z) continue;
      if (newZ - currLocation.z > 1) continue;

      newLocation.x = currLocation.x + j;
      newLocation.y = currLocation.y + i;
      newLocation.z = newZ;
      return [...path, ...getToEnd(grid, newLocation, path)];
    }
  }
}

function dijkstra(
  grid: Array<Array<string>>,
  currLocation: ILocation,
  part: 1 | 2
) {
  const distances: Array<Array<number>> = [];
  for (let i = 0; i < grid.length; i++) {
    distances.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      distances[i].push(-1);
    }
  }

  distances[currLocation.y][currLocation.x] = 0;

  let toCheck: Array<ILocation> = [currLocation];
  while (toCheck.length) {
    const check = toCheck.shift()!;
    const distance = distances[check.y][check.x];
    for (let i = -1; i <= 1; i++) {
      if (!grid[check.y + i]) continue;

      for (let j = -1; j <= 1; j++) {
        if (Math.abs(i) === Math.abs(j)) continue;

        const cell = grid[check.y + i][check.x + j];
        if (!cell) continue;

        const newZ =
          cell === endSymbol
            ? "z".charCodeAt(0)
            : cell === startSymbol
            ? "a".charCodeAt(0)
            : cell.charCodeAt(0);

        if (part === 1 && newZ - check.z > 1) continue;
        if (part === 2 && check.z - newZ > 1) continue;

        const newLocation = {
          x: check.x + j,
          y: check.y + i,
          z: newZ,
        };
        const newDistance = distance + 1;
        if (
          distances[newLocation.y][newLocation.x] === -1 ||
          newDistance < distances[newLocation.y][newLocation.x]
        ) {
          distances[newLocation.y][newLocation.x] = newDistance;
          toCheck.push(newLocation);
        }
      }
    }
  }

  return distances;
}

export async function main() {
  const grid = data.split("\n").map((l) => l.split(""));

  const startY = grid.findIndex((row) => row.includes(startSymbol));
  const startX = grid[startY].findIndex((cell) => cell === startSymbol);

  const endY = grid.findIndex((row) => row.includes(endSymbol));
  const endX = grid[endY].findIndex((cell) => cell === endSymbol);

  const pathLengths1 = dijkstra(
    grid,
    {
      x: startX,
      y: startY,
      z: "a".charCodeAt(0),
    },
    1
  );
  const score1 = pathLengths1[endY][endX];

  const pathLengths2 = dijkstra(
    grid,
    {
      x: endX,
      y: endY,
      z: "z".charCodeAt(0),
    },
    2
  );
  const score2 = Math.min(
    ...pathLengths2
      .flatMap((r, i) =>
        r.map((l, j) => {
          const cell = grid[i][j];
          if (cell === startSymbol) return l;
          if (cell === "a") return l;
          return -1;
        })
      )
      .filter((l) => l > 0)
  );

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
