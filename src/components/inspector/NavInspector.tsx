import type { NavItem } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import {
  ImagePickerControl,
  PathControl,
  TextControl,
} from "./controls/Controls";
import styles from "./NavInspector.module.css";

function generateId() {
  return crypto.randomUUID().slice(0, 8);
}

export function NavInspector() {
  const nav = useProjectStore((s) => s.manifest?.navigation);
  const updateNavItems = useProjectStore((s) => s.updateNavItems);
  const updateNavLogo = useProjectStore((s) => s.updateNavLogo);

  if (!nav) return null;

  function setItem(index: number, patch: Partial<NavItem>) {
    const items = [...nav!.navItems];
    items[index] = { ...items[index], ...patch };
    updateNavItems(items);
  }

  function removeItem(index: number) {
    const items = nav!.navItems.filter((_, i) => i !== index);
    updateNavItems(items);
  }

  function addItem() {
    const items = [
      ...nav!.navItems,
      {
        id: generateId(),
        linkName: "New Link",
        path: "/",
        linkIcon: "",
        subPages: [],
      },
    ];
    updateNavItems(items);
  }

  function addSubPage(parentIdx: number) {
    const items = [...nav!.navItems];
    const parent = { ...items[parentIdx] };
    parent.subPages = [
      ...parent.subPages,
      {
        id: generateId(),
        linkName: "Sub Page",
        path: "/",
        linkIcon: "",
        subPages: [],
      },
    ];
    items[parentIdx] = parent;
    updateNavItems(items);
  }

  function removeSubPage(parentIdx: number, subIdx: number) {
    const items = [...nav!.navItems];
    const parent = { ...items[parentIdx] };
    parent.subPages = parent.subPages.filter((_, i) => i !== subIdx);
    items[parentIdx] = parent;
    updateNavItems(items);
  }

  function setSubPage(
    parentIdx: number,
    subIdx: number,
    patch: Partial<NavItem>,
  ) {
    const items = [...nav!.navItems];
    const parent = { ...items[parentIdx] };
    parent.subPages = [...parent.subPages];
    parent.subPages[subIdx] = { ...parent.subPages[subIdx], ...patch };
    items[parentIdx] = parent;
    updateNavItems(items);
  }

  return (
    <div className={styles.inspector}>
      <ImagePickerControl
        label="Logo"
        value={nav.logoPath}
        onChange={updateNavLogo}
        category="icons"
      />

      <div className={styles.sectionLabel}>Navigation Items</div>
      <div className={styles.itemList}>
        {nav.navItems.length === 0 ? (
          <div className={styles.emptyHint}>
            No navigation items yet. Add one to get started.
          </div>
        ) : (
          nav.navItems.map((item, idx) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemLabel}>#{idx + 1}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(idx)}
                >
                  ×
                </button>
              </div>
              <TextControl
                label="Label"
                value={item.linkName}
                onChange={(v) => setItem(idx, { linkName: v })}
              />
              <PathControl
                label="Path"
                value={item.path}
                onChange={(v) => setItem(idx, { path: v })}
              />
              <TextControl
                label="Icon"
                value={item.linkIcon}
                onChange={(v) => setItem(idx, { linkIcon: v })}
              />

              {item.subPages.length > 0 && (
                <div className={styles.subList}>
                  {item.subPages.map((sub, si) => (
                    <div key={sub.id} className={styles.item}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemLabel}>Sub #{si + 1}</span>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeSubPage(idx, si)}
                        >
                          ×
                        </button>
                      </div>
                      <TextControl
                        label="Label"
                        value={sub.linkName}
                        onChange={(v) => setSubPage(idx, si, { linkName: v })}
                      />
                      <PathControl
                        label="Path"
                        value={sub.path}
                        onChange={(v) => setSubPage(idx, si, { path: v })}
                      />
                    </div>
                  ))}
                </div>
              )}
              <button
                className={styles.addSubBtn}
                onClick={() => addSubPage(idx)}
              >
                + Sub Page
              </button>
            </div>
          ))
        )}
      </div>
      <button className={styles.addBtn} onClick={addItem}>
        + Add Nav Item
      </button>
    </div>
  );
}
