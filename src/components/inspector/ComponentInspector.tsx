import type { PropDefinition } from "@/types/components";
import type { ComponentInstance } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { getComponentDefinition } from "@utils/componentRegistry";
import styles from "./ComponentInspector.module.css";
import {
  ColorPickerControl,
  DropdownControl,
  ImagePickerControl,
  NumberControl,
  TextAreaControl,
  TextControl,
  ToggleControl,
  UrlControl,
} from "./controls/Controls";

function findComponent(
  components: ComponentInstance[],
  id: string,
): ComponentInstance | undefined {
  for (const c of components) {
    if (c.id === id) return c;
    if (c.children) {
      const found = findComponent(c.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function PropControl({
  prop,
  value,
  onChange,
}: {
  prop: PropDefinition;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const kind = prop.type.kind;

  switch (kind) {
    case "string":
      return (
        <TextControl
          label={prop.displayName}
          value={(value as string) ?? ""}
          onChange={onChange}
        />
      );
    case "text":
    case "markdown":
      return (
        <TextAreaControl
          label={prop.displayName}
          value={(value as string) ?? ""}
          onChange={onChange}
        />
      );
    case "number": {
      const numType = prop.type as {
        kind: "number";
        min?: number;
        max?: number;
        step?: number;
      };
      return (
        <NumberControl
          label={prop.displayName}
          value={(value as number) ?? 0}
          onChange={onChange}
          min={numType.min}
          max={numType.max}
          step={numType.step}
        />
      );
    }
    case "boolean":
      return (
        <ToggleControl
          label={prop.displayName}
          value={(value as boolean) ?? false}
          onChange={onChange}
        />
      );
    case "select": {
      const selectType = prop.type as {
        kind: "select";
        options: { label: string; value: string }[];
      };
      return (
        <DropdownControl
          label={prop.displayName}
          value={(value as string) ?? ""}
          onChange={onChange}
          options={selectType.options}
        />
      );
    }
    case "color":
      return (
        <ColorPickerControl
          label={prop.displayName}
          value={(value as string) ?? "#000000"}
          onChange={onChange}
        />
      );
    case "image":
      return (
        <ImagePickerControl
          label={prop.displayName}
          value={(value as string) ?? ""}
          onChange={onChange}
        />
      );
    case "url":
      return (
        <UrlControl
          label={prop.displayName}
          value={(value as string) ?? ""}
          onChange={onChange}
        />
      );
    case "array":
      // Array editor is complex — render as JSON for now
      return (
        <TextAreaControl
          label={prop.displayName}
          value={JSON.stringify(value ?? [], null, 2)}
          onChange={(v) => {
            try {
              onChange(JSON.parse(v));
            } catch {
              // Invalid JSON — ignore until valid
            }
          }}
        />
      );
    default:
      return (
        <TextControl
          label={prop.displayName}
          value={String(value ?? "")}
          onChange={onChange}
        />
      );
  }
}

export function ComponentInspector() {
  const selectedComponentId = useUIStore((s) => s.selectedComponentId);
  const selectedPageId = useUIStore((s) => s.selectedPageId);
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const updateComponentProp = useProjectStore((s) => s.updateComponentProp);

  if (!selectedComponentId) {
    return (
      <p className={styles.noSelection}>
        Select a component to edit its properties.
      </p>
    );
  }

  const page = pages.find((p) => p.id === selectedPageId) ?? pages[0];
  if (!page) return null;

  const comp = findComponent(page.components, selectedComponentId);
  if (!comp) {
    return <p className={styles.noSelection}>Component not found.</p>;
  }

  const def = getComponentDefinition(comp.type);
  if (!def) {
    return (
      <p className={styles.noSelection}>Unknown component type: {comp.type}</p>
    );
  }

  // Group props by their group field
  const grouped = new Map<string, PropDefinition[]>();
  for (const p of def.props) {
    const group = p.group ?? "Properties";
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(p);
  }

  return (
    <div className={styles.inspector}>
      <div className={styles.componentInfo}>
        <p className={styles.componentType}>{def.displayName}</p>
        <p className={styles.componentDesc}>{def.description}</p>
      </div>

      {Array.from(grouped.entries()).map(([groupName, props]) => (
        <div key={groupName} className={styles.propGroup}>
          {grouped.size > 1 && (
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {groupName}
            </span>
          )}
          {props.map((prop) => (
            <PropControl
              key={prop.name}
              prop={prop}
              value={comp.props[prop.name]}
              onChange={(v) =>
                updateComponentProp(page.id, comp.id, prop.name, v)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
