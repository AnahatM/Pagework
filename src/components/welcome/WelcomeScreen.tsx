/* ═══════════════════════════════════════════
   Welcome Screen
   Shown when no project is open
   ═══════════════════════════════════════════ */

import { Button } from "@components/shared/Button";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
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
      title: "Open SiteBuilder Project",
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
      <div className={styles.content}>
        <h1 className={styles.title}>{APP_NAME}</h1>
        <p className={styles.subtitle}>{APP_DESCRIPTION}</p>

        <div className={styles.actions}>
          <Button onClick={() => openModal("new-project")}>
            Create New Project
          </Button>
          <Button variant="secondary" onClick={handleOpenExisting}>
            Open Existing Project
          </Button>
        </div>

        <RecentProjectsList />
      </div>
    </div>
  );
}
