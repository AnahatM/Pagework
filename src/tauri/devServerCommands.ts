/* ═══════════════════════════════════════════
   Dev Server IPC Commands
   ═══════════════════════════════════════════ */

import { invoke } from "@tauri-apps/api/core";

export interface DevServerStatus {
  running: boolean;
  port: number | null;
  installing: boolean;
}

export async function getDevServerStatus(): Promise<DevServerStatus> {
  return invoke("get_devserver_status");
}

export async function startDevServer(projectPath: string): Promise<void> {
  return invoke("start_devserver", { projectPath });
}

export async function stopDevServer(): Promise<void> {
  return invoke("stop_devserver");
}

export async function runNpmInstall(projectPath: string): Promise<string> {
  return invoke("run_npm_install", { projectPath });
}
