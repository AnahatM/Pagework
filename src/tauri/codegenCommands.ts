/* ═══════════════════════════════════════════
   Codegen IPC Commands
   ═══════════════════════════════════════════ */

import { invoke } from "@tauri-apps/api/core";
import type { SiteBuilderManifest } from "@/types/manifest";

export async function regenerateAll(
  projectPath: string,
  manifest: SiteBuilderManifest,
): Promise<void> {
  return invoke("regenerate_all", { projectPath, manifest });
}
