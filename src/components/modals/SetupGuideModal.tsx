import { Button } from "@components/shared/Button";
import { Modal } from "@components/shared/Modal";
import { useUIStore } from "@stores/uiStore";
import { checkNodeInstalled, checkNpmInstalled } from "@tauri/systemCommands";
import { useState } from "react";
import styles from "./PublishModal.module.css";

export function SetupGuideModal() {
  const closeModal = useUIStore((s) => s.closeModal);
  const [checking, setChecking] = useState(false);
  const [nodeVersion, setNodeVersion] = useState<string | null>(null);
  const [npmVersion, setNpmVersion] = useState<string | null>(null);

  async function handleCheck() {
    setChecking(true);
    try {
      const node = await checkNodeInstalled();
      setNodeVersion(node);
    } catch {
      setNodeVersion(null);
    }
    try {
      const npm = await checkNpmInstalled();
      setNpmVersion(npm);
    } catch {
      setNpmVersion(null);
    }
    setChecking(false);
  }

  const isReady = nodeVersion && npmVersion;

  return (
    <Modal title="Setup Required" onClose={closeModal}>
      <div className={styles.content}>
        <div className={styles.note}>
          Node.js is required to preview and build your website. It's a free,
          one-time installation.
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Install Node.js</h3>
          <ol className={styles.steps}>
            <li className={styles.step}>
              Go to <strong>nodejs.org</strong> and download the LTS version
            </li>
            <li className={styles.step}>
              Run the installer and follow the prompts (keep defaults)
            </li>
            <li className={styles.step}>Restart Pagework after installation</li>
          </ol>
        </div>

        <div className={styles.actionRow}>
          <Button
            size="sm"
            variant="primary"
            onClick={handleCheck}
            disabled={checking}
          >
            {checking ? "Checking…" : "Check Again"}
          </Button>
          {isReady && (
            <Button size="sm" variant="secondary" onClick={closeModal}>
              All Set!
            </Button>
          )}
        </div>

        {nodeVersion && (
          <div className={styles.note}>
            Node.js: {nodeVersion} — npm: {npmVersion ?? "not found"}
          </div>
        )}
      </div>
    </Modal>
  );
}
