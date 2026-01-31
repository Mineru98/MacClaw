import type { CommandDefinition } from "../types.js";
import { clickMenuItem } from "../core/ui-automation.js";

export default {
  name: "menu",
  description: "Click a menu item",
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
    console.log(`Clicked "${app}" menu "${menuName}" > "${itemName}"`);
  },
} satisfies CommandDefinition;
