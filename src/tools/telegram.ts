import type { CommandDefinition } from "../types.js";
import { execAppleScript, sanitize } from "../core/osascript.js";
import { ensureAppRunning } from "../core/ui-automation.js";
import { isRunning } from "../core/app-control.js";

const PROCESS = "Telegram";

/** Activate Telegram and wait for its window to be ready. */
async function activateTelegram(): Promise<void> {
  await ensureAppRunning(PROCESS);
  await execAppleScript(`tell application "${PROCESS}" to activate`);
  await execAppleScript(
    `tell application "System Events" to tell process "${PROCESS}"
      delay 0.5
    end tell`,
  );
}

/** Reset Telegram to the main Chats view by pressing Escape. */
async function goToChats(): Promise<void> {
  await execAppleScript(
    `tell application "System Events" to tell process "${PROCESS}"
      key code 53
      delay 0.3
      key code 53
      delay 0.3
    end tell`,
  );
}

/** Open search (Cmd+K), type a query, and select the first result. */
async function searchAndSelect(query: string): Promise<void> {
  await execAppleScript(
    `tell application "System Events" to tell process "${PROCESS}"
      keystroke "k" using command down
      delay 0.5
      keystroke "${sanitize(query)}"
      delay 1
      key code 36
      delay 0.5
    end tell`,
  );
}

/** Type a message in the current chat and press Enter to send. */
async function sendMessage(message: string): Promise<void> {
  await execAppleScript(
    `tell application "System Events" to tell process "${PROCESS}"
      keystroke "${sanitize(message)}"
      delay 0.3
      key code 36
      delay 0.3
    end tell`,
  );
}

// --- CLI Commands ---

export const telegramLaunchCmd = {
  name: "tg-launch",
  description: "Launch Telegram and wait for window ready",
  usage: "tg-launch",
  args: [],
  async run() {
    await activateTelegram();
    console.log("Telegram launched and ready");
  },
} satisfies CommandDefinition;

export const telegramStatusCmd = {
  name: "tg-status",
  description: "Check if Telegram is running",
  usage: "tg-status",
  args: [],
  async run() {
    const running = await isRunning(PROCESS);
    console.log(running ? "Telegram is running" : "Telegram is not running");
  },
} satisfies CommandDefinition;

export const telegramChatsCmd = {
  name: "tg-chats",
  description: "Navigate to Telegram Chats tab",
  usage: "tg-chats",
  args: [],
  async run() {
    await activateTelegram();
    await goToChats();
    console.log("Navigated to Chats");
  },
} satisfies CommandDefinition;

export const telegramSearchCmd = {
  name: "tg-search",
  description: "Search for a chat in Telegram (e.g. \"Saved Messages\")",
  usage: "tg-search <query>",
  args: [{ name: "query", type: "positional", required: true }],
  async run(ctx) {
    const query = ctx.args.query as string;
    await activateTelegram();
    await goToChats();
    await searchAndSelect(query);
    console.log(`Opened chat: ${query}`);
  },
} satisfies CommandDefinition;

export const telegramSendCmd = {
  name: "tg-send",
  description: "Search a chat and send a message",
  usage: "tg-send <recipient> --msg <message>",
  args: [
    { name: "recipient", type: "positional", required: true },
    { name: "msg", type: "option", required: true, description: "Message to send" },
  ],
  async run(ctx) {
    const recipient = ctx.args.recipient as string;
    const message = ctx.args.msg as string;
    await activateTelegram();
    await goToChats();
    await searchAndSelect(recipient);
    await sendMessage(message);
    console.log(`Message sent to ${recipient}: "${message}"`);
  },
} satisfies CommandDefinition;
