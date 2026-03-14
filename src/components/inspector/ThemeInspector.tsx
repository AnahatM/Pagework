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
  "page-background": "#eaeaea",
  "panel-background": "#b0b0b0",
  "panel-background-translucent": "#b0b0b083",
  "panel-shadow-light": "#c0c0c0",
  "panel-shadow-dark": "#808080",
  outline: "#707070",
  primary: "#1a1a1a",
  "inverse-primary": "#eaeaea",
  secondary: "#363636",
  text: "#050505",
  "text-selection": "#c0c0c0",
};

const DEFAULT_DARK: ThemeColorSet = {
  "page-background": "#0a0a0a",
  "panel-background": "#141414",
  "panel-background-translucent": "#1a1a1a65",
  "panel-shadow-light": "#1e1e1e",
  "panel-shadow-dark": "#0e0e0e",
  outline: "#2a2a2a",
  primary: "#a0a0a0",
  "inverse-primary": "#141414",
  secondary: "#707070",
  text: "#c0c0c0",
  "text-selection": "#3a3a3a",
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
