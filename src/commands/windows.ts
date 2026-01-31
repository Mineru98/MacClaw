import type { CommandDefinition } from "../types.js";
import { listWindows } from "../core/window-control.js";

export default {
  name: "windows",
  description: "List all windows",
  usage: "windows <app>",
  args: [{ name: "app", type: "positional", required: true }],
  async run(ctx) {
    const app = ctx.args.app as string;
    const wins = await listWindows(app);
    if (wins.length === 0) {
      console.log(`No open windows for "${app}".`);
    } else {
      console.log(`"${app}" windows (${wins.length}):\n`);
      for (const w of wins) {
        console.log(
          `  [${w.index}] "${w.name}" (${w.bounds.x},${w.bounds.y}) ${w.bounds.width}x${w.bounds.height} ${w.visible ? "" : "(hidden)"}`,
        );
      }
    }
  },
} satisfies CommandDefinition;
