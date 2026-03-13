import type { ThemeColorSet, ThemeGlobalColors } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import { useState } from "react";
import { ColorPickerControl, TextControl } from "./controls/Controls";
import styles from "./ThemeInspector.module.css";

type ThemeTab = "light" | "dark" | "global" | "fonts";

const COLOR_LABELS: Record<string, string> = {
  "page-background": "Page Background",
  "panel-background": "Panel Background",
  "panel-background-translucent": "Panel Translucent",
  "panel-shadow-light": "Shadow Light",
  "panel-shadow-dark": "Shadow Dark",
  outline: "Outline",
  primary: "Primary",
  "inverse-primary": "Inverse Primary",
  secondary: "Secondary",
  text: "Text",
  "text-selection": "Text Selection",
  "grid-background-lines": "Grid Lines",
  positive: "Positive",
  "positive-dark": "Positive Dark",
  "positive-light": "Positive Light",
  "positive-translucent": "Positive Translucent",
  warning: "Warning",
  "warning-dark": "Warning Dark",
  "warning-light": "Warning Light",
  "warning-translucent": "Warning Translucent",
  negative: "Negative",
  "negative-dark": "Negative Dark",
  "negative-light": "Negative Light",
  "negative-translucent": "Negative Translucent",
};

const DEFAULT_LIGHT: ThemeColorSet = {
  "page-background": "#e7e7f7",
  "panel-background": "#ababc4",
  "panel-background-translucent": "#ababc483",
  "panel-shadow-light": "#bdbdd3",
  "panel-shadow-dark": "#7c7c9c",
  outline: "#6c6c86",
  primary: "#1d1d27",
  "inverse-primary": "#e7e7f7",
  secondary: "#333342",
  text: "#050315",
  "text-selection": "#bdbdd3",
  "grid-background-lines": "#ababc4",
};

const DEFAULT_DARK: ThemeColorSet = {
  "page-background": "#050315",
  "panel-background": "#0a081c",
  "panel-background-translucent": "#12102565",
  "panel-shadow-light": "#14113a",
  "panel-shadow-dark": "#0c0a26",
  outline: "#1f1b42",
  primary: "#9a98c2",
  "inverse-primary": "#0a081c",
  secondary: "#6c6ca1",
  text: "#bdbdd3",
  "text-selection": "#3a3a52",
  "grid-background-lines": "#353355",
};

const DEFAULT_GLOBAL: ThemeGlobalColors = {
  positive: "#00b35c",
  "positive-dark": "#10814b",
  "positive-light": "#30e28c",
  "positive-translucent": "#00b35c24",
  warning: "#ffb300",
  "warning-dark": "#eea700",
  "warning-light": "#ffc643",
  "warning-translucent": "#ffb30024",
  negative: "#fb3250",
  "negative-dark": "#cc0523",
  "negative-light": "#ff7a8e",
  "negative-translucent": "#fb325024",
};

const DEFAULTS: Record<string, Record<string, string>> = {
  light: DEFAULT_LIGHT as unknown as Record<string, string>,
  dark: DEFAULT_DARK as unknown as Record<string, string>,
  global: DEFAULT_GLOBAL as unknown as Record<string, string>,
};

export function ThemeInspector() {
  const theme = useProjectStore((s) => s.manifest?.theme);
  const updateThemeColor = useProjectStore((s) => s.updateThemeColor);
  const updateGlobalColor = useProjectStore((s) => s.updateGlobalColor);
  const updateFont = useProjectStore((s) => s.updateFont);
  const [tab, setTab] = useState<ThemeTab>("dark");

  if (!theme) return null;

  const tabs: { id: ThemeTab; label: string }[] = [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
    { id: "global", label: "Global" },
    { id: "fonts", label: "Fonts" },
  ];

  function renderColors(
    colors: ThemeColorSet | ThemeGlobalColors,
    mode: "light" | "dark" | "global",
  ) {
    const defaults = DEFAULTS[mode];
    return (Object.entries(colors) as [string, string][]).map(
      ([key, value]) => {
        const defaultVal = defaults[key];
        const isModified = defaultVal && value !== defaultVal;
        return (
          <div key={key} className={styles.colorControl}>
            <ColorPickerControl
              label={COLOR_LABELS[key] ?? key}
              value={value}
              onChange={(v) =>
                mode === "global"
                  ? updateGlobalColor(key, v)
                  : updateThemeColor(mode, key, v)
              }
            />
            {isModified && (
              <button
                className={styles.resetBtn}
                title={`Reset to ${defaultVal}`}
                onClick={() =>
                  mode === "global"
                    ? updateGlobalColor(key, defaultVal)
                    : updateThemeColor(mode, key, defaultVal)
                }
              >
                ↺
              </button>
            )}
          </div>
        );
      },
    );
  }

  return (
    <div className={styles.inspector}>
      <div className={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.active : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dark" && renderColors(theme.dark, "dark")}
      {tab === "light" && renderColors(theme.light, "light")}
      {tab === "global" && renderColors(theme.global, "global")}
      {tab === "fonts" && (
        <>
          <TextControl
            label="Body Font"
            value={theme.fonts.normal}
            onChange={(v) => updateFont("normal", v)}
          />
          <TextControl
            label="Display Font"
            value={theme.fonts.display}
            onChange={(v) => updateFont("display", v)}
          />
        </>
      )}
    </div>
  );
}
