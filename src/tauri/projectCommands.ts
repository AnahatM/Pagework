/* ═══════════════════════════════════════════
   Project IPC Commands
   Thin wrappers around Tauri invoke calls
   ═══════════════════════════════════════════ */

import type { SiteBuilderManifest } from "@/types/manifest";
import { invoke } from "@tauri-apps/api/core";

export interface RecentProject {
  name: string;
  path: string;
  lastOpened: string;
}

export async function createProject(
  projectPath: string,
  manifest: SiteBuilderManifest,
): Promise<void> {
  return invoke("create_project", { projectPath, manifest });
}

export async function openProject(
  projectPath: string,
): Promise<SiteBuilderManifest> {
  return invoke("open_project", { projectPath });
}

export async function saveManifest(
  projectPath: string,
  manifest: SiteBuilderManifest,
): Promise<void> {
  return invoke("save_manifest", { projectPath, manifest });
}

export async function getRecentProjects(): Promise<RecentProject[]> {
  return invoke("get_recent_projects");
}

export async function addRecentProject(project: RecentProject): Promise<void> {
  return invoke("add_recent_project", { project });
}
