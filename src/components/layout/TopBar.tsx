import { Button } from "@components/shared/Button";
import {
  faCloudArrowUp,
  faCode,
  faEye,
  faFloppyDisk,
  faFolderOpen,
  faLayerGroup,
  faMinus,
  faPlay,
  faSquare,
  faStop,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDevServerStore } from "@stores/devServerStore";
import { useOutputLogStore } from "@stores/outputLogStore";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { regenerateAll } from "@tauri/codegenCommands";
import {
  getDevServerStatus,
  startDevServer,
  stopDevServer,
} from "@tauri/devServerCommands";
import { saveManifest } from "@tauri/projectCommands";
import { openInExplorer } from "@tauri/systemCommands";
import { useEffect } from "react";
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

  useEffect(() => {
    const title = projectPath
      ? `Pagework — ${manifest?.projectName ?? "Untitled"} (${projectPath})`
      : "Pagework";
    document.title = title;
    getCurrentWindow().setTitle(title);
    return () => {
      document.title = "Pagework";
      getCurrentWindow().setTitle("Pagework");
    };
  }, [projectPath, manifest?.projectName]);

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

      const status = await getDevServerStatus();
      setRunning(status.port ?? 5173);
      addLog(
        `✓ Dev server ready on port ${status.port ?? 5173} — opening preview`,
      );
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
        {projectPath && (
          <button
            className={styles.folderButton}
            onClick={() => openInExplorer(projectPath)}
            title="Open in file explorer"
          >
            <FontAwesomeIcon icon={faFolderOpen} />
          </button>
        )}
      </div>

      <div className={styles.center}>
        <button
          className={`${styles.tabButton} ${activeCenterPanel === "structure" ? styles.active : ""}`}
          onClick={() => setCenterPanel("structure")}
        >
          <FontAwesomeIcon icon={faLayerGroup} />
          <span>Structure</span>
        </button>
        <button
          className={`${styles.tabButton} ${activeCenterPanel === "code" ? styles.active : ""}`}
          onClick={() => setCenterPanel("code")}
        >
          <FontAwesomeIcon icon={faCode} />
          <span>Code</span>
        </button>
        <button
          className={`${styles.tabButton} ${activeCenterPanel === "preview" ? styles.active : ""}`}
          onClick={() => setCenterPanel("preview")}
        >
          <FontAwesomeIcon icon={faEye} />
          <span>Preview</span>
        </button>
      </div>

      <div className={styles.right}>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
          Save
        </Button>
        {serverStatus === "running" ? (
          <>
            <Button size="sm" variant="primary" onClick={handlePreview}>
              <FontAwesomeIcon icon={faPlay} />
              Open Preview
            </Button>
            <Button size="sm" variant="ghost" onClick={handleStopServer}>
              <FontAwesomeIcon icon={faStop} />
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
            <FontAwesomeIcon icon={faPlay} />
            {serverStatus === "starting"
              ? "Starting…"
              : serverStatus === "installing"
                ? "Installing…"
                : "Preview"}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => openModal("publish")}>
          <FontAwesomeIcon icon={faCloudArrowUp} />
          Publish
        </Button>
        <Button size="sm" variant="ghost" onClick={closeProject}>
          <FontAwesomeIcon icon={faXmark} />
          Close
        </Button>
      </div>

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
    </header>
  );
}
