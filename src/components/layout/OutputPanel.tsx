import { useOutputLogStore } from "@stores/outputLogStore";
import { useEffect, useRef } from "react";
import styles from "./OutputPanel.module.css";

interface OutputPanelProps {
  height: number;
}

export function OutputPanel({ height }: OutputPanelProps) {
  const entries = useOutputLogStore((s) => s.entries);
  const clear = useOutputLogStore((s) => s.clear);
  const setOpen = useOutputLogStore((s) => s.setOpen);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div className={styles.panel} style={{ height }}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Output</span>
        <div className={styles.headerActions}>
          <button
            className={styles.headerBtn}
            onClick={clear}
            title="Clear log"
          >
            Clear
          </button>
          <button
            className={styles.headerBtn}
            onClick={() => setOpen(false)}
            title="Close panel"
          >
            ✕
          </button>
        </div>
      </div>
      <div className={styles.logArea}>
        {entries.length === 0 ? (
          <div className={styles.empty}>No output yet</div>
        ) : (
          entries.map((entry, i) => (
            <div key={i} className={`${styles.logLine} ${styles[entry.level]}`}>
              <span className={styles.timestamp}>
                {formatTime(entry.timestamp)}
              </span>
              {entry.message}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
