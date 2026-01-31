#!/usr/bin/env bun
import { ensureAccessibility } from "./utils/permissions.js";
import {
  launchApp,
  quitApp,
  isRunning,
  listRunningApps,
  getAppInfo,
} from "./core/app-control.js";
import {
  getWindowBounds,
  setWindowBounds,
  listWindows,
  focusWindow,
} from "./core/window-control.js";
import {
  clickButton,
  clickMenuItem,
  typeInField,
  keystrokeAS,
  typeText,
  mouseClick,
  getUIElements,
  calcExpression,
} from "./core/ui-automation.js";

const args = process.argv.slice(2);
const command = args[0];

function usage(): void {
  console.log(`MacClaw - macOS App Controller

사용법: macclaw <command> [options]

Commands:
  launch <app>                        앱 실행
  quit <app> [--force]                앱 종료
  status <app>                        실행 여부 확인
  info <app>                          앱 정보 (번들ID, 경로)
  list                                실행 중인 앱 목록

  window <app> [--index N]            윈도우 정보 조회
  windows <app>                       모든 윈도우 목록
  move <app> --x N --y N              윈도우 위치 변경
  resize <app> --w N --h N            윈도우 크기 변경
  focus <app> [--index N]             윈도우 포커스

  click <app> --button <name>         버튼 클릭
  menu <app> --menu <name> --item <name>  메뉴 아이템 클릭
  type-field <app> --field N --text <text>  텍스트 필드 입력
  keystroke <key> [--mod command,shift]    키 입력 (AppleScript)
  type --text <text>                  텍스트 타이핑 (nut-js)
  mouse-click --x N --y N            마우스 클릭 (nut-js)
  elements <app> [--depth N]          UI 요소 트리 조회
  calc <expression>                   계산기로 계산 (예: "42*3")

Options:
  --help                              도움말 표시
`);
}

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

async function main(): Promise<void> {
  if (!command || command === "--help") {
    usage();
    return;
  }

  // Accessibility check for commands that need System Events
  const noPermCommands = new Set(["--help"]);
  if (!noPermCommands.has(command)) {
    await ensureAccessibility();
  }

  const appName = args[1];

  switch (command) {
    case "launch": {
      if (!appName) {
        console.error("사용법: launch <app>");
        process.exit(1);
      }
      await launchApp(appName);
      console.log(`"${appName}" 실행됨`);
      break;
    }

    case "quit": {
      if (!appName) {
        console.error("사용법: quit <app> [--force]");
        process.exit(1);
      }
      const force = hasFlag("--force");
      await quitApp(appName, force);
      console.log(`"${appName}" 종료됨`);
      break;
    }

    case "status": {
      if (!appName) {
        console.error("사용법: status <app>");
        process.exit(1);
      }
      const running = await isRunning(appName);
      console.log(running ? `"${appName}" 실행 중` : `"${appName}" 실행 중이 아님`);
      process.exit(running ? 0 : 1);
      break;
    }

    case "info": {
      if (!appName) {
        console.error("사용법: info <app>");
        process.exit(1);
      }
      const info = await getAppInfo(appName);
      console.log(`이름:     ${info.name}`);
      console.log(`번들 ID:  ${info.bundleId}`);
      console.log(`경로:     ${info.path}`);
      console.log(`실행 중:  ${info.running ? "예" : "아니오"}`);
      break;
    }

    case "list": {
      const apps = await listRunningApps();
      console.log(`실행 중인 앱 (${apps.length}개):\n`);
      for (const app of apps) {
        console.log(`  ${app}`);
      }
      break;
    }

    case "window": {
      if (!appName) {
        console.error("사용법: window <app> [--index N]");
        process.exit(1);
      }
      const idx = parseInt(getArg("--index") ?? "1", 10);
      const bounds = await getWindowBounds(appName, idx);
      console.log(`"${appName}" 윈도우 ${idx}:`);
      console.log(`  위치: (${bounds.x}, ${bounds.y})`);
      console.log(`  크기: ${bounds.width} x ${bounds.height}`);
      break;
    }

    case "windows": {
      if (!appName) {
        console.error("사용법: windows <app>");
        process.exit(1);
      }
      const wins = await listWindows(appName);
      if (wins.length === 0) {
        console.log(`"${appName}"에 열린 윈도우가 없습니다.`);
      } else {
        console.log(`"${appName}" 윈도우 (${wins.length}개):\n`);
        for (const w of wins) {
          console.log(`  [${w.index}] "${w.name}" (${w.bounds.x},${w.bounds.y}) ${w.bounds.width}x${w.bounds.height} ${w.visible ? "" : "(숨김)"}`);
        }
      }
      break;
    }

    case "move": {
      if (!appName) {
        console.error("사용법: move <app> --x N --y N");
        process.exit(1);
      }
      const x = parseInt(getArg("--x") ?? "", 10);
      const y = parseInt(getArg("--y") ?? "", 10);
      if (isNaN(x) || isNaN(y)) {
        console.error("--x 와 --y 값이 필요합니다.");
        process.exit(1);
      }
      await setWindowBounds(appName, { x, y });
      console.log(`"${appName}" 윈도우 이동 → (${x}, ${y})`);
      break;
    }

    case "resize": {
      if (!appName) {
        console.error("사용법: resize <app> --w N --h N");
        process.exit(1);
      }
      const w = parseInt(getArg("--w") ?? "", 10);
      const h = parseInt(getArg("--h") ?? "", 10);
      if (isNaN(w) || isNaN(h)) {
        console.error("--w 와 --h 값이 필요합니다.");
        process.exit(1);
      }
      await setWindowBounds(appName, { width: w, height: h });
      console.log(`"${appName}" 윈도우 크기 변경 → ${w}x${h}`);
      break;
    }

    case "focus": {
      if (!appName) {
        console.error("사용법: focus <app> [--index N]");
        process.exit(1);
      }
      const fIdx = parseInt(getArg("--index") ?? "1", 10);
      await focusWindow(appName, fIdx);
      console.log(`"${appName}" 윈도우 ${fIdx} 포커스됨`);
      break;
    }

    case "click": {
      if (!appName) {
        console.error("사용법: click <app> --button <name>");
        process.exit(1);
      }
      const btn = getArg("--button");
      if (!btn) {
        console.error("--button 값이 필요합니다.");
        process.exit(1);
      }
      await clickButton(appName, btn);
      console.log(`"${appName}" 버튼 "${btn}" 클릭됨`);
      break;
    }

    case "menu": {
      if (!appName) {
        console.error("사용법: menu <app> --menu <name> --item <name>");
        process.exit(1);
      }
      const menuName = getArg("--menu");
      const itemName = getArg("--item");
      if (!menuName || !itemName) {
        console.error("--menu 와 --item 값이 필요합니다.");
        process.exit(1);
      }
      await clickMenuItem(appName, menuName, itemName);
      console.log(`"${appName}" 메뉴 "${menuName}" > "${itemName}" 클릭됨`);
      break;
    }

    case "type-field": {
      if (!appName) {
        console.error("사용법: type-field <app> --field N --text <text>");
        process.exit(1);
      }
      const field = parseInt(getArg("--field") ?? "1", 10);
      const text = getArg("--text");
      if (!text) {
        console.error("--text 값이 필요합니다.");
        process.exit(1);
      }
      await typeInField(appName, field, text);
      console.log(`"${appName}" 텍스트 필드 ${field}에 입력됨`);
      break;
    }

    case "keystroke": {
      const key = args[1];
      if (!key) {
        console.error("사용법: keystroke <key> [--mod command,shift]");
        process.exit(1);
      }
      const modStr = getArg("--mod");
      const mods = modStr ? modStr.split(",").map((m) => m.trim()) : [];
      await keystrokeAS(key, mods);
      console.log(`키 입력: "${key}"${mods.length ? ` + ${mods.join("+")}` : ""}`);
      break;
    }

    case "type": {
      const text = getArg("--text");
      if (!text) {
        console.error("사용법: type --text <text>");
        process.exit(1);
      }
      await typeText(text);
      console.log(`타이핑 완료: "${text}"`);
      break;
    }

    case "mouse-click": {
      const mx = parseInt(getArg("--x") ?? "", 10);
      const my = parseInt(getArg("--y") ?? "", 10);
      if (isNaN(mx) || isNaN(my)) {
        console.error("사용법: mouse-click --x N --y N");
        process.exit(1);
      }
      await mouseClick(mx, my);
      console.log(`마우스 클릭: (${mx}, ${my})`);
      break;
    }

    case "calc": {
      const expr = args[1];
      if (!expr) {
        console.error('사용법: calc <expression>  (예: calc "42*3")');
        process.exit(1);
      }
      const calcResult = await calcExpression(expr);
      console.log(`${expr} = ${calcResult}`);
      break;
    }

    case "elements": {
      if (!appName) {
        console.error("사용법: elements <app> [--depth N]");
        process.exit(1);
      }
      const depth = parseInt(getArg("--depth") ?? "2", 10);
      const elems = await getUIElements(appName, 1, depth);
      console.log(`"${appName}" UI 요소:\n`);
      for (const el of elems) {
        const label = [el.role, el.name, el.description].filter(Boolean).join(" | ");
        console.log(`  ${label}`);
        if (el.children) {
          for (const child of el.children) {
            const childLabel = [child.role, child.name, child.description]
              .filter(Boolean)
              .join(" | ");
            console.log(`    ${childLabel}`);
          }
        }
      }
      break;
    }

    default:
      console.error(`알 수 없는 명령어: ${command}`);
      console.error('--help 로 사용법을 확인하세요.');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`오류: ${err.message}`);
  process.exit(1);
});
