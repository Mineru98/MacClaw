import type { CommandDefinition } from "../types.js";
import { getAppInfo } from "../core/app-control.js";

export default {
  name: "info",
  description: "App info (bundle ID, path)",
  usage: "info <app>",
  args: [{ name: "app", type: "positional", required: true }],
  async run(ctx) {
    const app = ctx.args.app as string;
    const info = await getAppInfo(app);
    console.log(`Name:      ${info.name}`);
    console.log(`Bundle ID: ${info.bundleId}`);
    console.log(`Path:      ${info.path}`);
    console.log(`Running:   ${info.running ? "Yes" : "No"}`);
  },
} satisfies CommandDefinition;
