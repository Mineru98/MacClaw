import { execAppleScript, runAppleScript, sanitize } from "./osascript.js";
import type { AppInfo } from "../types.js";

/**
 * Resolve a possibly-localized app name to the actual .app bundle name.
 * e.g. "계산기" → "Calculator", "사파리" → "Safari"
 * If the name is already a valid app name, returns it as-is.
 */
export async function resolveAppName(name: string): Promise<string> {
  // Try Spotlight first for localized / non-ASCII names (e.g. "계산기" → "Calculator")
  const proc = Bun.spawn(
    ["mdfind", `kMDItemDisplayName == '${name}' && kMDItemContentType == 'com.apple.application-bundle'`],
    { stdout: "pipe", stderr: "pipe" },
  );
  const output = await new Response(proc.stdout).text();
  await proc.exited;

  const appPath = output.trim().split("\n")[0] ?? "";
  if (appPath && appPath.endsWith(".app")) {
    const match = appPath.match(/\/([^/]+)\.app$/);
    if (match?.[1]) {
      return match[1];
    }
  }

  // If Spotlight didn't find it, try the name directly with AppleScript
  const check = await runAppleScript(
    `id of application "${sanitize(name)}"`,
  );
  if (check.exitCode === 0) {
    return name;
  }

  // Last resort: return original name and let AppleScript handle the error
  return name;
}

/** Launch (activate) an application by name. Supports localized names. */
export async function launchApp(name: string): Promise<void> {
  const resolved = await resolveAppName(name);
  await execAppleScript(`tell application "${sanitize(resolved)}" to activate`);
}

/** Quit an application. Use force=true to skip save dialogs. Supports localized names. */
export async function quitApp(
  name: string,
  force = false,
): Promise<void> {
  const resolved = await resolveAppName(name);
  const suffix = force ? " without saving" : "";
  await execAppleScript(
    `tell application "${sanitize(resolved)}" to quit${suffix}`,
  );
}

/** Check whether an application is currently running. Supports localized names. */
export async function isRunning(name: string): Promise<boolean> {
  const resolved = await resolveAppName(name);
  const result = await execAppleScript(
    `tell application "System Events" to return (name of processes) contains "${sanitize(resolved)}"`,
  );
  return result.trim() === "true";
}

/** Return the names of all running GUI applications (excluding background-only). */
export async function listRunningApps(): Promise<string[]> {
  const result = await execAppleScript(
    `tell application "System Events" to return name of every process whose background only is false`,
  );
  return result
    .split(", ")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Get bundle ID and path for an application. Supports localized names. */
export async function getAppInfo(name: string): Promise<AppInfo> {
  const resolved = await resolveAppName(name);
  const safe = sanitize(resolved);
  const running = await isRunning(resolved);

  const bundleId = await execAppleScript(
    `id of application "${safe}"`,
  );

  const path = await execAppleScript(
    `tell application "Finder" to return POSIX path of (application file id "${sanitize(bundleId)}" as alias)`,
  );

  return {
    name,
    bundleId: bundleId.trim(),
    path: path.trim(),
    running,
  };
}
