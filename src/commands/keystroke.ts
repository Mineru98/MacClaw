import type { CommandDefinition } from "../types.js";
import { keystrokeAS } from "../core/ui-automation.js";

export default {
  name: "keystroke",
  description: "Send keystroke (AppleScript)",
  usage: "keystroke <key> [--mod command,shift]",
  args: [
    { name: "key", type: "positional", required: true },
    { name: "mod", type: "option" },
  ],
  async run(ctx) {
    const key = ctx.args.key as string;
    const modStr = ctx.args.mod as string | undefined;
    const mods = modStr ? modStr.split(",").map((m) => m.trim()) : [];
    await keystrokeAS(key, mods);
    console.log(`Keystroke: "${key}"${mods.length ? ` + ${mods.join("+")}` : ""}`);
  },
} satisfies CommandDefinition;
