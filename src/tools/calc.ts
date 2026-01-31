import type { CommandDefinition } from "../types.js";
import { calcExpression } from "../core/ui-automation.js";

export default {
  name: "calc",
  description: '계산기로 계산 (예: "42*3")',
  usage: "calc <expression>",
  args: [{ name: "expression", type: "positional", required: true }],
  async run(ctx) {
    const expr = ctx.args.expression as string;
    const result = await calcExpression(expr);
    console.log(`${expr} = ${result}`);
  },
} satisfies CommandDefinition;
