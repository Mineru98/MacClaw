import type { CommandDefinition } from "../types.js";
import { listRunningApps } from "../core/app-control.js";

export default {
  name: "list",
  description: "실행 중인 앱 목록",
  usage: "list",
  args: [],
  async run() {
    const apps = await listRunningApps();
    console.log(`실행 중인 앱 (${apps.length}개):\n`);
    for (const app of apps) {
      console.log(`  ${app}`);
    }
  },
} satisfies CommandDefinition;
