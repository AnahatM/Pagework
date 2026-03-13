/* ═══════════════════════════════════════════
   App Shell
   Main layout when a project is open
   ═══════════════════════════════════════════ */

import { useAutoSave } from "@hooks/useAutoSave";
import { useResizablePanel } from "@hooks/useResizablePanel";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { useEffect } from "react";
import styles from "./AppShell.module.css";
import { CenterPanel } from "./CenterPanel";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { StatusBar } from "./StatusBar";
import { TopBar } from "./TopBar";

export function AppShell() {
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const selectedPageId = useUIStore((s) => s.selectedPageId);
  const selectPage = useUIStore((s) => s.selectPage);
  const { saveIndicator } = useAutoSave();

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
      <StatusBar />
      {saveIndicator && <div className={styles.saveToast}>Saved</div>}
    </div>
  );
}
