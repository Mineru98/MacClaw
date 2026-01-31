import type { CommandDefinition } from "../types.js";
import { listRunningApps } from "../core/app-control.js";

export default {
  name: "list",
  description: "List running apps",
  usage: "list",
  args: [],
  async run() {
    const apps = await listRunningApps();
    console.log(`Running apps (${apps.length}):\n`);
    for (const app of apps) {
      console.log(`  ${app}`);
    }
  },
} satisfies CommandDefinition;
