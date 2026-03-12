import type { ComponentInstance } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { getComponentDefinition } from "@utils/componentRegistry";
import { useState } from "react";
import styles from "./ComponentBlock.module.css";

interface ComponentBlockProps {
  component: ComponentInstance;
  pageId: string;
  onAddChild?: (parentId: string) => void;
}

function getLabel(comp: ComponentInstance): string {
  return (
    (comp.props.title as string) ||
    (comp.props.titleText as string) ||
    (comp.props.text as string)?.slice(0, 50) ||
    (comp.props.linktext as string) ||
    (comp.props.displayNumber as string) ||
    ""
  );
}

export function ComponentBlock({
  component,
  pageId,
  onAddChild,
}: ComponentBlockProps) {
  const selectedComponentId = useUIStore((s) => s.selectedComponentId);
  const selectComponent = useUIStore((s) => s.selectComponent);
  const removeComponent = useProjectStore((s) => s.removeComponent);
  const moveComponent = useProjectStore((s) => s.moveComponent);
  const duplicateComponent = useProjectStore((s) => s.duplicateComponent);

  const [collapsed, setCollapsed] = useState(false);

  const def = getComponentDefinition(component.type);
  const isSelected = selectedComponentId === component.id;
  const hasChildren = component.children && component.children.length > 0;
  const acceptsChildren = def?.acceptsChildren ?? false;
  const label = getLabel(component);

  return (
    <div className={`${styles.block} ${isSelected ? styles.selected : ""}`}>
      <div
        className={styles.header}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
        }}
      >
        {(hasChildren || acceptsChildren) && (
          <button
            className={`${styles.collapseToggle} ${!collapsed ? styles.expanded : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
          >
            ▶
          </button>
        )}

        <span className={styles.typeBadge}>
          {def?.displayName ?? component.type}
        </span>

        {label && <span className={styles.label}>{label}</span>}

        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            title="Move up"
            onClick={(e) => {
              e.stopPropagation();
              moveComponent(pageId, component.id, "up");
            }}
          >
            ↑
          </button>
          <button
            className={styles.actionBtn}
            title="Move down"
            onClick={(e) => {
              e.stopPropagation();
              moveComponent(pageId, component.id, "down");
            }}
          >
            ↓
          </button>
          <button
            className={styles.actionBtn}
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              duplicateComponent(pageId, component.id);
            }}
          >
            ⧉
          </button>
          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              removeComponent(pageId, component.id);
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {!collapsed && (hasChildren || acceptsChildren) && (
        <div className={styles.children}>
          {component.children?.map((child) => (
            <ComponentBlock
              key={child.id}
              component={child}
              pageId={pageId}
              onAddChild={onAddChild}
            />
          ))}
          {acceptsChildren && onAddChild && (
            <button
              className={styles.addChild}
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(component.id);
              }}
            >
              + Add Component
            </button>
          )}
        </div>
      )}
    </div>
  );
}
