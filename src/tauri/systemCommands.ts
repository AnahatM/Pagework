/* ═══════════════════════════════════════════
   System IPC Commands
   ═══════════════════════════════════════════ */

import { invoke } from "@tauri-apps/api/core";

export async function checkNodeInstalled(): Promise<string> {
  return invoke("check_node_installed");
}

export async function checkNpmInstalled(): Promise<string> {
  return invoke("check_npm_installed");
}

export async function getDefaultProjectDir(): Promise<string> {
  return invoke("get_default_project_dir");
}

export async function openInExplorer(path: string): Promise<void> {
  return invoke("open_in_explorer", { path });
}
