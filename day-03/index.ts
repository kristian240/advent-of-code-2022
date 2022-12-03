import data from "./data";

const lowercaseOffset = "a".charCodeAt(0) - 1;
const uppercaseOffset = "A".charCodeAt(0) - 27;
function itemPriority(value: string): number {
  const isUpperCase = value === value.toUpperCase();

  return (
    value.charCodeAt(0) - (isUpperCase ? uppercaseOffset : lowercaseOffset)
  );
}

function chunkify<TItem>(
  chuckSize: number,
  array: Array<TItem>
): Array<Array<TItem>> {
  const chunks = [];
  for (let i = 0; i < array.length; i += chuckSize) {
    chunks.push(array.slice(i, i + chuckSize));
  }
  return chunks;
}

function itemIntersection<TItem>(
  a: Array<TItem>,
  b: Array<TItem>
): Array<TItem> {
  const aSet = new Set(a);
  const bSet = new Set(b);
  return [...bSet].filter((item) => aSet.has(item));
}

export async function main() {
  const rucksacks = data.split("\n");

  const score1 = rucksacks
    .map((rucksack) => {
      const compartments = [
        rucksack.slice(0, rucksack.length / 2),
        rucksack.slice(rucksack.length / 2),
      ];

      const itemsInBoth = itemIntersection(
        compartments[0].split(""),
        compartments[1].split("")
      );

      if (itemsInBoth.length === 0)
        throw new Error("No same item in both compartments");
      else if (itemsInBoth.length > 1)
        throw new Error("More than one same item in both compartments");

      return itemPriority(itemsInBoth[0]);
    })
    .reduce((a, b) => a + b, 0);

  const score2 = chunkify(3, rucksacks)
    .map((rucksackGroup) => {
      const rucksackItems = rucksackGroup;

      const itemsInAll = rucksackItems.reduce(
        // @ts-ignore - First time, a is string, after that, it's an array
        (a: string | Array<string>, b, index) => {
          return itemIntersection(
            index === 0 ? (a as string).split("") : (a as Array<string>),
            b.split("")
          );
        }
      );

      if (itemsInAll.length === 0)
        throw new Error("No same item in all rucksacks");
      else if (itemsInAll.length > 1)
        throw new Error("More than one same item in all rucksacks");

      return itemPriority(itemsInAll[0]);
    })
    .reduce((a, b) => a + b, 0);

  console.log("Results:");
  console.log("  Sum of priorities:", score1, "(first part)");
  console.log("  Sum of priorities:", score2, "(second part)");
}

main();
