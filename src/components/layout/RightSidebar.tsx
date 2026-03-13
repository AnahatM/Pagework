import { BlogInspector } from "@components/inspector/BlogInspector";
import { ComponentInspector } from "@components/inspector/ComponentInspector";
import { FooterInspector } from "@components/inspector/FooterInspector";
import { NavInspector } from "@components/inspector/NavInspector";
import { PageInspector } from "@components/inspector/PageInspector";
import { SiteSettingsInspector } from "@components/inspector/SiteSettingsInspector";
import { ThemeInspector } from "@components/inspector/ThemeInspector";
import { useUIStore } from "@stores/uiStore";
import styles from "./RightSidebar.module.css";

const TAB_LABELS: Record<string, string> = {
  component: "Component Inspector",
  page: "Page Settings",
  theme: "Theme Editor",
  nav: "Navigation",
  footer: "Footer",
  settings: "Site Settings",
  blog: "Blog Posts",
};

export function RightSidebar() {
  const activeTab = useUIStore((s) => s.activeInspectorTab);
  const selectedComponentId = useUIStore((s) => s.selectedComponentId);

  function renderInspector() {
    switch (activeTab) {
      case "component":
        return selectedComponentId ? (
          <ComponentInspector />
        ) : (
          <p className={styles.placeholder}>
            Select a component from the structure view to inspect its
            properties.
          </p>
        );
      case "page":
        return <PageInspector />;
      case "theme":
        return <ThemeInspector />;
      case "nav":
        return <NavInspector />;
      case "footer":
        return <FooterInspector />;
      case "settings":
        return <SiteSettingsInspector />;
      case "blog":
        return <BlogInspector />;
      default:
        return null;
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>{TAB_LABELS[activeTab]}</div>
      <div className={styles.body}>{renderInspector()}</div>
    </aside>
  );
}
