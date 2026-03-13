import { Button } from "@components/shared/Button";
import { useDevServerStore } from "@stores/devServerStore";
import { useOutputLogStore } from "@stores/outputLogStore";
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
  const serverError = useDevServerStore((s) => s.errorMessage);
  const setRunning = useDevServerStore((s) => s.setRunning);
  const setStarting = useDevServerStore((s) => s.setStarting);
  const setStopped = useDevServerStore((s) => s.setStopped);
  const setError = useDevServerStore((s) => s.setError);

  const addLog = useOutputLogStore((s) => s.addEntry);
  const openOutput = useOutputLogStore((s) => s.setOpen);

  async function handleSave() {
    if (!manifest || !projectPath) return;
    await saveManifest(projectPath, manifest);
    await regenerateAll(projectPath, manifest);
    markClean();
  }

  async function handlePreview() {
    if (!manifest || !projectPath) return;

    if (serverStatus === "running" && serverPort) {
      setCenterPanel("preview");
      return;
    }

    try {
      openOutput(true);
      addLog("Preparing preview…");

      // Save manifest if dirty
      if (isDirty) {
        addLog("Saving manifest…");
        await saveManifest(projectPath, manifest);
        markClean();
        addLog("✓ Manifest saved");
      }

      // Always regenerate project files
      addLog("Generating project files…");
      setStarting();
      await regenerateAll(projectPath, manifest);
      addLog("✓ Code generation complete");

      // Start dev server (Rust backend will emit its own log events)
      addLog("Starting dev server…");
      await startDevServer(projectPath);

      setRunning(5173);
      addLog("✓ Dev server ready — opening preview");
      setCenterPanel("preview");
    } catch (err) {
      addLog(String(err), "error");
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
      {serverStatus === "error" && serverError && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠</span>
          <span className={styles.errorMsg}>{serverError}</span>
          <button
            className={styles.errorDismiss}
            onClick={setStopped}
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
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
        <button
          className={`${styles.iconButton} ${activeCenterPanel === "preview" ? styles.active : ""}`}
          onClick={() => setCenterPanel("preview")}
          title="Live preview"
        >
          ▶
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
