mod commands;
mod codegen;
mod manifest;
mod utils;

use commands::devserver::DevServerState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(DevServerState::default())
        .invoke_handler(tauri::generate_handler![
            // Project
            commands::project::create_project,
            commands::project::open_project,
            commands::project::save_manifest,
            commands::project::get_recent_projects,
            commands::project::add_recent_project,
            // Codegen
            commands::codegen::regenerate_all,
            // Assets
            commands::assets::copy_asset,
            commands::assets::list_assets,
            commands::assets::delete_asset,
            // Dev server
            commands::devserver::get_devserver_status,
            // System
            commands::system::check_node_installed,
            commands::system::check_npm_installed,
            commands::system::get_default_project_dir,
            commands::system::open_in_explorer,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
