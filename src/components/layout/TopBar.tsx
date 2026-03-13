import { Button } from "@components/shared/Button";
import { useDevServerStore } from "@stores/devServerStore";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { regenerateAll } from "@tauri/codegenCommands";
import { startDevServer, stopDevServer } from "@tauri/devServerCommands";
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

  const openModal = useUIStore((s) => s.openModal);

  const serverStatus = useDevServerStore((s) => s.status);
  const serverPort = useDevServerStore((s) => s.port);
  const setRunning = useDevServerStore((s) => s.setRunning);
  const setStarting = useDevServerStore((s) => s.setStarting);
  const setStopped = useDevServerStore((s) => s.setStopped);
  const setError = useDevServerStore((s) => s.setError);

  async function handleSave() {
    if (!manifest || !projectPath) return;
    await saveManifest(projectPath, manifest);
    await regenerateAll(projectPath, manifest);
    markClean();
  }

  async function handlePreview() {
    if (!manifest || !projectPath) return;

    if (serverStatus === "running" && serverPort) {
      window.open(`http://localhost:${serverPort}`, "_blank");
      return;
    }

    try {
      // Save + regenerate first
      if (isDirty) {
        await handleSave();
      }
      setStarting();
      await startDevServer(projectPath);
      // Server started — port will be updated via status polling
      // For now, assume default Vite port
      setRunning(5173);
      window.open("http://localhost:5173", "_blank");
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleStopServer() {
    try {
      await stopDevServer();
      setStopped();
    } catch (err) {
      setError(String(err));
    }
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
        {serverStatus === "running" ? (
          <>
            <Button size="sm" variant="primary" onClick={handlePreview}>
              Open Preview
            </Button>
            <Button size="sm" variant="ghost" onClick={handleStopServer}>
              Stop
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={handlePreview}
            disabled={
              serverStatus === "starting" || serverStatus === "installing"
            }
          >
            {serverStatus === "starting"
              ? "Starting…"
              : serverStatus === "installing"
                ? "Installing…"
                : "Preview"}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => openModal("publish")}>
          Publish
        </Button>
        <Button size="sm" variant="ghost" onClick={closeProject}>
          Close
        </Button>
      </div>
    </header>
  );
}
