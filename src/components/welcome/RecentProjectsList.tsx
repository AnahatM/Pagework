import { useProjectStore } from "@stores/projectStore";
import {
  addRecentProject,
  getRecentProjects,
  openProject,
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
      // Project may have been deleted — silently ignore
    }
  }

  if (loading) return null;

  return (
    <div>
      <p className={styles.heading}>Recent Projects</p>
      {projects.length === 0 ? (
        <p className={styles.empty}>No recent projects</p>
      ) : (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
