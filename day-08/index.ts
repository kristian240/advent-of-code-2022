import data from "./data";

function getScenicScore(
  curr: { value: number; scenicStore: number; visible: boolean },
  arr: { value: number; scenicStore: number; visible: boolean }[]
) {
  let score = 0;

  for (const next of arr) {
    score++;
    if (next.value >= curr.value) break;
  }

  return score;
}

export async function main() {
  const treeGrid = data.split("\n").map((line, index1, arr1) =>
    line.split("").map((n, index2, arr2) => ({
      value: parseInt(n, 10),
      scenicStore: 0,
      visible:
        index1 === 0 ||
        index1 === arr1.length - 1 ||
        index2 === 0 ||
        index2 === arr2.length - 1,
    }))
  );
  const gridRows = treeGrid.length;
  const gridCols = treeGrid[0].length;

  for (let i = 1; i < gridRows - 1; i++) {
    for (let j = 1; j < gridCols - 1; j++) {
      const curr = treeGrid[i][j];

      if (curr.visible) continue;
      if (treeGrid[i].slice(0, j).every((n) => n.value < curr.value))
        curr.visible = true;
      else if (treeGrid[i].slice(j + 1).every((n) => n.value < curr.value))
        curr.visible = true;
      else if (treeGrid.slice(0, i).every((n) => n[j].value < curr.value))
        curr.visible = true;
      else if (treeGrid.slice(i + 1).every((n) => n[j].value < curr.value))
        curr.visible = true;
    }
  }

  const score1 = treeGrid.flat().filter((n) => n.visible).length;

  let score2 = 0;
  for (let i = 1; i < gridRows - 1; i++) {
    for (let j = 1; j < gridCols - 1; j++) {
      const curr = treeGrid[i][j];
      const currCol = treeGrid.map((row) => row[j]);

      const leftScenic = getScenicScore(
        curr,
        treeGrid[i].slice(0, j).reverse()
      );
      const rightScenic = getScenicScore(curr, treeGrid[i].slice(j + 1));
      const topScenic = getScenicScore(curr, currCol.slice(0, i).reverse());
      const bottomScenic = getScenicScore(curr, currCol.slice(i + 1));

      curr.scenicStore = leftScenic * rightScenic * topScenic * bottomScenic;

      if (curr.scenicStore > score2) score2 = curr.scenicStore;
    }
  }

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
