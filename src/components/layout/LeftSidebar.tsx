import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faBars,
  faBlog,
  faFile,
  faGear,
  faGripLines,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore, type InspectorTab } from "@stores/uiStore";
import styles from "./LeftSidebar.module.css";

const INSPECTOR_TABS: {
  id: InspectorTab;
  label: string;
  icon: IconDefinition;
}[] = [
  { id: "page", label: "Page", icon: faFile },
  { id: "theme", label: "Theme", icon: faPalette },
  { id: "nav", label: "Nav", icon: faBars },
  { id: "footer", label: "Footer", icon: faGripLines },
  { id: "blog", label: "Blog", icon: faBlog },
  { id: "settings", label: "Settings", icon: faGear },
];

export function LeftSidebar() {
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const addPage = useProjectStore((s) => s.addPage);
  const selectedPageId = useUIStore((s) => s.selectedPageId);
  const selectPage = useUIStore((s) => s.selectPage);
  const activeInspectorTab = useUIStore((s) => s.activeInspectorTab);
  const setInspectorTab = useUIStore((s) => s.setInspectorTab);

  function handleAddPage() {
    const count = pages.length + 1;
    addPage({
      id: `page_${Date.now().toString(36)}`,
      name: `Page ${count}`,
      path: `/page-${count}`,
      title: "",
      metaDescription: "",
      isHomePage: false,
      components: [],
    });
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.tabs}>
        {INSPECTOR_TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeInspectorTab === t.id ? styles.activeTab : ""}`}
            onClick={() => setInspectorTab(t.id)}
          >
            <FontAwesomeIcon icon={t.icon} fixedWidth />
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Pages</span>
        <button
          className={styles.addButton}
          onClick={handleAddPage}
          title="Add page"
        >
          +
        </button>
      </div>

      <div className={styles.pageList}>
        {pages.map((p) => (
          <div
            key={p.id}
            className={`${styles.pageItem} ${selectedPageId === p.id ? styles.selected : ""}`}
            onClick={() => selectPage(p.id)}
          >
            <span className={styles.pageIcon}>📄</span>
            <span className={styles.pageName}>{p.name}</span>
            {p.isHomePage ? (
              <span className={styles.homeBadge}>Home</span>
            ) : (
              <span className={styles.pagePath}>{p.path}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
