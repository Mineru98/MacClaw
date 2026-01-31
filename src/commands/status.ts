import type { CommandDefinition } from "../types.js";
import { isRunning } from "../core/app-control.js";

export default {
  name: "status",
  description: "실행 여부 확인",
  usage: "status <app>",
  args: [{ name: "app", type: "positional", required: true }],
  async run(ctx) {
    const app = ctx.args.app as string;
    const running = await isRunning(app);
    console.log(running ? `"${app}" 실행 중` : `"${app}" 실행 중이 아님`);
    process.exit(running ? 0 : 1);
  },
} satisfies CommandDefinition;
