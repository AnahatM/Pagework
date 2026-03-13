use tauri::{Emitter, Manager};

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

    let _ = app.emit("devserver-log", serde_json::json!({
        "message": format!("[codegen] Templates dir: {}", templates_dir.display()),
        "level": "info"
    }));

    let src_components = templates_dir.join("components");
    let _ = app.emit("devserver-log", serde_json::json!({
        "message": format!("[codegen] Components template exists: {}, path: {}", src_components.exists(), src_components.display()),
        "level": "info"
    }));

    // Run code generation
    let result = crate::codegen::regenerate_all(&path, &manifest, &templates_dir)?;

    // Verify critical files were copied
    let layout_path = path.join("src/components/core/Layout.tsx");
    let _ = app.emit("devserver-log", serde_json::json!({
        "message": format!("[codegen] Layout.tsx exists after codegen: {}", layout_path.exists()),
        "level": if layout_path.exists() { "info" } else { "error" }
    }));

    Ok(result)
}

/// Resolve the templates directory location.
/// In development, templates are next to the src-tauri directory.
/// In production, they're bundled as resources.
fn resolve_templates_dir(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    // Development: templates directory next to Cargo.toml (has full structure)
    let dev_templates = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("templates");
    if dev_templates.join("components").exists() {
        return Ok(dev_templates);
    }

    // Production: bundled as resources
    if let Ok(resource_dir) = app.path().resource_dir() {
        let templates = resource_dir.join("templates");
        if templates.join("components").exists() {
            return Ok(templates);
        }
    }

    Err("Templates directory not found. Cannot generate website files.".to_string())
}
