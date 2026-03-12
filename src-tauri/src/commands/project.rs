use crate::manifest::{self, schema::SiteBuilderManifest};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentProject {
    pub name: String,
    pub path: String,
    pub last_opened: String,
}

/// Create a new project directory with manifest and scaffold.
#[tauri::command]
pub async fn create_project(
    project_path: String,
    manifest: SiteBuilderManifest,
) -> Result<(), String> {
    let path = PathBuf::from(&project_path);

    // Create project directory
    std::fs::create_dir_all(&path)
        .map_err(|e| format!("Failed to create project directory: {e}"))?;

    // Create subdirectories
    let dirs = [
        "src/components",
        "src/pages",
        "src/pages/core",
        "src/routes",
        "src/styles",
        "src/hooks",
        "src/utils",
        "public/assets/banners",
        "public/assets/graphics",
        "public/assets/icons",
        "public/assets/socials",
        "public/assets/images",
    ];
    for dir in &dirs {
        std::fs::create_dir_all(path.join(dir))
            .map_err(|e| format!("Failed to create {dir}: {e}"))?;
    }

    // Write manifest
    manifest::write_manifest(&path, &manifest)?;

    Ok(())
}

/// Open an existing project and return its manifest.
#[tauri::command]
pub async fn open_project(project_path: String) -> Result<SiteBuilderManifest, String> {
    let path = PathBuf::from(&project_path);
    manifest::read_manifest(&path)
}

/// Save the manifest to disk.
#[tauri::command]
pub async fn save_manifest(
    project_path: String,
    manifest: SiteBuilderManifest,
) -> Result<(), String> {
    let path = PathBuf::from(&project_path);
    manifest::write_manifest(&path, &manifest)
}

/// Get the list of recent projects from app data.
#[tauri::command]
pub async fn get_recent_projects(app_handle: tauri::AppHandle) -> Result<Vec<RecentProject>, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {e}"))?;

    let recent_path = app_data_dir.join("recent-projects.json");
    if !recent_path.exists() {
        return Ok(vec![]);
    }

    let content = std::fs::read_to_string(&recent_path)
        .map_err(|e| format!("Failed to read recent projects: {e}"))?;
    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse recent projects: {e}"))
}

/// Add a project to the recent projects list.
#[tauri::command]
pub async fn add_recent_project(
    app_handle: tauri::AppHandle,
    project: RecentProject,
) -> Result<(), String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {e}"))?;

    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data dir: {e}"))?;

    let recent_path = app_data_dir.join("recent-projects.json");
    let mut projects: Vec<RecentProject> = if recent_path.exists() {
        let content = std::fs::read_to_string(&recent_path)
            .map_err(|e| format!("Failed to read recent projects: {e}"))?;
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        vec![]
    };

    // Remove existing entry for same path, then prepend
    projects.retain(|p| p.path != project.path);
    projects.insert(0, project);
    projects.truncate(20);

    let content = serde_json::to_string_pretty(&projects)
        .map_err(|e| format!("Failed to serialize recent projects: {e}"))?;
    std::fs::write(&recent_path, content)
        .map_err(|e| format!("Failed to write recent projects: {e}"))
}
