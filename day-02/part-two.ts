import data from "./data";

const enum Shape {
  Rock,
  Paper,
  Scissors,
}

const winMap = {
  [Shape.Rock]: Shape.Scissors,
  [Shape.Paper]: Shape.Rock,
  [Shape.Scissors]: Shape.Paper,
};

const looseMap = {
  [Shape.Rock]: Shape.Paper,
  [Shape.Paper]: Shape.Scissors,
  [Shape.Scissors]: Shape.Rock,
};

const elfShapes = {
  A: Shape.Rock,
  B: Shape.Paper,
  C: Shape.Scissors,
};

const pointsMap = {
  [Shape.Rock]: 1,
  [Shape.Paper]: 2,
  [Shape.Scissors]: 3,
};

const meShapes = (elfShape: Shape) => ({
  X: winMap[elfShape],
  Y: elfShape,
  Z: looseMap[elfShape],
});

export async function main() {
  const games = data.split("\n");

  const totalScore = games.reduce((total, game) => {
    const [elf, me] = game.split(" ");

    const elfShape = elfShapes[elf as "A" | "B" | "C"];
    const meShape = meShapes(elfShape)[me as "X" | "Y" | "Z"];

    let points = pointsMap[meShape];

    // draw
    if (meShape === elfShape) {
      points += 3;
    } else if (winMap[meShape] === elfShape) {
      points += 6;
    }

    return total + points;
  }, 0);

  return totalScore;
}

main();
