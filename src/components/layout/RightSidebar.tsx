import { useUIStore } from "@stores/uiStore";
import styles from "./RightSidebar.module.css";

const TAB_LABELS: Record<string, string> = {
  component: "Component Inspector",
  page: "Page Settings",
  theme: "Theme Editor",
  nav: "Navigation",
  footer: "Footer",
  settings: "Site Settings",
};

export function RightSidebar() {
  const activeTab = useUIStore((s) => s.activeInspectorTab);
  const selectedComponentId = useUIStore((s) => s.selectedComponentId);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>{TAB_LABELS[activeTab]}</div>
      <div className={styles.body}>
        {activeTab === "component" && !selectedComponentId ? (
          <p className={styles.placeholder}>
            Select a component from the structure view to inspect its
            properties.
          </p>
        ) : (
          <p className={styles.placeholder}>
            Inspector panels coming in Phase 4.
          </p>
        )}
      </div>
    </aside>
  );
}
