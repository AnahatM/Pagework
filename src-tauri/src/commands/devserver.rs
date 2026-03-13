use std::io::{BufRead, BufReader};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::Duration;
use tauri::State;

pub struct DevServerState {
    pub status: Mutex<DevServerStatus>,
    pub child: Mutex<Option<Child>>,
}

#[derive(Debug, Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DevServerStatus {
    pub running: bool,
    pub port: Option<u16>,
    pub installing: bool,
}

impl Default for DevServerState {
    fn default() -> Self {
        Self {
            status: Mutex::new(DevServerStatus {
                running: false,
                port: None,
                installing: false,
            }),
            child: Mutex::new(None),
        }
    }
}

/// Get the current dev server status.
#[tauri::command]
pub async fn get_devserver_status(
    state: State<'_, DevServerState>,
) -> Result<DevServerStatus, String> {
    let status = state.status.lock().map_err(|e| e.to_string())?;
    Ok(status.clone())
}

/// Run npm install in the project directory.
#[tauri::command]
pub async fn run_npm_install(
    state: State<'_, DevServerState>,
    project_path: String,
) -> Result<String, String> {
    // Mark installing
    {
        let mut status = state.status.lock().map_err(|e| e.to_string())?;
        status.installing = true;
    }

    let result = (|| -> Result<String, String> {
        let output = Command::new("cmd")
            .args(["/c", "npm", "install"])
            .current_dir(&project_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
            .map_err(|e| format!("Failed to run npm install: {e}"))?;

        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();

        if output.status.success() {
            Ok(stdout)
        } else {
            Err(format!("npm install failed:\n{stderr}\n{stdout}"))
        }
    })();

    // Clear installing
    {
        let mut status = state.status.lock().map_err(|e| e.to_string())?;
        status.installing = false;
    }

    result
}

/// Start the Vite dev server in the project directory.
#[tauri::command]
pub async fn start_devserver(
    state: State<'_, DevServerState>,
    project_path: String,
) -> Result<(), String> {
    // Check if already running
    {
        let status = state.status.lock().map_err(|e| e.to_string())?;
        if status.running {
            return Ok(());
        }
    }

    // Verify package.json exists before attempting npm install
    let package_json = std::path::PathBuf::from(&project_path).join("package.json");
    if !package_json.exists() {
        return Err("package.json not found. Run code generation first.".to_string());
    }

    // Check if node_modules exists, run npm install if not
    let node_modules = std::path::PathBuf::from(&project_path).join("node_modules");
    if !node_modules.exists() {
        // Set installing status
        {
            let mut status = state.status.lock().map_err(|e| e.to_string())?;
            status.installing = true;
        }

        let install = Command::new("cmd")
            .args(["/c", "npm", "install"])
            .current_dir(&project_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
            .map_err(|e| format!("npm install failed: {e}"))?;

        {
            let mut status = state.status.lock().map_err(|e| e.to_string())?;
            status.installing = false;
        }

        if !install.status.success() {
            let stderr = String::from_utf8_lossy(&install.stderr);
            return Err(format!("npm install failed: {stderr}"));
        }
    }

    // Use cmd /c on Windows to run npm
    // Vite outputs its ready message to stderr, so pipe stderr for port detection
    let mut child = Command::new("cmd")
        .args(["/c", "npm", "run", "dev"])
        .current_dir(&project_path)
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start dev server: {e}"))?;

    // Read stderr in a background thread to detect port
    let stderr = child.stderr.take();
    let (tx, rx) = std::sync::mpsc::channel();

    if let Some(stderr) = stderr {
        std::thread::spawn(move || {
            let reader = BufReader::new(stderr);
            let mut found = false;
            for line in reader.lines() {
                match line {
                    Ok(line) => {
                        if !found {
                            if let Some(port) = extract_port(&line) {
                                let _ = tx.send(Some(port));
                                found = true;
                                // Continue draining so the pipe doesn't fill up
                            }
                            if line.contains("EADDRINUSE") {
                                let _ = tx.send(None);
                                return;
                            }
                        }
                    }
                    Err(_) => break,
                }
            }
            if !found {
                let _ = tx.send(None);
            }
        });
    }

    // Wait up to 30 seconds for port detection, fall back to default
    let port = rx
        .recv_timeout(Duration::from_secs(30))
        .unwrap_or(None)
        .or(Some(5173));

    // Store child process handle
    {
        let mut child_lock = state.child.lock().map_err(|e| e.to_string())?;
        *child_lock = Some(child);
    }

    // Update status
    {
        let mut status = state.status.lock().map_err(|e| e.to_string())?;
        status.running = true;
        status.port = port;
    }

    Ok(())
}

/// Stop the running dev server.
#[tauri::command]
pub async fn stop_devserver(
    state: State<'_, DevServerState>,
) -> Result<(), String> {
    {
        let mut child_lock = state.child.lock().map_err(|e| e.to_string())?;
        if let Some(mut child) = child_lock.take() {
            // On Windows, kill the process tree
            #[cfg(target_os = "windows")]
            {
                let pid = child.id();
                let _ = Command::new("taskkill")
                    .args(["/F", "/T", "/PID", &pid.to_string()])
                    .output();
            }
            #[cfg(not(target_os = "windows"))]
            {
                let _ = child.kill();
            }
            let _ = child.wait();
        }
    }

    {
        let mut status = state.status.lock().map_err(|e| e.to_string())?;
        status.running = false;
        status.port = None;
    }

    Ok(())
}

/// Extract port number from Vite output line.
fn extract_port(line: &str) -> Option<u16> {
    // Match patterns like "http://localhost:5173" or "http://127.0.0.1:5173"
    let patterns = ["localhost:", "127.0.0.1:"];
    for pat in patterns {
        if let Some(idx) = line.find(pat) {
            let after = &line[idx + pat.len()..];
            let port_str: String = after.chars().take_while(|c| c.is_ascii_digit()).collect();
            if let Ok(port) = port_str.parse::<u16>() {
                return Some(port);
            }
        }
    }
    None
}
