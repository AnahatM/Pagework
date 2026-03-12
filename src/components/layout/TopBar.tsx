import { Button } from "@components/shared/Button";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { saveManifest } from "@tauri/projectCommands";
import styles from "./TopBar.module.css";

export function TopBar() {
  const manifest = useProjectStore((s) => s.manifest);
  const projectPath = useProjectStore((s) => s.projectPath);
  const isDirty = useProjectStore((s) => s.isDirty);
  const markClean = useProjectStore((s) => s.markClean);
  const closeProject = useProjectStore((s) => s.closeProject);
  const activeCenterPanel = useUIStore((s) => s.activeCenterPanel);
  const setCenterPanel = useUIStore((s) => s.setCenterPanel);

  async function handleSave() {
    if (!manifest || !projectPath) return;
    await saveManifest(projectPath, manifest);
    markClean();
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.projectName}>
          {manifest?.projectName ?? "Untitled"}
        </span>
        {isDirty && <span className={styles.dirty}>(unsaved)</span>}
      </div>

      <div className={styles.spacer} />

      <div className={styles.right}>
        <button
          className={`${styles.iconButton} ${activeCenterPanel === "structure" ? styles.active : ""}`}
          onClick={() => setCenterPanel("structure")}
          title="Structure view"
        >
          ☰
        </button>
        <button
          className={`${styles.iconButton} ${activeCenterPanel === "code" ? styles.active : ""}`}
          onClick={() => setCenterPanel("code")}
          title="Code preview"
        >
          {"</>"}
        </button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={closeProject}>
          Close
        </Button>
      </div>
    </header>
  );
}
