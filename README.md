# MacClaw

A macOS application controller CLI built with Bun and TypeScript. Control native macOS apps via AppleScript/osascript and nut-js automation.

## Features

- **App Management**: Launch, quit, check status of any macOS application
- **Localization Support**: Works with localized app names (e.g., "계산기" → "Calculator") via Spotlight
- **Window Control**: Position, resize, list, and focus application windows
- **UI Automation**: Click buttons, access menu items, type in text fields
- **Input Automation**: Keyboard shortcuts and mouse control via nut-js
- **Calculator Demo**: Interactive calculator control with expression input

## Requirements

- macOS only
- Bun runtime
- Accessibility permission (System Settings > Privacy & Security > Accessibility)

## Installation

```bash
git clone https://github.com/Mineru98/MacClaw
cd MacClaw
bun install
bun link
```

After linking, use `macclaw` command globally.

## Usage

### App Control
```bash
macclaw launch Calculator
macclaw quit Safari --force
macclaw status "Google Chrome"
macclaw info Finder
macclaw list
```

### Window Management
```bash
macclaw window Calculator
macclaw windows Safari
macclaw move Calculator --x 100 --y 100
macclaw resize Calculator --w 400 --h 300
macclaw focus Calculator --index 0
```

### UI Automation
```bash
macclaw click Calculator --button "1"
macclaw menu Calculator --menu "View" --item "Basic"
macclaw type-field TextEdit --field 0 --text "Hello World"
macclaw elements Calculator --depth 2
```

### Input Control
```bash
macclaw keystroke c --mod command
macclaw type --text "Hello World"
macclaw mouse-click --x 500 --y 300
```

### Calculator Demo
```bash
macclaw calc "42*3"        # Launches Calculator, inputs expression, returns result
```

## Development

```bash
bun install              # Install dependencies
bun run start <command>  # Run CLI commands
bun run dev              # Start with hot reload (--watch)
bun run typecheck        # TypeScript type checking
```

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Automation**: AppleScript/osascript, @nut-tree-fork/nut-js
- **App Discovery**: Spotlight/mdfind

## License

MIT
