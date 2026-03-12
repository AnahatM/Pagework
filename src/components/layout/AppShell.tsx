/* ═══════════════════════════════════════════
   App Shell
   Main layout when a project is open
   ═══════════════════════════════════════════ */

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
        <LeftSidebar />
        <CenterPanel />
        <RightSidebar />
      </div>
      <StatusBar />
    </div>
  );
}
