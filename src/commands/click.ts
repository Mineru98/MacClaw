import type { CommandDefinition } from "../types.js";
import { clickButton } from "../core/ui-automation.js";

export default {
  name: "click",
  description: "Click a button",
  usage: "click <app> --button <name>",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "button", type: "option", required: true },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const btn = ctx.args.button as string;
    await clickButton(app, btn);
    console.log(`Clicked button "${btn}" in "${app}"`);
  },
} satisfies CommandDefinition;
