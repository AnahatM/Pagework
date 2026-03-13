pub mod schema;

use crate::manifest::schema::SiteBuilderManifest;
use std::path::Path;

const MANIFEST_FILENAME: &str = "pagework.project.json";

/// Read and parse a manifest from a project directory.
pub fn read_manifest(project_path: &Path) -> Result<SiteBuilderManifest, String> {
    let manifest_path = project_path.join(MANIFEST_FILENAME);
    let content = std::fs::read_to_string(&manifest_path)
        .map_err(|e| format!("Failed to read manifest: {e}"))?;
    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse manifest: {e}"))
}

/// Write a manifest to a project directory.
pub fn write_manifest(project_path: &Path, manifest: &SiteBuilderManifest) -> Result<(), String> {
    let manifest_path = project_path.join(MANIFEST_FILENAME);
    let content = serde_json::to_string_pretty(manifest)
        .map_err(|e| format!("Failed to serialize manifest: {e}"))?;
    std::fs::write(&manifest_path, content)
        .map_err(|e| format!("Failed to write manifest: {e}"))
}
