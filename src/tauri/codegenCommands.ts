/* ═══════════════════════════════════════════
   Codegen IPC Commands
   ═══════════════════════════════════════════ */

import type { SiteBuilderManifest } from "@/types/manifest";
import { invoke } from "@tauri-apps/api/core";

export async function regenerateAll(
  projectPath: string,
  manifest: SiteBuilderManifest,
): Promise<string[]> {
  return invoke<string[]>("regenerate_all", { projectPath, manifest });
}
