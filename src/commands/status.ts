import type { CommandDefinition } from "../types.js";
import { isRunning } from "../core/app-control.js";

export default {
  name: "status",
  description: "Check if app is running",
  usage: "status <app>",
  args: [{ name: "app", type: "positional", required: true }],
  async run(ctx) {
    const app = ctx.args.app as string;
    const running = await isRunning(app);
    console.log(running ? `"${app}" is running` : `"${app}" is not running`);
    process.exit(running ? 0 : 1);
  },
} satisfies CommandDefinition;
