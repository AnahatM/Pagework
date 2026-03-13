import { useDevServerStore } from "@stores/devServerStore";
import { useOutputLogStore } from "@stores/outputLogStore";
import { useProjectStore } from "@stores/projectStore";
import styles from "./StatusBar.module.css";

export function StatusBar() {
  const status = useDevServerStore((s) => s.status);
  const errorMessage = useDevServerStore((s) => s.errorMessage);
  const projectPath = useProjectStore((s) => s.projectPath);
  const outputOpen = useOutputLogStore((s) => s.isOpen);
  const toggleOutput = useOutputLogStore((s) => s.toggle);
  const logCount = useOutputLogStore((s) => s.entries.length);

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
        {status === "error" && errorMessage && (
          <span className={styles.errorText} title={errorMessage}>
            — {errorMessage}
          </span>
        )}
      </div>
      <div className={styles.right}>
        <button
          className={`${styles.outputToggle} ${outputOpen ? styles.outputActive : ""}`}
          onClick={toggleOutput}
          title="Toggle output panel"
        >
          Output{logCount > 0 ? ` (${logCount})` : ""}
        </button>
        {projectPath && <span className={styles.pathText}>{projectPath}</span>}
      </div>
    </footer>
  );
}
