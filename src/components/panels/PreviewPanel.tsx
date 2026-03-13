import { useDevServerStore } from "@stores/devServerStore";
import { useRef, useState } from "react";
import styles from "./PreviewPanel.module.css";

export function PreviewPanel() {
  const status = useDevServerStore((s) => s.status);
  const port = useDevServerStore((s) => s.port);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

  const url = port ? `http://localhost:${port}/` : null;

  function handleRefresh() {
    setKey((k) => k + 1);
  }

  function handleOpenExternal() {
    if (url) window.open(url, "_blank");
  }

  if (status !== "running" || !url) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>
          <span>No preview available</span>
          <span className={styles.emptyHint}>
            Click Preview to start the dev server
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <button
          className={styles.toolbarBtn}
          onClick={handleRefresh}
          title="Refresh"
        >
          ↻
        </button>
        <span className={styles.urlBar}>{url}</span>
        <button
          className={styles.toolbarBtn}
          onClick={handleOpenExternal}
          title="Open in browser"
        >
          ↗
        </button>
      </div>
      <iframe
        ref={iframeRef}
        key={key}
        className={styles.iframe}
        src={url}
        title="Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
