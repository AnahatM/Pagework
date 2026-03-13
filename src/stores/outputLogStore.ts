/* ═══════════════════════════════════════════
   Output Log Store
   Accumulates dev server & build output lines
   ═══════════════════════════════════════════ */

import { create } from "zustand";

export interface LogEntry {
  timestamp: number;
  message: string;
  level: "info" | "warn" | "error";
}

interface OutputLogState {
  entries: LogEntry[];
  isOpen: boolean;
}

interface OutputLogActions {
  addEntry: (message: string, level?: LogEntry["level"]) => void;
  clear: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useOutputLogStore = create<OutputLogState & OutputLogActions>()(
  (set) => ({
    entries: [],
    isOpen: false,

    addEntry: (message, level = "info") =>
      set((state) => ({
        entries: [...state.entries, { timestamp: Date.now(), message, level }],
      })),

    clear: () => set({ entries: [] }),

    toggle: () => set((state) => ({ isOpen: !state.isOpen })),

    setOpen: (open) => set({ isOpen: open }),
  }),
);
