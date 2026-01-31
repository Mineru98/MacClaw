import type { CommandDefinition } from "../types.js";
import { mouseClick } from "../core/ui-automation.js";

export default {
  name: "mouse-click",
  description: "마우스 클릭 (nut-js)",
  usage: "mouse-click --x N --y N",
  args: [
    { name: "x", type: "option", required: true },
    { name: "y", type: "option", required: true },
  ],
  async run(ctx) {
    const mx = parseInt(ctx.args.x as string, 10);
    const my = parseInt(ctx.args.y as string, 10);
    if (isNaN(mx) || isNaN(my)) {
      console.error("사용법: mouse-click --x N --y N");
      process.exit(1);
    }
    await mouseClick(mx, my);
    console.log(`마우스 클릭: (${mx}, ${my})`);
  },
} satisfies CommandDefinition;
