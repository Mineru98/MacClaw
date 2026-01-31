import type { CommandDefinition } from "../types.js";
import { getUIElements } from "../core/ui-automation.js";

export default {
  name: "elements",
  description: "UI 요소 트리 조회",
  usage: "elements <app> [--depth N]",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "depth", type: "option", default: "2" },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const depth = parseInt(ctx.args.depth as string, 10);
    const elems = await getUIElements(app, 1, depth);
    console.log(`"${app}" UI 요소:\n`);
    for (const el of elems) {
      const label = [el.role, el.name, el.description].filter(Boolean).join(" | ");
      console.log(`  ${label}`);
      if (el.children) {
        for (const child of el.children) {
          const childLabel = [child.role, child.name, child.description]
            .filter(Boolean)
            .join(" | ");
          console.log(`    ${childLabel}`);
        }
      }
    }
  },
} satisfies CommandDefinition;
