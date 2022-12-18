import data from "./data";

export async function main() {
  const coordinates = data.split("\n").map((line) => {
    const [x, y, z] = line.split(",").map((coord) => parseInt(coord, 10));

    return { x, y, z };
  });
  const neighbors = coordinates.reduce((acc, curr) => {
    const n = coordinates.filter(
      (coord) =>
        Math.abs(coord.x - curr.x) +
          Math.abs(coord.y - curr.y) +
          Math.abs(coord.z - curr.z) ===
        1
    );

    acc.set(curr, n);

    return acc;
  }, new Map<typeof coordinates[number], Array<typeof coordinates[number]>>());

  let coordinates1 = [...coordinates];
  let score1 = 0;
  let score2 = 0;
  while (coordinates1.length > 0) {
    const blob = [coordinates1.shift()!];

    let prevNeighbors: typeof blob = [...blob];
    while (1) {
      const _neighbors: typeof blob = [];
      const newCoordinates: typeof coordinates1 = [];
      for (const coord of coordinates1) {
        const condition = prevNeighbors.some(
          (b) => neighbors.get(b) && neighbors.get(b)!.length > 0
        );

        if (condition) _neighbors.push(coord);
        else newCoordinates.push(coord);
      }
      coordinates1 = newCoordinates;

      if (_neighbors.length === 0) break;

      blob.push(..._neighbors);
      prevNeighbors = _neighbors;
    }

    const passScore = blob
      .map((c) => 6 - neighbors.get(c)!.length)
      .reduce((a, b) => a + b);

    score1 += passScore;

    if (blob.length < 6) score2 += passScore;
    else {
      // TODO: check if there is a hole in the blob
    }
  }

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
