use tauri::Manager;

#[tauri::command]
pub async fn regenerate_all(
    app: tauri::AppHandle,
    project_path: String,
    manifest: crate::manifest::schema::SiteBuilderManifest,
) -> Result<Vec<String>, String> {
    let path = std::path::PathBuf::from(&project_path);

    // Save manifest first
    crate::manifest::write_manifest(&path, &manifest)?;

    // Resolve templates directory
    let templates_dir = resolve_templates_dir(&app)?;

    // Run code generation
    crate::codegen::regenerate_all(&path, &manifest, &templates_dir)
}

/// Resolve the templates directory location.
/// In development, templates are next to the src-tauri directory.
/// In production, they're bundled as resources.
fn resolve_templates_dir(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    // Try resource path first (production)
    if let Ok(resource_dir) = app.path().resource_dir() {
        let templates = resource_dir.join("templates");
        if templates.exists() {
            return Ok(templates);
        }
    }

    // Development fallback: templates directory next to Cargo.toml
    let dev_templates = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("templates");
    if dev_templates.exists() {
        return Ok(dev_templates);
    }

    Err("Templates directory not found. Cannot generate website files.".to_string())
}
