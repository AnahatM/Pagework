import { CodeEditorView } from "@components/panels/CodeEditorView";
import { PageStructureView } from "@components/panels/PageStructureView";
import { useUIStore } from "@stores/uiStore";
import styles from "./CenterPanel.module.css";

export function CenterPanel() {
  const activeCenterPanel = useUIStore((s) => s.activeCenterPanel);

  return (
    <main className={styles.panel}>
      {activeCenterPanel === "structure" ? (
        <PageStructureView />
      ) : (
        <CodeEditorView />
      )}
    </main>
  );
}
