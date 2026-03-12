import { Button } from "@components/shared/Button";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { TextControl } from "./controls/Controls";
import styles from "./PageInspector.module.css";

export function PageInspector() {
  const pages = useProjectStore((s) => s.manifest?.pages ?? []);
  const selectedPageId = useUIStore((s) => s.selectedPageId);
  const updatePage = useProjectStore((s) => s.updatePage);
  const removePage = useProjectStore((s) => s.removePage);

  const page = pages.find((p) => p.id === selectedPageId);
  if (!page)
    return (
      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
        Select a page.
      </p>
    );

  return (
    <div className={styles.inspector}>
      <TextControl
        label="Page Name"
        value={page.name}
        onChange={(v) => updatePage(page.id, { name: v })}
      />
      <TextControl
        label="URL Path"
        value={page.path}
        onChange={(v) => updatePage(page.id, { path: v })}
      />
      <TextControl
        label="Page Title (SEO)"
        value={page.title}
        onChange={(v) => updatePage(page.id, { title: v })}
      />
      <TextControl
        label="Meta Description"
        value={page.metaDescription}
        onChange={(v) => updatePage(page.id, { metaDescription: v })}
      />

      {!page.isHomePage && (
        <div className={styles.dangerZone}>
          <p className={styles.dangerLabel}>Danger Zone</p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              removePage(page.id);
            }}
          >
            Delete Page
          </Button>
        </div>
      )}
    </div>
  );
}
