use std::path::Path;

/// Ensure a project path contains the expected manifest file.
#[allow(dead_code)]
pub fn is_valid_project(project_path: &Path) -> bool {
    project_path.join("pagework.project.json").exists()
}

#[allow(dead_code)]
pub fn project_src_dir(project_path: &Path) -> std::path::PathBuf {
    project_path.join("src")
}

#[allow(dead_code)]
pub fn project_assets_dir(project_path: &Path) -> std::path::PathBuf {
    project_path.join("public").join("assets")
}
