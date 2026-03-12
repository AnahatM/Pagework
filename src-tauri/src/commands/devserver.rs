use std::sync::Mutex;
use tauri::State;

pub struct DevServerState {
    pub status: Mutex<DevServerStatus>,
}

#[derive(Debug, Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DevServerStatus {
    pub running: bool,
    pub port: Option<u16>,
}

impl Default for DevServerState {
    fn default() -> Self {
        Self {
            status: Mutex::new(DevServerStatus {
                running: false,
                port: None,
            }),
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

// TODO: start_devserver and stop_devserver will spawn/kill
// a child `npm run dev` process. Deferred until Phase 8.
