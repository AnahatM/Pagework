import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useProjectStore } from "@stores/projectStore";
import { ask } from "@tauri-apps/plugin-dialog";
import {
  addRecentProject,
  getRecentProjects,
  openProject,
  removeRecentProject,
  type RecentProject,
} from "@tauri/projectCommands";
import { useEffect, useState } from "react";
import styles from "./RecentProjectsList.module.css";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function RecentProjectsList() {
  const setProject = useProjectStore((s) => s.setProject);
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleOpen(project: RecentProject) {
    try {
      const manifest = await openProject(project.path);
      await addRecentProject({
        ...project,
        lastOpened: new Date().toISOString(),
      });
      setProject(manifest, project.path);
    } catch {
      const remove = await ask(
        `The project "${project.name}" appears to have been moved or deleted.\n\nRemove it from the recent projects list?`,
        {
          title: "Project Not Found",
          kind: "warning",
          okLabel: "Remove",
          cancelLabel: "Keep",
        },
      );
      if (remove) {
        await removeRecentProject(project.path);
        setProjects((prev) => prev.filter((p) => p.path !== project.path));
      }
    }
  }

  async function handleRemove(e: React.MouseEvent, projectPath: string) {
    e.stopPropagation();
    await removeRecentProject(projectPath);
    setProjects((prev) => prev.filter((p) => p.path !== projectPath));
  }

  if (loading || projects.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <p className={styles.heading}>Recent Projects</p>
      <div className={styles.list}>
        {projects.map((p) => (
          <div
            key={p.path}
            className={styles.item}
            onClick={() => handleOpen(p)}
          >
            <div className={styles.info}>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.path}>{p.path}</div>
            </div>
            <span className={styles.date}>{formatDate(p.lastOpened)}</span>
            <button
              className={styles.removeButton}
              onClick={(e) => handleRemove(e, p.path)}
              title="Remove from list"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
