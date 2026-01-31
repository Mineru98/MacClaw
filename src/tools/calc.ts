import type { CommandDefinition } from "../types.js";
import { calcExpression } from "../core/ui-automation.js";

export default {
  name: "calc",
  description: 'Calculate with Calculator (e.g. "42*3")',
  usage: "calc <expression>",
  args: [{ name: "expression", type: "positional", required: true }],
  async run(ctx) {
    const expr = ctx.args.expression as string;
    const result = await calcExpression(expr);
    console.log(`${expr} = ${result}`);
  },
} satisfies CommandDefinition;
