import type { CommandDefinition } from "../types.js";
import { typeText } from "../core/ui-automation.js";

export default {
  name: "type",
  description: "Type text (nut-js)",
  usage: "type --text <text>",
  args: [{ name: "text", type: "option", required: true }],
  async run(ctx) {
    const text = ctx.args.text as string;
    await typeText(text);
    console.log(`Typed: "${text}"`);
  },
} satisfies CommandDefinition;
