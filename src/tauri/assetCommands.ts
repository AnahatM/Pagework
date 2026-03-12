/* ═══════════════════════════════════════════
   Asset IPC Commands
   ═══════════════════════════════════════════ */

import { invoke } from "@tauri-apps/api/core";

export async function copyAsset(
  projectPath: string,
  sourcePath: string,
  category: string,
): Promise<string> {
  return invoke("copy_asset", { projectPath, sourcePath, category });
}

export async function listAssets(
  projectPath: string,
  category: string,
): Promise<string[]> {
  return invoke("list_assets", { projectPath, category });
}

export async function deleteAsset(
  projectPath: string,
  assetPath: string,
): Promise<void> {
  return invoke("delete_asset", { projectPath, assetPath });
}
