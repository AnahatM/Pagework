import { useDevServerStore } from "@stores/devServerStore";
import { useProjectStore } from "@stores/projectStore";
import styles from "./StatusBar.module.css";

export function StatusBar() {
  const status = useDevServerStore((s) => s.status);
  const projectPath = useProjectStore((s) => s.projectPath);

  const statusLabels: Record<string, string> = {
    stopped: "Dev server stopped",
    starting: "Starting dev server…",
    installing: "Installing dependencies…",
    running: "Dev server running",
    error: "Dev server error",
  };

  return (
    <footer className={styles.statusbar}>
      <div className={styles.left}>
        <span className={`${styles.indicator} ${styles[status]}`} />
        <span className={styles.statusLabel}>{statusLabels[status]}</span>
      </div>
      <div className={styles.right}>
        {projectPath && <span className={styles.pathText}>{projectPath}</span>}
      </div>
    </footer>
  );
}
