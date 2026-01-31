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
        "접근성 권한이 필요합니다.",
        "",
        "설정 방법:",
        "  1. 시스템 설정 > 개인정보 보호 및 보안 > 접근성",
        "  2. '+' 버튼을 클릭하여 터미널 앱 추가",
        "     (Terminal.app, iTerm, Warp 등 사용 중인 터미널)",
        "  3. 토글을 켜서 권한 허용",
        "",
        "System Settings > Privacy & Security > Accessibility",
        "Add your terminal app and enable the toggle.",
      ].join("\n"),
    );
    process.exit(1);
  }
}
