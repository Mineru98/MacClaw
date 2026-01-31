import { runAppleScript } from "../core/osascript.js";

/** Check if the current process has accessibility (System Events) permission. */
export async function checkAccessibility(): Promise<boolean> {
  const result = await runAppleScript(
    `tell application "System Events" to return name of first process`,
  );
  return result.exitCode === 0;
}

/** Print a helpful message if accessibility is not granted. */
export async function ensureAccessibility(): Promise<void> {
  const ok = await checkAccessibility();
  if (!ok) {
    console.error(
      [
        "Accessibility permission is required.",
        "",
        "Setup:",
        "  1. System Settings > Privacy & Security > Accessibility",
        "  2. Click '+' to add your terminal app",
        "     (Terminal.app, iTerm, Warp, etc.)",
        "  3. Enable the toggle to grant permission",
      ].join("\n"),
    );
    process.exit(1);
  }
}
