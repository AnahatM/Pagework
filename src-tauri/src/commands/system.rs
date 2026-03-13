use std::path::PathBuf;

/// Check if Node.js is installed and return its version.
#[tauri::command]
pub async fn check_node_installed() -> Result<String, String> {
    let output = std::process::Command::new("cmd")
        .args(["/c", "node", "--version"])
        .output()
        .map_err(|_| "Node.js is not installed or not in PATH".to_string())?;

    if output.status.success() {
        let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
        Ok(version)
    } else {
        Err("Node.js is not installed or not in PATH".to_string())
    }
}

/// Check if npm is installed and return its version.
#[tauri::command]
pub async fn check_npm_installed() -> Result<String, String> {
    let output = std::process::Command::new("cmd")
        .args(["/c", "npm", "--version"])
        .output()
        .map_err(|_| "npm is not installed or not in PATH".to_string())?;

    if output.status.success() {
        let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
        Ok(version)
    } else {
        Err("npm is not installed or not in PATH".to_string())
    }
}

/// Get default project directory (user's home/SiteBuilder Projects).
#[tauri::command]
pub async fn get_default_project_dir() -> Result<String, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;
    let default_dir = home.join("SiteBuilder Projects");
    Ok(default_dir.to_string_lossy().to_string())
}

/// Open a path in the system file explorer.
#[tauri::command]
pub async fn open_in_explorer(path: String) -> Result<(), String> {
    let p = PathBuf::from(&path);
    if !p.exists() {
        return Err(format!("Path does not exist: {path}"));
    }
    open::that(&path).map_err(|e| format!("Failed to open explorer: {e}"))
}
