import type { CommandDefinition } from "../types.js";
import { setWindowBounds } from "../core/window-control.js";

export default {
  name: "resize",
  description: "윈도우 크기 변경",
  usage: "resize <app> --w N --h N",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "w", type: "option", required: true },
    { name: "h", type: "option", required: true },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const w = parseInt(ctx.args.w as string, 10);
    const h = parseInt(ctx.args.h as string, 10);
    if (isNaN(w) || isNaN(h)) {
      console.error("--w 와 --h 값이 필요합니다.");
      process.exit(1);
    }
    await setWindowBounds(app, { width: w, height: h });
    console.log(`"${app}" 윈도우 크기 변경 → ${w}x${h}`);
  },
} satisfies CommandDefinition;
