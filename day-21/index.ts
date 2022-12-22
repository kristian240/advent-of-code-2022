import data from "./data";

function getValue(monkeys: Record<string, any>, monkey: any): number {
  const value = monkey.value;
  // console.log("getValue", monkey.name, value);

  if (value !== null) return monkey.value;

  const left = monkeys[monkey.left];
  const right = monkeys[monkey.right];

  switch (monkey.operator) {
    case "+":
      return getValue(monkeys, left) + getValue(monkeys, right);
    case "-":
      return getValue(monkeys, left) - getValue(monkeys, right);
    case "*":
      return getValue(monkeys, left) * getValue(monkeys, right);
    case "/":
      return getValue(monkeys, left) / getValue(monkeys, right);
  }

  throw new Error("Unknown operator: " + monkey.operator);
}

function hasMonkey(
  name: string,
  monkeys: Record<string, any>,
  monkey: any
): boolean {
  if (monkey.name === name) return true;

  if (monkey.value !== null) return false;

  return (
    hasMonkey(name, monkeys, monkeys[monkey.left]) ||
    hasMonkey(name, monkeys, monkeys[monkey.right])
  );
}

function getValue2(monkeys: Record<string, any>, name: string): number {
  let humanInLeft = hasMonkey(name, monkeys, monkeys[monkeys.root.left]);
  let nextMonkey = humanInLeft
    ? monkeys[monkeys.root.left]
    : monkeys[monkeys.root.right];

  let score2 = getValue(
    monkeys,
    monkeys[humanInLeft ? monkeys.root.right : monkeys.root.left]
  );
  while (nextMonkey.name !== name) {
    humanInLeft = hasMonkey(name, monkeys, monkeys[nextMonkey.left]);
    const operator = nextMonkey.operator;

    const scoreInOther = getValue(
      monkeys,
      monkeys[humanInLeft ? nextMonkey.right : nextMonkey.left]
    );

    nextMonkey = humanInLeft
      ? monkeys[nextMonkey.left]
      : monkeys[nextMonkey.right];

    switch (operator) {
      case "+":
        score2 -= scoreInOther;
        break;
      case "-":
        score2 = humanInLeft ? score2 + scoreInOther : scoreInOther - score2;
        break;
      case "*":
        score2 /= scoreInOther;

        break;
      case "/":
        score2 = humanInLeft ? score2 * scoreInOther : scoreInOther / score2;
        break;
    }
  }

  return score2;
}

export async function main() {
  const monkeys: Record<string, any> = {};
  data
    .split("\n")
    .map((line) => /(\w+): ((\d+)|(\w+) ([\+\-\/\*]) (\w+))/.exec(line) || [])
    .map(([, name, , rawValue, left, operator, right]) => {
      const value = parseInt(rawValue);

      monkeys[name] = {
        name,
        value: isNaN(value) ? null : value,
        operator,
        left,
        right,
      };

      return monkeys[name];
    });

  const score1 = getValue(monkeys, monkeys.root);
  const score2 = getValue2(monkeys, "humn");

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:", score2);
}

main();
