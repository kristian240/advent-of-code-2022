import data from "./data";

const sandEntryPoint = [500, 0];

function createScan(scanTraces: Array<Array<Array<number>>>) {
  let scan: Array<Record<number, string>> = [{ [sandEntryPoint[0]]: "+" }];

  let max = 0;
  scanTraces.forEach((trace) => {
    trace.forEach((curr, index, self) => {
      const next = self[index + 1];
      if (!next) return;

      max = Math.max(max, curr[1], next[1]);
      const d = next[0] - curr[0];

      if (d === 0) {
        const [from, to] = [curr[1], next[1]].sort((a, b) => a - b);
        for (let i = from; i <= to; i++) {
          if (!scan[i]) scan[i] = {};
          scan[i][curr[0]] = "#";
        }
      } else {
        const [from, to] = [curr[0], next[0]].sort((a, b) => a - b);
        for (let i = from; i <= to; i++) {
          if (!scan[curr[1]]) scan[curr[1]] = {};
          scan[curr[1]][i] = "#";
        }
      }
    });
  });

  Array.from({ length: max + 1 }).forEach((_, i) => {
    scan[i] ||= {};
  });

  return scan;
}

function print2dMap(scan: Array<Record<string, string>>) {
  const rowMin = 0;
  const rowMax = scan.length - 1;
  console.log({ rowMin, rowMax, l: scan.length });

  const columnKeys = Object.values(scan).flatMap((row) => Object.keys(row));
  const columnMin = Math.min(...columnKeys.map((key) => parseInt(key, 10)));
  const columnMax = Math.max(...columnKeys.map((key) => parseInt(key, 10)));

  for (let i = rowMin; i <= rowMax; i++) {
    const line = scan[i];

    let lineString = i.toString().padStart(4, " ") + " ";
    for (let j = columnMin; j <= columnMax; j++) {
      lineString += line?.[j] || ".";
    }

    console.log(lineString);
  }
}

export async function main() {
  const scanTraces = data
    .split("\n")
    .map((line) =>
      line
        .split(" -> ")
        .map((rawSegments) =>
          rawSegments.split(",").map((rawSegment) => parseInt(rawSegment, 10))
        )
    );

  const scan1 = createScan(scanTraces);
  let score1 = 0;
  out: while (1) {
    const sandPosition = [sandEntryPoint[0], sandEntryPoint[1]];
    while (true) {
      const nextRow = scan1[sandPosition[1] + 1];
      if (!nextRow) break out;

      if (!nextRow[sandPosition[0]]) sandPosition[1]++;
      else if (!nextRow[sandPosition[0] - 1]) {
        sandPosition[1]++;
        sandPosition[0]--;
      } else if (!nextRow[sandPosition[0] + 1]) {
        sandPosition[1]++;
        sandPosition[0]++;
      } else {
        break;
      }
    }

    scan1[sandPosition[1]][sandPosition[0]] = "o";
    score1++;
  }

  const scan2 = createScan(scanTraces);
  const maxH = scan2.length + 1;
  let score2 = 0;
  out: while (1) {
    const sandPosition = [sandEntryPoint[0], sandEntryPoint[1]];
    while (true) {
      if (sandPosition[1] + 1 === maxH) break;

      const nextRow =
        scan2[sandPosition[1] + 1] ?? (scan2[sandPosition[1] + 1] = {});

      if (!nextRow[sandPosition[0]]) sandPosition[1]++;
      else if (!nextRow[sandPosition[0] - 1]) {
        sandPosition[1]++;
        sandPosition[0]--;
      } else if (!nextRow[sandPosition[0] + 1]) {
        sandPosition[1]++;
        sandPosition[0]++;
      } else {
        break;
      }
    }

    scan2[sandPosition[1]][sandPosition[0]] = "o";
    score2++;

    if (sandPosition[1] === 0) break;
  }

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
