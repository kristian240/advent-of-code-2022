import data from "./data";

function findMarkerIndex(stream: string[], length: number) {
  let index = -1;

  outer: for (let index = length - 1; index < stream.length; ) {
    const char = stream[index];

    for (let i = 1; i < length; i++) {
      if (char === stream[index - i]) {
        index += length - i;
        continue outer;
      }
    }

    if (new Set(stream.slice(index - (length - 1), index)).size < length - 1) {
      index++;
      continue;
    }

    return index + 1;
  }

  return index;
}

export async function main() {
  const stream = data.split("");

  const startOfPacketIndex = findMarkerIndex(stream, 4);
  const startOfMessageIndex = findMarkerIndex(stream, 14);

  console.log("Results:");
  console.log("  1st part:", startOfPacketIndex);
  console.log("  2nd part:", startOfMessageIndex);
}

main();
