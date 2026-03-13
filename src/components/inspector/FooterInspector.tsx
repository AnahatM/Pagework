import type { FooterColumn, FooterLink, SocialLink } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import {
  ImagePickerControl,
  TextControl,
  ToggleControl,
  UrlControl,
} from "./controls/Controls";
import styles from "./FooterInspector.module.css";

function generateId() {
  return crypto.randomUUID().slice(0, 8);
}

export function FooterInspector() {
  const footer = useProjectStore((s) => s.manifest?.footer);
  const updateFooterColumns = useProjectStore((s) => s.updateFooterColumns);
  const updateSocialLinks = useProjectStore((s) => s.updateSocialLinks);

  if (!footer) return null;

  /* ── Column helpers ──────────────────── */
  function setColumn(idx: number, patch: Partial<FooterColumn>) {
    const cols = [...footer!.columns];
    cols[idx] = { ...cols[idx], ...patch };
    updateFooterColumns(cols);
  }

  function removeColumn(idx: number) {
    updateFooterColumns(footer!.columns.filter((_, i) => i !== idx));
  }

  function addColumn() {
    updateFooterColumns([
      ...footer!.columns,
      { id: generateId(), header: "New Column", links: [] },
    ]);
  }

  function setLink(
    colIdx: number,
    linkIdx: number,
    patch: Partial<FooterLink>,
  ) {
    const cols = [...footer!.columns];
    const col = { ...cols[colIdx], links: [...cols[colIdx].links] };
    col.links[linkIdx] = { ...col.links[linkIdx], ...patch };
    cols[colIdx] = col;
    updateFooterColumns(cols);
  }

  function removeLink(colIdx: number, linkIdx: number) {
    const cols = [...footer!.columns];
    const col = {
      ...cols[colIdx],
      links: cols[colIdx].links.filter((_, i) => i !== linkIdx),
    };
    cols[colIdx] = col;
    updateFooterColumns(cols);
  }

  function addLink(colIdx: number) {
    const cols = [...footer!.columns];
    const col = {
      ...cols[colIdx],
      links: [
        ...cols[colIdx].links,
        {
          id: generateId(),
          label: "Link",
          url: "/",
          openInNewTab: false,
          tooltip: "",
        },
      ],
    };
    cols[colIdx] = col;
    updateFooterColumns(cols);
  }

  /* ── Social helpers ──────────────────── */
  function setSocial(idx: number, patch: Partial<SocialLink>) {
    const links = [...footer!.socialLinks];
    links[idx] = { ...links[idx], ...patch };
    updateSocialLinks(links);
  }

  function removeSocial(idx: number) {
    updateSocialLinks(footer!.socialLinks.filter((_, i) => i !== idx));
  }

  function addSocial() {
    updateSocialLinks([
      ...footer!.socialLinks,
      { id: generateId(), platform: "website", url: "", iconPath: "" },
    ]);
  }

  return (
    <div className={styles.inspector}>
      {/* ── Columns ──────────────────── */}
      <div className={styles.sectionLabel}>Footer Columns</div>
      <div className={styles.columnList}>
        {footer.columns.length === 0 ? (
          <div className={styles.emptyHint}>No footer columns yet.</div>
        ) : (
          footer.columns.map((col, ci) => (
            <div key={col.id} className={styles.column}>
              <div className={styles.itemHeader}>
                <span className={styles.itemLabel}>Column {ci + 1}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeColumn(ci)}
                >
                  ×
                </button>
              </div>
              <TextControl
                label="Header"
                value={col.header}
                onChange={(v) => setColumn(ci, { header: v })}
              />

              <div className={styles.linkList}>
                {col.links.map((link, li) => (
                  <div key={link.id} className={styles.linkItem}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemLabel}>Link {li + 1}</span>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeLink(ci, li)}
                      >
                        ×
                      </button>
                    </div>
                    <TextControl
                      label="Label"
                      value={link.label}
                      onChange={(v) => setLink(ci, li, { label: v })}
                    />
                    <UrlControl
                      label="URL"
                      value={link.url}
                      onChange={(v) => setLink(ci, li, { url: v })}
                    />
                    <TextControl
                      label="Tooltip"
                      value={link.tooltip}
                      onChange={(v) => setLink(ci, li, { tooltip: v })}
                    />
                    <ToggleControl
                      label="Open in new tab"
                      value={link.openInNewTab}
                      onChange={(v) => setLink(ci, li, { openInNewTab: v })}
                    />
                  </div>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => addLink(ci)}>
                + Add Link
              </button>
            </div>
          ))
        )}
      </div>
      <button className={styles.addBtn} onClick={addColumn}>
        + Add Column
      </button>

      {/* ── Social Links ────────────── */}
      <div className={styles.sectionLabel}>Social Links</div>
      <div className={styles.socialList}>
        {footer.socialLinks.length === 0 ? (
          <div className={styles.emptyHint}>No social links yet.</div>
        ) : (
          footer.socialLinks.map((social, si) => (
            <div key={social.id} className={styles.socialItem}>
              <div className={styles.itemHeader}>
                <span className={styles.itemLabel}>
                  {social.platform || "Social"}
                </span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeSocial(si)}
                >
                  ×
                </button>
              </div>
              <TextControl
                label="Platform"
                value={social.platform}
                onChange={(v) => setSocial(si, { platform: v })}
              />
              <UrlControl
                label="URL"
                value={social.url}
                onChange={(v) => setSocial(si, { url: v })}
              />
              <ImagePickerControl
                label="Icon"
                value={social.iconPath}
                onChange={(v) => setSocial(si, { iconPath: v })}
                category="socials"
              />
            </div>
          ))
        )}
      </div>
      <button className={styles.addBtn} onClick={addSocial}>
        + Add Social Link
      </button>
    </div>
  );
}
