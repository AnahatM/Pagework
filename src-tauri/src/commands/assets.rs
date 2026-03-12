use std::path::PathBuf;

/// Copy an asset file to the project's public/assets directory.
#[tauri::command]
pub async fn copy_asset(
    project_path: String,
    source_path: String,
    category: String,
) -> Result<String, String> {
    let project = PathBuf::from(&project_path);
    let source = PathBuf::from(&source_path);

    let file_name = source
        .file_name()
        .ok_or("Invalid source file path")?
        .to_string_lossy()
        .to_string();

    let dest_dir = project.join("public/assets").join(&category);
    std::fs::create_dir_all(&dest_dir)
        .map_err(|e| format!("Failed to create asset directory: {e}"))?;

    let dest_path = dest_dir.join(&file_name);
    std::fs::copy(&source, &dest_path)
        .map_err(|e| format!("Failed to copy asset: {e}"))?;

    // Return the relative path for use in the manifest
    Ok(format!("/assets/{category}/{file_name}"))
}

/// List all asset files in a category.
#[tauri::command]
pub async fn list_assets(
    project_path: String,
    category: String,
) -> Result<Vec<String>, String> {
    let dir = PathBuf::from(&project_path)
        .join("public/assets")
        .join(&category);

    if !dir.exists() {
        return Ok(vec![]);
    }

    let mut files = Vec::new();
    let entries = std::fs::read_dir(&dir)
        .map_err(|e| format!("Failed to read assets directory: {e}"))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {e}"))?;
        if entry.path().is_file() {
            if let Some(name) = entry.path().file_name() {
                files.push(format!("/assets/{category}/{}", name.to_string_lossy()));
            }
        }
    }

    Ok(files)
}

/// Delete an asset file from the project.
#[tauri::command]
pub async fn delete_asset(
    project_path: String,
    asset_path: String,
) -> Result<(), String> {
    // asset_path is like "/assets/banners/hero.png"
    let relative = asset_path.trim_start_matches('/');
    let full_path = PathBuf::from(&project_path).join("public").join(relative);

    if full_path.exists() {
        std::fs::remove_file(&full_path)
            .map_err(|e| format!("Failed to delete asset: {e}"))?;
    }

    Ok(())
}
