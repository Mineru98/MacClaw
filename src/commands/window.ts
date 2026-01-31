import type { CommandDefinition } from "../types.js";
import { getWindowBounds } from "../core/window-control.js";

export default {
  name: "window",
  description: "윈도우 정보 조회",
  usage: "window <app> [--index N]",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "index", type: "option", default: "1" },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const idx = parseInt(ctx.args.index as string, 10);
    const bounds = await getWindowBounds(app, idx);
    console.log(`"${app}" 윈도우 ${idx}:`);
    console.log(`  위치: (${bounds.x}, ${bounds.y})`);
    console.log(`  크기: ${bounds.width} x ${bounds.height}`);
  },
} satisfies CommandDefinition;
