import { CodeEditorView } from "@components/panels/CodeEditorView";
import { PageStructureView } from "@components/panels/PageStructureView";
import { PreviewPanel } from "@components/panels/PreviewPanel";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import styles from "./CenterPanel.module.css";

export function CenterPanel() {
  const activeCenterPanel = useUIStore((s) => s.activeCenterPanel);
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const selectedPageId = useUIStore((s) => s.selectedPageId);
  const activePage = pages.find((p) => p.id === selectedPageId) ?? pages[0];

  return (
    <main className={styles.panel}>
      <div className={styles.content}>
        {activeCenterPanel === "structure" ? (
          <PageStructureView />
        ) : activeCenterPanel === "preview" ? (
          <PreviewPanel />
        ) : (
          <CodeEditorView />
        )}
      </div>
      {activePage && (
        <div className={styles.breadcrumbs}>
          <span className={styles.pageName}>{activePage.name}</span>
          <span className={styles.pagePath}>{activePage.path}</span>
        </div>
      )}
    </main>
  );
}
