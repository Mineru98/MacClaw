import type { CommandDefinition } from "../types.js";
import { typeInField } from "../core/ui-automation.js";

export default {
  name: "type-field",
  description: "Type into a text field",
  usage: "type-field <app> --field N --text <text>",
  args: [
    { name: "app", type: "positional", required: true },
    { name: "field", type: "option", default: "1" },
    { name: "text", type: "option", required: true },
  ],
  async run(ctx) {
    const app = ctx.args.app as string;
    const field = parseInt(ctx.args.field as string, 10);
    const text = ctx.args.text as string;
    await typeInField(app, field, text);
    console.log(`Typed into text field ${field} of "${app}"`);
  },
} satisfies CommandDefinition;
