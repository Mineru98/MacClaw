import type { CommandDefinition } from "../types.js";
import { launchApp } from "../core/app-control.js";

export default {
  name: "launch",
  description: "Launch an app",
  usage: "launch <app>",
  args: [{ name: "app", type: "positional", required: true }],
  async run(ctx) {
    const app = ctx.args.app as string;
    await launchApp(app);
    console.log(`"${app}" launched`);
  },
} satisfies CommandDefinition;
