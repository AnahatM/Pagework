/* ═══════════════════════════════════════════
   Welcome Screen
   Shown when no project is open
   ═══════════════════════════════════════════ */

import pageworkLogo from "@/assets/PageworkLogo_White.png";
import {
  faFolderOpen,
  faMinus,
  faSquare,
  faSquarePlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { addRecentProject, openProject } from "@tauri/projectCommands";
import { APP_DESCRIPTION, APP_NAME } from "@utils/branding";
import { RecentProjectsList } from "./RecentProjectsList";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen() {
  const openModal = useUIStore((s) => s.openModal);
  const setProject = useProjectStore((s) => s.setProject);

  async function handleOpenExisting() {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Open Pagework Project",
    });
    if (!selected) return;
    try {
      const manifest = await openProject(selected);
      await addRecentProject({
        name: manifest.projectName,
        path: selected,
        lastOpened: new Date().toISOString(),
      });
      setProject(manifest, selected);
    } catch {
      // Invalid project folder — could show error UI later
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleBar}>
        <div className={styles.windowControls}>
          <button
            className={styles.winBtn}
            onClick={() => getCurrentWindow().minimize()}
            title="Minimize"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button
            className={styles.winBtn}
            onClick={() => getCurrentWindow().toggleMaximize()}
            title="Maximize"
          >
            <FontAwesomeIcon icon={faSquare} />
          </button>
          <button
            className={`${styles.winBtn} ${styles.winClose}`}
            onClick={() => getCurrentWindow().close()}
            title="Close"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
      <img src={pageworkLogo} alt={APP_NAME} className={styles.logo} />
      <p className={styles.subtitle}>{APP_DESCRIPTION}</p>

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => openModal("new-project")}
        >
          <FontAwesomeIcon icon={faSquarePlus} className={styles.actionIcon} />
          <span className={styles.actionLabel}>Create New Project</span>
        </button>
        <button className={styles.actionButton} onClick={handleOpenExisting}>
          <FontAwesomeIcon icon={faFolderOpen} className={styles.actionIcon} />
          <span className={styles.actionLabel}>Open Existing Project</span>
        </button>
      </div>

      <RecentProjectsList />
    </div>
  );
}
