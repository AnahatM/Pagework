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
    return (Object.entries(colors) as [string, string][]).map(
      ([key, value]) => (
        <ColorPickerControl
          key={key}
          label={COLOR_LABELS[key] ?? key}
          value={value}
          onChange={(v) =>
            mode === "global"
              ? updateGlobalColor(key, v)
              : updateThemeColor(mode, key, v)
          }
        />
      ),
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
