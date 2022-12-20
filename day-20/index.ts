import data from "./data";

const getMessage = (encrypted: { value: number }[], rounds = 1) => {
  const message = encrypted.slice();
  for (let index = 0; index < rounds; index++) {
    for (const item of encrypted) {
      if (item.value === 0) continue;

      const index = message.indexOf(item);
      message.splice(index, 1);

      let nextIndex = (index + item.value) % message.length;
      message.splice(nextIndex, 0, item);
    }
  }

  return message;
};

const getScore = (message: { value: number }[]) => {
  const zeroIndex = message.findIndex((item) => item.value === 0);
  const first = message[(zeroIndex + 1_000) % message.length];
  const second = message[(zeroIndex + 2_000) % message.length];
  const third = message[(zeroIndex + 3_000) % message.length];

  return first.value + second.value + third.value;
};

export async function main() {
  const encrypted = data
    .split("\n")
    .map((line) => ({ value: parseInt(line, 10) }));

  const message1 = getMessage(encrypted);
  const score1 = getScore(message1);

  const message2 = getMessage(
    encrypted.map((item) => ({ value: item.value * 811589153 })),
    10
  );
  const score2 = getScore(message2);

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
