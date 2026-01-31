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
