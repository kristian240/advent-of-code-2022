import data from "./data";

const rockTypesRaw = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`;

const CHAMBER_WIDTH = 7;

const SOLID_TYPE = {
  Rock: "#",
  Empty: ".",
  MovingObject: "@",
};

export async function main() {
  const rocks = rockTypesRaw.split("\n\n").map((rockTypeRaw) => {
    const rockType = rockTypeRaw
      .split("\n")
      .map((line) => line.split(""))
      .reverse();

    const width = rockType[0].length;
    const height = rockType.length;

    return {
      rockType,
      width,
      height,
    };
  });

  const jetStream = data.split("").map((char) => (char === "<" ? -1 : 1));

  const chamberItems: Array<typeof rocks[number] & { x: number; y: number }> =
    [];

  let jetStreamIndex = 0;
  let rockTypeIndex = 0;
  let chamberHeight = 0;
  let score1 = 0;
  let score2 = 0;

  for (let round = 0; round < 1_000_000_000_000; round++) {
    if (round === 2022) score1 = chamberHeight;

    const rock = {
      ...rocks[rockTypeIndex++ % rocks.length],
      x: 2,
      y: chamberHeight + 3,
    };

    const relevantChamberItems = chamberItems.filter(
      (item) => rock.y - item.y < 100
    );

    while (1) {
      const jetStreamDirection = jetStream[jetStreamIndex++ % jetStream.length];
      const newRockX = rock.x + jetStreamDirection;
      if (
        newRockX >= 0 &&
        newRockX + rock.width <= CHAMBER_WIDTH &&
        !relevantChamberItems.some((item) =>
          checkIfItemOverlap({ ...rock, x: newRockX }, item)
        )
      )
        rock.x = newRockX;

      const newRockY = rock.y - 1;
      if (newRockY < 0) break;
      if (
        relevantChamberItems.some((item) =>
          checkIfItemOverlap({ ...rock, y: newRockY }, item)
        )
      )
        break;

      rock.y = newRockY;
    }

    chamberItems.unshift(rock);
    chamberHeight = Math.max(chamberHeight, rock.y + rock.height);
  }

  const chamber: Array<Array<string>> = Array.from(
    { length: chamberHeight },
    () => Array.from({ length: CHAMBER_WIDTH }, () => SOLID_TYPE.Empty)
  );

  for (const rock of chamberItems) {
    for (let i = 0; i < rock.height; i++) {
      const row = chamber[chamberHeight - 1 - rock.y - i];

      for (let j = 0; j < rock.width; j++)
        if (row[rock.x + j] === SOLID_TYPE.Empty)
          row[rock.x + j] = rock.rockType[i][j];
    }
  }

  score2 = chamberHeight;

  console.log("Results:");
  console.log("  1st part:", score1, chamberHeight);
  console.log("  2nd part:", score2);
}

main();

function printChamber(chamber: Array<Array<string>>) {
  let rowNumb = chamber.length - 1;
  for (const row of chamber) {
    console.log(`${(rowNumb--).toString().padStart(4, " ")}|${row.join("")}|`);
  }
  console.log(
    `    +${Array.from({ length: CHAMBER_WIDTH }, () => "-").join("")}+`
  );
}

function printChamberItems(chamberItems: Array<any>, chamberHeight: number) {
  const chamber: Array<Array<string>> = Array.from(
    { length: chamberHeight },
    () => Array.from({ length: CHAMBER_WIDTH }, () => SOLID_TYPE.Empty)
  );

  for (const rock of chamberItems) {
    for (let i = 0; i < rock.height; i++) {
      const row = chamber[chamberHeight - 1 - rock.y - i];

      for (let j = 0; j < rock.width; j++)
        if (row[rock.x + j] === SOLID_TYPE.Empty)
          row[rock.x + j] = rock.rockType[i][j];
    }
  }

  printChamber(chamber);
}

function checkIfItemOverlap(
  item1: {
    x: number;
    y: number;
    width: number;
    height: number;
    rockType: Array<Array<string>>;
  },
  item2: {
    x: number;
    y: number;
    width: number;
    height: number;
    rockType: Array<Array<string>>;
  }
) {
  if (item1.y >= item2.y + item2.height || item1.y + item1.height <= item2.y) {
    return false;
  }

  if (item1.x >= item2.x + item2.width || item1.x + item1.width <= item2.x) {
    return false;
  }

  const minX = Math.max(item1.x, item2.x);
  const maxX = Math.min(item1.x + item1.width, item2.x + item2.width);
  const minY = Math.max(item1.y, item2.y);
  const maxY = Math.min(item1.y + item1.height, item2.y + item2.height);

  const rockType = [...item1.rockType];
  const itemType = [...item2.rockType];

  for (let i = minX; i < maxX; i++) {
    for (let j = minY; j < maxY; j++) {
      if (
        rockType[j - item1.y][i - item1.x] === SOLID_TYPE.Rock &&
        itemType[j - item2.y][i - item2.x] === SOLID_TYPE.Rock
      ) {
        return true;
      }
    }
  }

  return false;
}
