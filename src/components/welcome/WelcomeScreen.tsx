/* ═══════════════════════════════════════════
   Welcome Screen
   Shown when no project is open
   ═══════════════════════════════════════════ */

import { APP_NAME, APP_DESCRIPTION } from "@utils/branding";
import { useUIStore } from "@stores/uiStore";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen() {
  const openModal = useUIStore((s) => s.openModal);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{APP_NAME}</h1>
        <p className={styles.subtitle}>{APP_DESCRIPTION}</p>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => openModal("new-project")}
          >
            Create New Project
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => openModal("open-project")}
          >
            Open Existing Project
          </button>
        </div>
      </div>
    </div>
  );
}
