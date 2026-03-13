import { CodeEditorView } from "@components/panels/CodeEditorView";
import { PageStructureView } from "@components/panels/PageStructureView";
import { PreviewPanel } from "@components/panels/PreviewPanel";
import { useUIStore } from "@stores/uiStore";
import styles from "./CenterPanel.module.css";

export function CenterPanel() {
  const activeCenterPanel = useUIStore((s) => s.activeCenterPanel);

  return (
    <main className={styles.panel}>
      {activeCenterPanel === "structure" ? (
        <PageStructureView />
      ) : activeCenterPanel === "preview" ? (
        <PreviewPanel />
      ) : (
        <CodeEditorView />
      )}
    </main>
  );
}
