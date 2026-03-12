/// Placeholder for code generation commands.
/// Will be implemented when the codegen engine is built.

#[tauri::command]
pub async fn regenerate_all(
    project_path: String,
    manifest: crate::manifest::schema::SiteBuilderManifest,
) -> Result<(), String> {
    let path = std::path::PathBuf::from(&project_path);
    // TODO: Implement full code generation pipeline
    // For now, just ensure manifest is saved
    crate::manifest::write_manifest(&path, &manifest)?;
    Ok(())
}
