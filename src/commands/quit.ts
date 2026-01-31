import type { CommandDefinition } from "../types.js";
import { quitApp } from "../core/app-control.js";

export default {
  name: "quit",
  description: "Quit an app",
  usage: "quit <app> [--force]",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "force", type: "flag" },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const force = ctx.args.force === true;
    await quitApp(app, force);
    console.log(`"${app}" quit`);
  },
} satisfies CommandDefinition;
