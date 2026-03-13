/* ═══════════════════════════════════════════
   App Shell
   Main layout when a project is open
   ═══════════════════════════════════════════ */

import { useAutoSave } from "@hooks/useAutoSave";
import { useResizableHeight } from "@hooks/useResizableHeight";
import { useResizablePanel } from "@hooks/useResizablePanel";
import { useOutputLogStore } from "@stores/outputLogStore";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import styles from "./AppShell.module.css";
import { CenterPanel } from "./CenterPanel";
import { LeftSidebar } from "./LeftSidebar";
import { OutputPanel } from "./OutputPanel";
import { RightSidebar } from "./RightSidebar";
import { StatusBar } from "./StatusBar";
import { TopBar } from "./TopBar";

export function AppShell() {
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const selectedPageId = useUIStore((s) => s.selectedPageId);
  const selectPage = useUIStore((s) => s.selectPage);
  const { saveIndicator } = useAutoSave();
  const outputOpen = useOutputLogStore((s) => s.isOpen);
  const addLogEntry = useOutputLogStore((s) => s.addEntry);

  // Listen for devserver-log events from Rust backend
  useEffect(() => {
    const unlisten = listen<{ message: string; level: string }>(
      "devserver-log",
      (event) => {
        addLogEntry(
          event.payload.message,
          event.payload.level as "info" | "warn" | "error",
        );
      },
    );
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [addLogEntry]);

  const leftPanel = useResizablePanel({
    initialWidth: 240,
    minWidth: 160,
    maxWidth: 400,
    side: "left",
  });

  const rightPanel = useResizablePanel({
    initialWidth: 300,
    minWidth: 200,
    maxWidth: 480,
    side: "right",
  });

  const outputPanel = useResizableHeight({
    initialHeight: 180,
    minHeight: 80,
    maxHeight: 500,
  });

  // Auto-select first page if none selected
  useEffect(() => {
    if (!selectedPageId && pages.length > 0) {
      selectPage(pages[0].id);
    }
  }, [selectedPageId, pages, selectPage]);

  return (
    <div className={styles.shell}>
      <TopBar />
      <div className={styles.body}>
        <div style={{ width: leftPanel.width, flexShrink: 0 }}>
          <LeftSidebar />
        </div>
        <div
          className={styles.resizeHandle}
          onMouseDown={leftPanel.onMouseDown}
        />
        <CenterPanel />
        <div
          className={styles.resizeHandle}
          onMouseDown={rightPanel.onMouseDown}
        />
        <div style={{ width: rightPanel.width, flexShrink: 0 }}>
          <RightSidebar />
        </div>
      </div>
      {outputOpen && (
        <>
          <div
            className={styles.hResizeHandle}
            onMouseDown={outputPanel.onMouseDown}
          />
          <OutputPanel height={outputPanel.height} />
        </>
      )}
      <StatusBar />
      {saveIndicator && <div className={styles.saveToast}>Saved</div>}
    </div>
  );
}
