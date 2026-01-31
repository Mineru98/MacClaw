import type { CommandDefinition } from "../types.js";
import { listWindows } from "../core/window-control.js";

export default {
  name: "windows",
  description: "모든 윈도우 목록",
  usage: "windows <app>",
  args: [{ name: "app", type: "positional", required: true }],
  async run(ctx) {
    const app = ctx.args.app as string;
    const wins = await listWindows(app);
    if (wins.length === 0) {
      console.log(`"${app}"에 열린 윈도우가 없습니다.`);
    } else {
      console.log(`"${app}" 윈도우 (${wins.length}개):\n`);
      for (const w of wins) {
        console.log(
          `  [${w.index}] "${w.name}" (${w.bounds.x},${w.bounds.y}) ${w.bounds.width}x${w.bounds.height} ${w.visible ? "" : "(숨김)"}`,
        );
      }
    }
  },
} satisfies CommandDefinition;
