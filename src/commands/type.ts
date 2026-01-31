import type { CommandDefinition } from "../types.js";
import { typeText } from "../core/ui-automation.js";

export default {
  name: "type",
  description: "텍스트 타이핑 (nut-js)",
  usage: "type --text <text>",
  args: [{ name: "text", type: "option", required: true }],
  async run(ctx) {
    const text = ctx.args.text as string;
    await typeText(text);
    console.log(`타이핑 완료: "${text}"`);
  },
} satisfies CommandDefinition;
