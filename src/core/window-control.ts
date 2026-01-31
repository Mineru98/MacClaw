import { execAppleScript, sanitize } from "./osascript.js";
import type { WindowBounds, WindowInfo } from "../types.js";

/** Get the bounds of the frontmost window of an app. */
export async function getWindowBounds(
  appName: string,
  windowIndex = 1,
): Promise<WindowBounds> {
  const safe = sanitize(appName);
  const result = await execAppleScript(
    `tell application "System Events" to tell process "${safe}"
      set w to window ${windowIndex}
      set {x, y} to position of w
      set {width, height} to size of w
      return (x as text) & "," & (y as text) & "," & (width as text) & "," & (height as text)
    end tell`,
  );
  const parts = result.split(",").map(Number);
  return { x: parts[0] ?? 0, y: parts[1] ?? 0, width: parts[2] ?? 0, height: parts[3] ?? 0 };
}

/** Set the position and/or size of a window. */
export async function setWindowBounds(
  appName: string,
  bounds: Partial<WindowBounds>,
  windowIndex = 1,
): Promise<void> {
  const safe = sanitize(appName);
  const lines: string[] = [];

  if (bounds.x !== undefined && bounds.y !== undefined) {
    lines.push(`set position of w to {${bounds.x}, ${bounds.y}}`);
  }
  if (bounds.width !== undefined && bounds.height !== undefined) {
    lines.push(`set size of w to {${bounds.width}, ${bounds.height}}`);
  }

  if (lines.length === 0) return;

  await execAppleScript(
    `tell application "System Events" to tell process "${safe}"
      set w to window ${windowIndex}
      ${lines.join("\n      ")}
    end tell`,
  );
}

/** List all windows of an application with their info. */
export async function listWindows(appName: string): Promise<WindowInfo[]> {
  const safe = sanitize(appName);
  const countResult = await execAppleScript(
    `tell application "System Events" to tell process "${safe}" to return count of windows`,
  );
  const count = parseInt(countResult, 10);
  if (isNaN(count) || count === 0) return [];

  const windows: WindowInfo[] = [];
  for (let i = 1; i <= count; i++) {
    const result = await execAppleScript(
      `tell application "System Events" to tell process "${safe}"
        set w to window ${i}
        set wName to name of w
        set {x, y} to position of w
        set {width, height} to size of w
        set vis to visible of w
        return wName & "|" & x & "," & y & "," & width & "," & height & "|" & vis
      end tell`,
    );
    const parts = result.split("|");
    const name = parts[0] ?? "";
    const boundsStr = parts[1] ?? "0,0,0,0";
    const visStr = parts[2] ?? "false";
    const bp = boundsStr.split(",").map(Number);
    windows.push({
      name: name || `Window ${i}`,
      index: i,
      bounds: { x: bp[0] ?? 0, y: bp[1] ?? 0, width: bp[2] ?? 0, height: bp[3] ?? 0 },
      visible: visStr.trim() === "true",
    });
  }
  return windows;
}

/** Bring a specific window to the front. */
export async function focusWindow(
  appName: string,
  windowIndex = 1,
): Promise<void> {
  const safe = sanitize(appName);
  await execAppleScript(
    `tell application "System Events" to tell process "${safe}"
      perform action "AXRaise" of window ${windowIndex}
      set frontmost to true
    end tell`,
  );
}
