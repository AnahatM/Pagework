/* ═══════════════════════════════════════════
   Dev Server Store
   Tracks the user's website dev server status
   ═══════════════════════════════════════════ */

import { create } from "zustand";

export type DevServerStatus = "stopped" | "starting" | "running" | "error";

interface DevServerState {
  status: DevServerStatus;
  port: number | null;
  errorMessage: string | null;
}

interface DevServerActions {
  setRunning: (port: number) => void;
  setStarting: () => void;
  setStopped: () => void;
  setError: (message: string) => void;
}

export const useDevServerStore = create<DevServerState & DevServerActions>()(
  (set) => ({
    status: "stopped",
    port: null,
    errorMessage: null,

    setRunning: (port) => set({ status: "running", port, errorMessage: null }),

    setStarting: () =>
      set({ status: "starting", port: null, errorMessage: null }),

    setStopped: () =>
      set({ status: "stopped", port: null, errorMessage: null }),

    setError: (message) =>
      set({ status: "error", port: null, errorMessage: message }),
  }),
);
