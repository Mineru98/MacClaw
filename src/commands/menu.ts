import type { CommandDefinition } from "../types.js";
import { clickMenuItem } from "../core/ui-automation.js";

export default {
  name: "menu",
  description: "메뉴 아이템 클릭",
  usage: "menu <app> --menu <name> --item <name>",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "menu", type: "option", required: true },
    { name: "item", type: "option", required: true },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const menuName = ctx.args.menu as string;
    const itemName = ctx.args.item as string;
    await clickMenuItem(app, menuName, itemName);
    console.log(`"${app}" 메뉴 "${menuName}" > "${itemName}" 클릭됨`);
  },
} satisfies CommandDefinition;
