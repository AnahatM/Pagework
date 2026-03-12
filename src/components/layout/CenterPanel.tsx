import type { ComponentInstance } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import styles from "./CenterPanel.module.css";

function ComponentNode({ component }: { component: ComponentInstance }) {
  const selectedComponentId = useUIStore((s) => s.selectedComponentId);
  const selectComponent = useUIStore((s) => s.selectComponent);

  const isSelected = selectedComponentId === component.id;

  // Build a label from props (title, text, linktext, etc.)
  const label =
    (component.props.title as string) ||
    (component.props.titleText as string) ||
    (component.props.text as string)?.slice(0, 40) ||
    (component.props.linktext as string) ||
    "";

  return (
    <div>
      <div
        className={`${styles.treeNode} ${isSelected ? styles.selected : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
        }}
      >
        <span className={styles.nodeType}>{component.type}</span>
        {label && <span className={styles.nodeLabel}>{label}</span>}
      </div>
      {component.children && component.children.length > 0 && (
        <div className={styles.children}>
          {component.children.map((child) => (
            <ComponentNode key={child.id} component={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function StructureView() {
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const selectedPageId = useUIStore((s) => s.selectedPageId);

  const activePage = pages.find((p) => p.id === selectedPageId) ?? pages[0];

  if (!activePage) {
    return <div className={styles.emptyState}>No pages yet</div>;
  }

  if (activePage.components.length === 0) {
    return (
      <div className={styles.emptyState}>
        No components on this page. Add one from the component palette.
      </div>
    );
  }

  return (
    <div className={styles.tree}>
      {activePage.components.map((comp) => (
        <ComponentNode key={comp.id} component={comp} />
      ))}
    </div>
  );
}

function CodePreview() {
  return <div className={styles.emptyState}>Code preview coming soon</div>;
}

export function CenterPanel() {
  const activeCenterPanel = useUIStore((s) => s.activeCenterPanel);

  return (
    <main className={styles.panel}>
      {activeCenterPanel === "structure" ? <StructureView /> : <CodePreview />}
    </main>
  );
}
