use std::path::Path;

/// Ensure a project path contains the expected manifest file.
pub fn is_valid_project(project_path: &Path) -> bool {
    project_path.join("pagework.project.json").exists()
}

/// Get the generated src directory for a project.
pub fn project_src_dir(project_path: &Path) -> std::path::PathBuf {
    project_path.join("src")
}

/// Get the public assets directory for a project.
pub fn project_assets_dir(project_path: &Path) -> std::path::PathBuf {
    project_path.join("public").join("assets")
}
