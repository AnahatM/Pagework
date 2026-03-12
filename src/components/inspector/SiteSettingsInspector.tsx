import { useProjectStore } from "@stores/projectStore";
import {
  ImagePickerControl,
  TextAreaControl,
  TextControl,
} from "./controls/Controls";
import styles from "./SiteSettingsInspector.module.css";

export function SiteSettingsInspector() {
  const settings = useProjectStore((s) => s.manifest?.siteSettings);
  const updateSiteSettings = useProjectStore((s) => s.updateSiteSettings);

  if (!settings) return null;

  return (
    <div className={styles.inspector}>
      <TextControl
        label="Site Title"
        value={settings.siteTitle}
        onChange={(v) => updateSiteSettings({ siteTitle: v })}
      />
      <TextControl
        label="Author Name"
        value={settings.authorName}
        onChange={(v) => updateSiteSettings({ authorName: v })}
      />
      <TextAreaControl
        label="Site Description"
        value={settings.siteDescription}
        onChange={(v) => updateSiteSettings({ siteDescription: v })}
      />
      <TextControl
        label="Copyright Text"
        value={settings.copyrightText}
        onChange={(v) => updateSiteSettings({ copyrightText: v })}
      />
      <ImagePickerControl
        label="Favicon"
        value={settings.faviconPath}
        onChange={(v) => updateSiteSettings({ faviconPath: v })}
      />
    </div>
  );
}
