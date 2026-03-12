import { PageStructureView } from "@components/panels/PageStructureView";
import { useUIStore } from "@stores/uiStore";
import styles from "./CenterPanel.module.css";

function CodePreview() {
  return <div className={styles.emptyState}>Code preview coming soon</div>;
}

export function CenterPanel() {
  const activeCenterPanel = useUIStore((s) => s.activeCenterPanel);

  return (
    <main className={styles.panel}>
      {activeCenterPanel === "structure" ? (
        <PageStructureView />
      ) : (
        <CodePreview />
      )}
    </main>
  );
}
