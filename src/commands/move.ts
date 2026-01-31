import type { CommandDefinition } from "../types.js";
import { setWindowBounds } from "../core/window-control.js";

export default {
  name: "move",
  description: "Move window position",
  usage: "move <app> --x N --y N",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "x", type: "option", required: true },
    { name: "y", type: "option", required: true },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const x = parseInt(ctx.args.x as string, 10);
    const y = parseInt(ctx.args.y as string, 10);
    if (isNaN(x) || isNaN(y)) {
      console.error("--x and --y values are required.");
      process.exit(1);
    }
    await setWindowBounds(app, { x, y });
    console.log(`Moved "${app}" window to (${x}, ${y})`);
  },
} satisfies CommandDefinition;
