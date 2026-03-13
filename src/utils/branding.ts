/**
 * App branding constants.
 * Change these values to rebrand the entire application.
 */

export const APP_NAME = "Pagework";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION = "Build websites without writing code.";

/** Default directory name for storing projects (inside user's home dir) */
export const DEFAULT_PROJECTS_DIR_NAME = "Pagework Projects";

/** Manifest filename in every project root */
export const MANIFEST_FILENAME = "pagework.project.json";

/** Recent projects storage key (in Tauri app data) */
export const RECENT_PROJECTS_FILENAME = "recent-projects.json";

/** Max number of recent projects to remember */
export const MAX_RECENT_PROJECTS = 20;

/** Auto-save debounce delay in ms */
export const AUTO_SAVE_DELAY_MS = 3000;

/** Dev server default port (Vite default) */
export const DEV_SERVER_DEFAULT_PORT = 5173;
