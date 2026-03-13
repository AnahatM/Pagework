import { Button } from "@components/shared/Button";
import { Modal } from "@components/shared/Modal";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { openInExplorer } from "@tauri/systemCommands";
import styles from "./PublishModal.module.css";

export function PublishModal() {
  const closeModal = useUIStore((s) => s.closeModal);
  const projectPath = useProjectStore((s) => s.projectPath);

  return (
    <Modal title="Publish Your Website" onClose={closeModal}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Deploy with Vercel (Recommended)
          </h3>
          <ol className={styles.steps}>
            <li className={styles.step}>
              Push your project folder to a GitHub repository
            </li>
            <li className={styles.step}>
              Go to <strong>vercel.com</strong> and sign in with GitHub
            </li>
            <li className={styles.step}>
              Click "New Project" and import your repository
            </li>
            <li className={styles.step}>
              Vercel will auto-detect Vite — click "Deploy"
            </li>
            <li className={styles.step}>
              Your site will be live at a .vercel.app URL in seconds
            </li>
          </ol>
          <div className={styles.note}>
            A <strong>vercel.json</strong> with SPA rewrite rules has already
            been generated in your project.
          </div>
        </div>

        <hr className={styles.separator} />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Deploy with GitHub Pages</h3>
          <ol className={styles.steps}>
            <li className={styles.step}>
              Push your project to a GitHub repository
            </li>
            <li className={styles.step}>
              Go to Settings → Pages and set the source to GitHub Actions
            </li>
            <li className={styles.step}>
              Create a GitHub Actions workflow that runs{" "}
              <strong>npm run build</strong> and deploys the{" "}
              <strong>dist/</strong> folder
            </li>
            <li className={styles.step}>
              If using a custom base path, update <strong>base</strong> in
              vite.config.ts
            </li>
          </ol>
        </div>

        <hr className={styles.separator} />

        <div className={styles.actionRow}>
          {projectPath && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openInExplorer(projectPath)}
            >
              Open Project Folder
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
