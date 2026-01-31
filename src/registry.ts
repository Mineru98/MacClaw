import type { CommandDefinition, CommandContext, ArgDefinition } from "./types.js";
import { ensureAccessibility } from "./utils/permissions.js";

import launchCmd from "./commands/launch.js";
import quitCmd from "./commands/quit.js";
import statusCmd from "./commands/status.js";
import infoCmd from "./commands/info.js";
import listCmd from "./commands/list.js";
import windowCmd from "./commands/window.js";
import windowsCmd from "./commands/windows.js";
import moveCmd from "./commands/move.js";
import resizeCmd from "./commands/resize.js";
import focusCmd from "./commands/focus.js";
import clickCmd from "./commands/click.js";
import menuCmd from "./commands/menu.js";
import typeFieldCmd from "./commands/type-field.js";
import keystrokeCmd from "./commands/keystroke.js";
import typeCmd from "./commands/type.js";
import mouseClickCmd from "./commands/mouse-click.js";
import elementsCmd from "./commands/elements.js";
import calcCmd from "./tools/calc.js";
import {
  telegramLaunchCmd,
  telegramStatusCmd,
  telegramChatsCmd,
  telegramSearchCmd,
  telegramSendCmd,
} from "./tools/telegram.js";

const allCommands: CommandDefinition[] = [
  launchCmd,
  quitCmd,
  statusCmd,
  infoCmd,
  listCmd,
  windowCmd,
  windowsCmd,
  moveCmd,
  resizeCmd,
  focusCmd,
  clickCmd,
  menuCmd,
  typeFieldCmd,
  keystrokeCmd,
  typeCmd,
  mouseClickCmd,
  elementsCmd,
  calcCmd,
  telegramLaunchCmd,
  telegramStatusCmd,
  telegramChatsCmd,
  telegramSearchCmd,
  telegramSendCmd,
];

export const registry = new Map<string, CommandDefinition>();
for (const cmd of allCommands) {
  registry.set(cmd.name, cmd);
}

export function parseArgs(
  defs: ArgDefinition[],
  rawArgs: string[],
): Record<string, string | boolean | undefined> {
  const result: Record<string, string | boolean | undefined> = {};

  let positionalIndex = 0;
  const positionals = defs.filter((d) => d.type === "positional");

  for (let i = 0; i < rawArgs.length; i++) {
    const token = rawArgs[i]!;

    if (token.startsWith("--")) {
      const def = defs.find((d) => `--${d.name}` === token);

      if (def?.type === "flag") {
        result[def.name] = true;
      } else if (def?.type === "option") {
        result[def.name] = rawArgs[++i];
      } else {
        // Unknown flag — still capture as option (for forward compat)
        const key = token.slice(2);
        const next = rawArgs[i + 1];
        if (next && !next.startsWith("--")) {
          result[key] = next;
          i++;
        } else {
          result[key] = true;
        }
      }
    } else {
      // Positional argument
      const posDef = positionals[positionalIndex];
      if (posDef) {
        result[posDef.name] = token;
        positionalIndex++;
      }
    }
  }

  // Apply defaults
  for (const def of defs) {
    if (result[def.name] === undefined && def.default !== undefined) {
      result[def.name] = def.default;
    }
  }

  return result;
}

export function printUsage(): void {
  const lines: string[] = [
    "MacClaw - macOS App Controller",
    "",
    "Usage: macclaw <command> [options]",
    "",
    "Commands:",
  ];

  const maxUsage = Math.max(...[...registry.values()].map((c) => c.usage.length));

  for (const cmd of registry.values()) {
    const pad = " ".repeat(maxUsage - cmd.usage.length + 4);
    lines.push(`  ${cmd.usage}${pad}${cmd.description}`);
  }

  lines.push("");
  lines.push("Options:");
  lines.push("  --help                              Show help");

  console.log(lines.join("\n"));
}

export async function runCommand(
  name: string,
  rawArgs: string[],
): Promise<void> {
  const cmd = registry.get(name);
  if (!cmd) {
    console.error(`Unknown command: ${name}`);
    console.error("Use --help to see available commands.");
    process.exit(1);
  }

  if (cmd.needsAccessibility !== false) {
    await ensureAccessibility();
  }

  // Validate required args
  const parsed = parseArgs(cmd.args, rawArgs);
  for (const def of cmd.args) {
    if (def.required && parsed[def.name] === undefined) {
      console.error(`Usage: ${cmd.usage}`);
      process.exit(1);
    }
  }

  const ctx: CommandContext = { args: parsed, rawArgs };
  await cmd.run(ctx);
}
