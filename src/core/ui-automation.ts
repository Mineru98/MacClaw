import { execAppleScript, sanitize } from "./osascript.js";
import { keyboard, mouse, Point, Key } from "@nut-tree-fork/nut-js";
import type { UIElement } from "../types.js";

/** Click a button by name inside an app window. */
export async function clickButton(
  appName: string,
  buttonName: string,
  windowIndex = 1,
): Promise<void> {
  await execAppleScript(
    `tell application "System Events" to tell process "${sanitize(appName)}"
      click button "${sanitize(buttonName)}" of window ${windowIndex}
    end tell`,
  );
}

/** Click a menu bar item. */
export async function clickMenuItem(
  appName: string,
  menuName: string,
  itemName: string,
): Promise<void> {
  await execAppleScript(
    `tell application "${sanitize(appName)}" to activate
    delay 0.3
    tell application "System Events" to tell process "${sanitize(appName)}"
      click menu item "${sanitize(itemName)}" of menu "${sanitize(menuName)}" of menu bar 1
    end tell`,
  );
}

/** Set the value of a text field. */
export async function typeInField(
  appName: string,
  fieldIndex: number,
  text: string,
  windowIndex = 1,
): Promise<void> {
  await execAppleScript(
    `tell application "System Events" to tell process "${sanitize(appName)}"
      set focused of text field ${fieldIndex} of window ${windowIndex} to true
      set value of text field ${fieldIndex} of window ${windowIndex} to "${sanitize(text)}"
    end tell`,
  );
}

/** Send a keystroke via AppleScript (e.g. "v" with command down). */
export async function keystrokeAS(
  key: string,
  modifiers: string[] = [],
): Promise<void> {
  const modStr =
    modifiers.length > 0
      ? ` using {${modifiers.map((m) => `${m} down`).join(", ")}}`
      : "";
  await execAppleScript(
    `tell application "System Events" to keystroke "${sanitize(key)}"${modStr}`,
  );
}

/** Type text using nut-js keyboard (works regardless of focused app). */
export async function typeText(text: string): Promise<void> {
  await keyboard.type(text);
}

/** Press specific keys using nut-js. */
export async function pressKeys(...keys: Key[]): Promise<void> {
  await keyboard.pressKey(...keys);
  await keyboard.releaseKey(...keys);
}

/** Click at screen coordinates using nut-js. */
export async function mouseClick(x: number, y: number): Promise<void> {
  await mouse.setPosition(new Point(x, y));
  await mouse.leftClick();
}

/** Ensure an app is running and its window is ready. Launches if not running. */
export async function ensureAppRunning(appName: string): Promise<void> {
  const safe = sanitize(appName);
  const running = await execAppleScript(
    `tell application "System Events" to (name of processes) contains "${safe}"`,
  );
  if (running.trim() !== "true") {
    await execAppleScript(`tell application "${safe}" to activate`);
  }
  // Wait until the app has at least one window
  await execAppleScript(
    `tell application "System Events"
      repeat 20 times
        if (name of processes) contains "${safe}" then
          tell process "${safe}"
            if (count of windows) > 0 then return
          end tell
          -- Process running but no window; activate to open one
          tell application "${safe}" to activate
        end if
        delay 0.3
      end repeat
      error "Timed out waiting for ${safe} to be ready"
    end tell`,
  );
}

/** Use the macOS Calculator app: type an expression, press =, and return the result. */
export async function calcExpression(expression: string): Promise<string> {
  await ensureAppRunning("Calculator");
  await execAppleScript(`tell application "Calculator" to activate`);
  // Wait for activation
  await execAppleScript(
    `tell application "System Events" to tell process "Calculator"
      delay 0.3
      keystroke "c"
      delay 0.2
    end tell`,
  );

  // Type each character of the expression with small delays
  for (const ch of expression) {
    await execAppleScript(
      `tell application "System Events" to tell process "Calculator"
        keystroke "${sanitize(ch)}"
        delay 0.1
      end tell`,
    );
  }

  // Press = and read the result
  const result = await execAppleScript(
    `tell application "System Events" to tell process "Calculator"
      keystroke "="
      delay 0.5
      set resultArea to scroll area 2 of group 1 of group 1 of splitter group 1 of group 1 of window 1
      set resultVal to value of static text 1 of resultArea
      return resultVal
    end tell`,
  );

  // Remove invisible Unicode direction markers
  return result.replace(/[\u200E\u200F\u200B\u2066\u2067\u2068\u2069]/g, "").trim();
}

/** Get the UI element tree of an app (top-level elements of frontmost window). */
export async function getUIElements(
  appName: string,
  windowIndex = 1,
  maxDepth = 2,
): Promise<UIElement[]> {
  const safe = sanitize(appName);

  // Recursive AppleScript is limited, so we fetch a flat list with role+name+description
  const script = maxDepth <= 1
    ? `tell application "System Events" to tell process "${safe}"
        set output to ""
        set elems to UI elements of window ${windowIndex}
        repeat with e in elems
          set r to role of e
          set n to ""
          try
            set n to name of e
          end try
          set d to ""
          try
            set d to description of e
          end try
          set output to output & r & "||" & n & "||" & d & "\\n"
        end repeat
        return output
      end tell`
    : `tell application "System Events" to tell process "${safe}"
        set output to ""
        set elems to UI elements of window ${windowIndex}
        repeat with e in elems
          set r to role of e
          set n to ""
          try
            set n to name of e
          end try
          set d to ""
          try
            set d to description of e
          end try
          set output to output & "0||" & r & "||" & n & "||" & d & "\\n"
          try
            set children to UI elements of e
            repeat with c in children
              set cr to role of c
              set cn to ""
              try
                set cn to name of c
              end try
              set cd to ""
              try
                set cd to description of c
              end try
              set output to output & "1||" & cr & "||" & cn & "||" & cd & "\\n"
            end repeat
          end try
        end repeat
        return output
      end tell`;

  const result = await execAppleScript(script);

  if (maxDepth <= 1) {
    return result
      .split("\\n")
      .filter(Boolean)
      .map((line) => {
        const [role = "", name = "", description = ""] = line.split("||");
        return { role, name, description };
      });
  }

  // Parse depth-aware output
  const elements: UIElement[] = [];
  let currentParent: UIElement | null = null;

  for (const line of result.split("\\n").filter(Boolean)) {
    const segs = line.split("||");
    const depthStr = segs[0] ?? "0";
    const role = segs[1] ?? "";
    const name = segs[2] ?? "";
    const description = segs[3] ?? "";
    const depth = parseInt(depthStr, 10);

    const el: UIElement = { role, name, description };

    if (depth === 0) {
      el.children = [];
      elements.push(el);
      currentParent = el;
    } else if (currentParent) {
      currentParent.children!.push(el);
    }
  }

  return elements;
}
