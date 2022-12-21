import data from "./data";

function getValue(monkeys: Record<string, any>, monkey: any): number {
  const value = monkey.value;

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

export async function main() {
  const monkeys: Record<string, any> = {};
  data
    .split("\n")
    .map((line) => /(\w+): ((\d+)|(\w+) ([\+\-\/\*]) (\w+))/.exec(line) || [])
    .map((l) => {
      console.log(l);

      return l;
    })
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

  console.log("Results:");
  console.log("  1st part:", score1);
  console.log("  2nd part:");
}

main();
