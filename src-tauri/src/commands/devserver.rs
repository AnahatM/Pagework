use std::io::{BufRead, BufReader};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::Duration;
use tauri::{AppHandle, Emitter, State};

/// Payload for devserver-log events sent to the frontend.
#[derive(Clone, serde::Serialize)]
struct LogPayload {
    message: String,
    level: String, // "info" | "warn" | "error"
}

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

/// Emit a log event to the frontend.
fn emit_log(app: &AppHandle, message: &str, level: &str) {
    let _ = app.emit(
        "devserver-log",
        LogPayload {
            message: message.to_string(),
            level: level.to_string(),
        },
    );
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
    app: AppHandle,
    state: State<'_, DevServerState>,
    project_path: String,
) -> Result<(), String> {
    // Check if already running
    {
        let status = state.status.lock().map_err(|e| e.to_string())?;
        if status.running {
            emit_log(&app, "Dev server is already running", "info");
            return Ok(());
        }
    }

    // Verify package.json exists before attempting npm install
    let package_json = std::path::PathBuf::from(&project_path).join("package.json");
    if !package_json.exists() {
        emit_log(&app, "ERROR: package.json not found in project directory", "error");
        return Err("package.json not found. Run code generation first.".to_string());
    }
    emit_log(&app, "✓ package.json found", "info");

    // Always run npm install to ensure dependencies are in sync with package.json
    emit_log(&app, "Running npm install…", "info");
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
        .map_err(|e| {
            emit_log(&app, &format!("npm install failed to start: {e}"), "error");
            format!("npm install failed: {e}")
        })?;

    {
        let mut status = state.status.lock().map_err(|e| e.to_string())?;
        status.installing = false;
    }

    if !install.status.success() {
        let stderr = String::from_utf8_lossy(&install.stderr);
        emit_log(&app, &format!("npm install failed:\n{stderr}"), "error");
        return Err(format!("npm install failed: {stderr}"));
    }
    emit_log(&app, "✓ npm install completed", "info");

    emit_log(&app, "Starting Vite dev server…", "info");

    // Pipe both stdout and stderr — Vite may output the URL on either stream
    let mut child = Command::new("cmd")
        .args(["/c", "npm", "run", "dev"])
        .current_dir(&project_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| {
            emit_log(&app, &format!("Failed to spawn dev server process: {e}"), "error");
            format!("Failed to start dev server: {e}")
        })?;

    emit_log(&app, "Vite process spawned — waiting for server ready…", "info");

    // Scan both stdout and stderr for the port in background threads
    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let (tx, rx) = std::sync::mpsc::channel();

    fn spawn_reader<R: std::io::Read + Send + 'static>(
        reader: R,
        label: &'static str,
        app: AppHandle,
        tx: std::sync::mpsc::Sender<Option<u16>>,
    ) {
        std::thread::spawn(move || {
            let buf = BufReader::new(reader);
            let mut sent = false;
            for line in buf.lines() {
                match line {
                    Ok(line) => {
                        let level = if line.contains("error") || line.contains("ERROR") {
                            "error"
                        } else {
                            "info"
                        };
                        emit_log(&app, &format!("[{label}] {line}"), level);

                        if !sent {
                            if let Some(port) = extract_port(&line) {
                                let _ = tx.send(Some(port));
                                sent = true;
                            }
                            if line.contains("EADDRINUSE") {
                                emit_log(&app, "Port is already in use!", "error");
                                let _ = tx.send(None);
                                sent = true;
                            }
                        }
                    }
                    Err(_) => break,
                }
            }
        });
    }

    if let Some(stdout) = stdout {
        spawn_reader(stdout, "stdout", app.clone(), tx.clone());
    }
    if let Some(stderr) = stderr {
        spawn_reader(stderr, "stderr", app.clone(), tx.clone());
    }
    // Drop the original sender so rx doesn't block forever if threads exit without sending
    drop(tx);

    // Wait up to 30 seconds for port detection, fall back to default
    let port = rx
        .recv_timeout(Duration::from_secs(30))
        .unwrap_or(None)
        .or(Some(5173));

    emit_log(&app, &format!("✓ Dev server running on port {}", port.unwrap_or(5173)), "info");

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

/// Strip ANSI escape sequences from a string.
fn strip_ansi(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut chars = s.chars();
    while let Some(c) = chars.next() {
        if c == '\x1b' {
            // Skip until we hit a letter (the terminator of the escape sequence)
            for esc_c in chars.by_ref() {
                if esc_c.is_ascii_alphabetic() {
                    break;
                }
            }
        } else {
            result.push(c);
        }
    }
    result
}

/// Extract port number from Vite output line (strips ANSI codes first).
fn extract_port(line: &str) -> Option<u16> {
    let clean = strip_ansi(line);
    // Match patterns like "http://localhost:5173" or "http://127.0.0.1:5173"
    let patterns = ["localhost:", "127.0.0.1:"];
    for pat in patterns {
        if let Some(idx) = clean.find(pat) {
            let after = &clean[idx + pat.len()..];
            let port_str: String = after.chars().take_while(|c| c.is_ascii_digit()).collect();
            if let Ok(port) = port_str.parse::<u16>() {
                return Some(port);
            }
        }
    }
    None
}
