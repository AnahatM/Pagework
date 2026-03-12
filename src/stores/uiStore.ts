/* ═══════════════════════════════════════════
   UI Store
   Non-persistent UI state (selection, panels, modals)
   ═══════════════════════════════════════════ */

import { create } from "zustand";

export type InspectorTab =
  | "component"
  | "page"
  | "theme"
  | "nav"
  | "footer"
  | "settings";

export type CenterPanel = "structure" | "code";

interface UIState {
  /* ── Selection ─────────────────────────── */
  selectedPageId: string | null;
  selectedComponentId: string | null;
  activeInspectorTab: InspectorTab;
  activeCenterPanel: CenterPanel;

  /* ── Code editor ───────────────────────── */
  codeEditorFile: string | null;

  /* ── Modals ────────────────────────────── */
  activeModal: string | null;
  modalProps: Record<string, unknown>;
}

interface UIActions {
  selectPage: (pageId: string) => void;
  selectComponent: (componentId: string | null) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  setCenterPanel: (panel: CenterPanel) => void;
  setCodeEditorFile: (filePath: string | null) => void;
  openModal: (name: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState & UIActions>()((set) => ({
  /* initial state */
  selectedPageId: null,
  selectedComponentId: null,
  activeInspectorTab: "page",
  activeCenterPanel: "structure",
  codeEditorFile: null,
  activeModal: null,
  modalProps: {},

  /* actions */
  selectPage: (pageId) =>
    set({
      selectedPageId: pageId,
      selectedComponentId: null,
      activeInspectorTab: "page",
    }),

  selectComponent: (componentId) =>
    set({
      selectedComponentId: componentId,
      activeInspectorTab: componentId ? "component" : "page",
    }),

  setInspectorTab: (tab) => set({ activeInspectorTab: tab }),

  setCenterPanel: (panel) => set({ activeCenterPanel: panel }),

  setCodeEditorFile: (filePath) => set({ codeEditorFile: filePath }),

  openModal: (name, props = {}) =>
    set({ activeModal: name, modalProps: props }),

  closeModal: () => set({ activeModal: null, modalProps: {} }),
}));
