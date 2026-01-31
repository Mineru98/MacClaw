import type { CommandDefinition } from "../types.js";
import { getAppInfo } from "../core/app-control.js";

export default {
  name: "info",
  description: "앱 정보 (번들ID, 경로)",
  usage: "info <app>",
  args: [{ name: "app", type: "positional", required: true }],
  async run(ctx) {
    const app = ctx.args.app as string;
    const info = await getAppInfo(app);
    console.log(`이름:     ${info.name}`);
    console.log(`번들 ID:  ${info.bundleId}`);
    console.log(`경로:     ${info.path}`);
    console.log(`실행 중:  ${info.running ? "예" : "아니오"}`);
  },
} satisfies CommandDefinition;
