import type { ComponentCategory } from "@/types/components";
import type { ComponentInstance } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import {
  CATEGORY_LABELS,
  getComponentDefinition,
  getComponentsByCategory,
} from "@utils/componentRegistry";
import { useEffect, useState } from "react";
import styles from "./ComponentPalette.module.css";

interface ComponentPaletteProps {
  pageId: string;
  parentId: string | null;
  onClose: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ComponentCategory[];

export function ComponentPalette({
  pageId,
  parentId,
  onClose,
}: ComponentPaletteProps) {
  const addComponent = useProjectStore((s) => s.addComponent);
  const [activeCategory, setActiveCategory] =
    useState<ComponentCategory>("sections");
  const grouped = getComponentsByCategory();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleAdd(type: string) {
    const def = getComponentDefinition(type);
    if (!def) return;

    const props: Record<string, unknown> = {};
    for (const p of def.props) {
      if (p.defaultValue !== undefined) {
        props[p.name] = p.defaultValue;
      }
    }

    const comp: ComponentInstance = {
      id: `comp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      props,
      children: [],
    };

    addComponent(pageId, parentId, comp);
    onClose();
  }

  const components = grouped[activeCategory] ?? [];

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.palette} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Add Component</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${activeCategory === cat ? styles.activeTab : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {components.map((def) => (
            <div
              key={def.type}
              className={styles.card}
              onClick={() => handleAdd(def.type)}
            >
              <span className={styles.cardName}>{def.displayName}</span>
              <span className={styles.cardDesc}>{def.description}</span>
              {def.acceptsChildren && (
                <span className={styles.cardMeta}>Accepts children</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
