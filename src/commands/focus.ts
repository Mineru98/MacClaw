import type { CommandDefinition } from "../types.js";
import { focusWindow } from "../core/window-control.js";

export default {
  name: "focus",
  description: "윈도우 포커스",
  usage: "focus <app> [--index N]",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "index", type: "option", default: "1" },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const idx = parseInt(ctx.args.index as string, 10);
    await focusWindow(app, idx);
    console.log(`"${app}" 윈도우 ${idx} 포커스됨`);
  },
} satisfies CommandDefinition;
