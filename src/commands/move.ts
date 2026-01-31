import type { CommandDefinition } from "../types.js";
import { setWindowBounds } from "../core/window-control.js";

export default {
  name: "move",
  description: "윈도우 위치 변경",
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
      console.error("--x 와 --y 값이 필요합니다.");
      process.exit(1);
    }
    await setWindowBounds(app, { x, y });
    console.log(`"${app}" 윈도우 이동 → (${x}, ${y})`);
  },
} satisfies CommandDefinition;
