import { useProjectStore } from "@stores/projectStore";
import { regenerateAll } from "@tauri/codegenCommands";
import { saveManifest } from "@tauri/projectCommands";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_SAVE_DELAY = 3000;

export function useAutoSave() {
  const manifest = useProjectStore((s) => s.manifest);
  const projectPath = useProjectStore((s) => s.projectPath);
  const isDirty = useProjectStore((s) => s.isDirty);
  const markClean = useProjectStore((s) => s.markClean);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  const performSave = useCallback(async () => {
    if (!manifest || !projectPath || savingRef.current) return;
    savingRef.current = true;
    try {
      await saveManifest(projectPath, manifest);
      await regenerateAll(projectPath, manifest);
      markClean();
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1500);
    } finally {
      savingRef.current = false;
    }
  }, [manifest, projectPath, markClean]);

  // Auto-save with debounce
  useEffect(() => {
    if (!isDirty || !manifest || !projectPath) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      performSave();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDirty, manifest, projectPath, performSave]);

  // Ctrl+S keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty) performSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, performSave]);

  return { saveIndicator, performSave };
}
