import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { useCallback, useState } from "react";
import { ComponentBlock } from "./ComponentBlock";
import { ComponentPalette } from "./ComponentPalette";
import styles from "./PageStructureView.module.css";

export function PageStructureView() {
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const selectedPageId = useUIStore((s) => s.selectedPageId);

  const [paletteTarget, setPaletteTarget] = useState<{
    pageId: string;
    parentId: string | null;
  } | null>(null);

  const activePage = pages.find((p) => p.id === selectedPageId) ?? pages[0];

  const handleAddChild = useCallback(
    (parentId: string) => {
      if (activePage) {
        setPaletteTarget({ pageId: activePage.id, parentId });
      }
    },
    [activePage],
  );

  if (!activePage) {
    return (
      <div className={styles.view}>
        <p
          style={{
            padding: "var(--space-md)",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          No pages yet. Add a page from the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.view}>
      <div className={styles.pageHeader}>
        <span className={styles.pageName}>{activePage.name}</span>
        <span className={styles.pagePath}>{activePage.path}</span>
      </div>

      <div className={styles.componentList}>
        {activePage.components.map((comp) => (
          <ComponentBlock
            key={comp.id}
            component={comp}
            pageId={activePage.id}
            onAddChild={handleAddChild}
          />
        ))}
      </div>

      <button
        className={styles.addRootBtn}
        onClick={() =>
          setPaletteTarget({ pageId: activePage.id, parentId: null })
        }
      >
        + Add Component
      </button>

      {paletteTarget && (
        <ComponentPalette
          pageId={paletteTarget.pageId}
          parentId={paletteTarget.parentId}
          onClose={() => setPaletteTarget(null)}
        />
      )}
    </div>
  );
}
