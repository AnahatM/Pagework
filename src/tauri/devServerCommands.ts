/* ═══════════════════════════════════════════
   Dev Server IPC Commands
   ═══════════════════════════════════════════ */

import { invoke } from "@tauri-apps/api/core";

export interface DevServerStatus {
  running: boolean;
  port: number | null;
}

export async function getDevServerStatus(): Promise<DevServerStatus> {
  return invoke("get_devserver_status");
}
