export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInfo {
  name: string;
  index: number;
  bounds: WindowBounds;
  visible: boolean;
}

export interface AppInfo {
  name: string;
  bundleId: string;
  path: string;
  running: boolean;
}

export interface UIElement {
  role: string;
  name: string;
  description: string;
  children?: UIElement[];
}

export interface OsascriptResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// --- Command Registry ---

export interface ArgDefinition {
  name: string;
  type: "positional" | "flag" | "option";
  required?: boolean;
  default?: string;
  description?: string;
}

export interface CommandContext {
  args: Record<string, string | boolean | undefined>;
  rawArgs: string[];
}

export interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  needsAccessibility?: boolean;
  args: ArgDefinition[];
  run(ctx: CommandContext): Promise<void>;
}
