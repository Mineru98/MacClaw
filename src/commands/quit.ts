import type { CommandDefinition } from "../types.js";
import { quitApp } from "../core/app-control.js";

export default {
  name: "quit",
  description: "앱 종료",
  usage: "quit <app> [--force]",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "force", type: "flag" },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const force = ctx.args.force === true;
    await quitApp(app, force);
    console.log(`"${app}" 종료됨`);
  },
} satisfies CommandDefinition;
