/* ═══════════════════════════════════════════
   App Shell
   Main layout when a project is open
   ═══════════════════════════════════════════ */

import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <span className={styles.projectName}>Project</span>
      </header>
      <div className={styles.body}>
        <aside className={styles.leftSidebar}>
          <p style={{ padding: "var(--space-md)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Pages will appear here
          </p>
        </aside>
        <main className={styles.center}>
          <p style={{ padding: "var(--space-md)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Page structure will appear here
          </p>
        </main>
        <aside className={styles.rightSidebar}>
          <p style={{ padding: "var(--space-md)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Inspector will appear here
          </p>
        </aside>
      </div>
      <footer className={styles.statusbar}>
        <span className={styles.statusText}>Ready</span>
      </footer>
    </div>
  );
}
