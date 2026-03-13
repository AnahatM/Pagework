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
        serde_json::from_str(&content).unwrap_or_else(|_| vec![])
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

/// Remove a project from the recent projects list by path.
#[tauri::command]
pub async fn remove_recent_project(
    app_handle: tauri::AppHandle,
    project_path: String,
) -> Result<(), String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {e}"))?;

    let recent_path = app_data_dir.join("recent-projects.json");
    if !recent_path.exists() {
        return Ok(());
    }

    let content = std::fs::read_to_string(&recent_path)
        .map_err(|e| format!("Failed to read recent projects: {e}"))?;
    let mut projects: Vec<RecentProject> =
        serde_json::from_str(&content).unwrap_or_else(|_| vec![]);

    projects.retain(|p| p.path != project_path);

    let content = serde_json::to_string_pretty(&projects)
        .map_err(|e| format!("Failed to serialize recent projects: {e}"))?;
    std::fs::write(&recent_path, content)
        .map_err(|e| format!("Failed to write recent projects: {e}"))
}

/// Read a file from the generated project.
#[tauri::command]
pub async fn read_project_file(
    project_path: String,
    relative_path: String,
) -> Result<String, String> {
    // Prevent path traversal
    if relative_path.contains("..") {
        return Err("Invalid file path".to_string());
    }

    let full_path = PathBuf::from(&project_path).join(&relative_path);

    if !full_path.exists() {
        return Err(format!("File not found: {relative_path}"));
    }

    std::fs::read_to_string(&full_path)
        .map_err(|e| format!("Failed to read file: {e}"))
}

/// List viewable files in the generated project.
#[tauri::command]
pub async fn list_project_files(project_path: String) -> Result<Vec<String>, String> {
    let root = PathBuf::from(&project_path);
    let mut files: Vec<String> = Vec::new();

    // Define the directories/files to expose
    let scan_dirs = ["src/pages", "src/routes", "src/styles"];
    let root_files = [
        "index.html",
        "package.json",
        "vite.config.ts",
        "src/App.tsx",
        "src/main.tsx",
        "src/index.css",
    ];

    // Add root-level files that exist
    for file in root_files {
        if root.join(file).exists() {
            files.push(file.to_string());
        }
    }

    // Recursively scan specified directories
    for dir in scan_dirs {
        let dir_path = root.join(dir);
        if dir_path.exists() {
            collect_files(&root, &dir_path, &mut files)?;
        }
    }

    files.sort();
    Ok(files)
}

fn collect_files(
    root: &std::path::Path,
    dir: &std::path::Path,
    files: &mut Vec<String>,
) -> Result<(), String> {
    let entries = std::fs::read_dir(dir)
        .map_err(|e| format!("Failed to read directory: {e}"))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {e}"))?;
        let path = entry.path();
        if path.is_file() {
            if let Ok(relative) = path.strip_prefix(root) {
                files.push(relative.to_string_lossy().replace('\\', "/"));
            }
        } else if path.is_dir() {
            collect_files(root, &path, files)?;
        }
    }
    Ok(())
}
