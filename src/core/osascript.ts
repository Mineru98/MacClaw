import type { OsascriptResult } from "../types.js";

/**
 * Sanitize a string for safe use inside AppleScript double-quoted strings.
 * Escapes backslashes and double quotes.
 */
export function sanitize(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Execute an AppleScript string via osascript and return the result.
 */
export async function runAppleScript(
  script: string,
): Promise<OsascriptResult> {
  const proc = Bun.spawn(["osascript", "-e", script], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  return {
    stdout: stdout.trimEnd(),
    stderr: stderr.trimEnd(),
    exitCode,
  };
}

/**
 * Execute an AppleScript and return stdout, throwing on failure.
 */
export async function execAppleScript(script: string): Promise<string> {
  const result = await runAppleScript(script);
  if (result.exitCode !== 0) {
    throw new Error(`osascript failed (${result.exitCode}): ${result.stderr}`);
  }
  return result.stdout;
}
