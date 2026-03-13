import { useProjectStore } from "@/stores/projectStore";
import { copyAsset, listAssets } from "@/tauri/assetCommands";
import { open } from "@tauri-apps/plugin-dialog";
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import styles from "./Controls.module.css";

/* ══════════════════════════════════════════════
   Text Control — single-line text input
   ══════════════════════════════════════════════ */

interface TextControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextControl({ label, value, onChange }: TextControlProps) {
  return (
    <div className={styles.control}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════
   TextArea Control — multi-line text
   ══════════════════════════════════════════════ */

interface TextAreaControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextAreaControl({
  label,
  value,
  onChange,
}: TextAreaControlProps) {
  return (
    <div className={styles.control}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Number Control
   ══════════════════════════════════════════════ */

interface NumberControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: NumberControlProps) {
  return (
    <div className={styles.control}>
      <label className={styles.label}>{label}</label>
      <div className={styles.numberRow}>
        <input
          className={styles.numberInput}
          type="number"
          value={value ?? 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Toggle Control — boolean switch
   ══════════════════════════════════════════════ */

interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleControl({ label, value, onChange }: ToggleControlProps) {
  return (
    <div className={styles.control}>
      <div className={styles.toggleRow}>
        <label className={styles.label}>{label}</label>
        <button
          type="button"
          className={`${styles.toggle} ${value ? styles.on : ""}`}
          onClick={() => onChange(!value)}
        >
          <span className={styles.toggleDot} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Dropdown Control — select from options
   ══════════════════════════════════════════════ */

interface DropdownControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export function DropdownControl({
  label,
  value,
  onChange,
  options,
}: DropdownControlProps) {
  return (
    <div className={styles.control}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Color Picker Control
   ══════════════════════════════════════════════ */

interface ColorPickerControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPickerControl({
  label,
  value,
  onChange,
}: ColorPickerControlProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.control} ref={ref} style={{ position: "relative" }}>
      <label className={styles.label}>{label}</label>
      <div className={styles.colorRow}>
        <div
          className={styles.colorSwatch}
          style={{ background: value || "#000" }}
          onClick={() => setOpen(!open)}
        />
        <input
          className={styles.colorHex}
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {open && (
        <>
          <div className={styles.colorOverlay} onClick={() => setOpen(false)} />
          <div className={styles.colorPopover}>
            <HexColorPicker color={value || "#000"} onChange={onChange} />
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Image Picker Control (simple path input for now)
   ══════════════════════════════════════════════ */

interface ImagePickerControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  category?: string;
}

export function ImagePickerControl({
  label,
  value,
  onChange,
  category = "images",
}: ImagePickerControlProps) {
  const projectPath = useProjectStore((s) => s.projectPath);
  const [browsing, setBrowsing] = useState(false);
  const [existingAssets, setExistingAssets] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);

  const handlePickFile = async () => {
    if (!projectPath || picking) return;
    setPicking(true);
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Images",
            extensions: ["png", "jpg", "jpeg", "gif", "svg", "webp", "ico"],
          },
        ],
      });
      if (selected) {
        const assetPath = await copyAsset(projectPath, selected, category);
        onChange(assetPath);
      }
    } finally {
      setPicking(false);
    }
  };

  const handleBrowse = async () => {
    if (!projectPath) return;
    const assets = await listAssets(projectPath, category);
    setExistingAssets(assets);
    setBrowsing(true);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={styles.control}>
      <label className={styles.label}>{label}</label>
      <div className={styles.imageRow}>
        {value ? (
          <div className={styles.imagePlaceholder}>📷</div>
        ) : (
          <div className={styles.imagePlaceholder}>—</div>
        )}
        <input
          className={`${styles.input} ${styles.imagePath}`}
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/assets/images/..."
        />
      </div>
      <div className={styles.imageActions}>
        <button
          type="button"
          className={styles.imageBtn}
          onClick={handlePickFile}
          disabled={!projectPath || picking}
        >
          {picking ? "Picking…" : "Choose File"}
        </button>
        <button
          type="button"
          className={styles.imageBtn}
          onClick={handleBrowse}
          disabled={!projectPath}
        >
          Browse
        </button>
        {value && (
          <button
            type="button"
            className={`${styles.imageBtn} ${styles.imageBtnDanger}`}
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>
      {browsing && (
        <div className={styles.assetBrowser}>
          <div className={styles.assetBrowserHeader}>
            <span>Existing Assets</span>
            <button
              type="button"
              className={styles.imageBtn}
              onClick={() => setBrowsing(false)}
            >
              Close
            </button>
          </div>
          {existingAssets.length === 0 ? (
            <div className={styles.assetEmpty}>No assets in this category</div>
          ) : (
            <div className={styles.assetList}>
              {existingAssets.map((asset) => (
                <button
                  key={asset}
                  type="button"
                  className={`${styles.assetItem} ${asset === value ? styles.assetItemActive : ""}`}
                  onClick={() => {
                    onChange(asset);
                    setBrowsing(false);
                  }}
                >
                  {asset.split("/").pop()}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   URL Control — like text but with url semantics
   ══════════════════════════════════════════════ */

interface UrlControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function UrlControl({ label, value, onChange }: UrlControlProps) {
  return (
    <div className={styles.control}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type="url"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
      />
    </div>
  );
}
