import type { ProjectTemplate } from "@/types/manifest";
import { Button } from "@components/shared/Button";
import { FormField } from "@components/shared/FormField";
import { Modal } from "@components/shared/Modal";
import { useProjectStore } from "@stores/projectStore";
import { useUIStore } from "@stores/uiStore";
import { open } from "@tauri-apps/plugin-dialog";
import { addRecentProject, createProject } from "@tauri/projectCommands";
import { getDefaultProjectDir } from "@tauri/systemCommands";
import {
  TEMPLATES,
  generateTemplateManifest,
  type TemplateInfo,
} from "@utils/templates";
import { useEffect, useState } from "react";
import styles from "./NewProjectModal.module.css";

export function NewProjectModal() {
  const closeModal = useUIStore((s) => s.closeModal);
  const setProject = useProjectStore((s) => s.setProject);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate>("blank");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getDefaultProjectDir()
      .then(setLocation)
      .catch(() => {});
  }, []);

  async function handleBrowse() {
    const selected = await open({ directory: true, multiple: false });
    if (selected) setLocation(selected);
  }

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Project name is required.");
      return;
    }
    if (!location) {
      setError("Please select a project location.");
      return;
    }

    setError("");
    setCreating(true);

    try {
      const projectPath = `${location}/${trimmed}`;
      const manifest = generateTemplateManifest(selectedTemplate, trimmed);

      await createProject(projectPath, manifest);
      await addRecentProject({
        name: trimmed,
        path: projectPath,
        lastOpened: new Date().toISOString(),
      });

      setProject(manifest, projectPath);
      closeModal();
    } catch (e) {
      setError(String(e));
      setCreating(false);
    }
  }

  return (
    <Modal
      title="New Project"
      onClose={closeModal}
      footer={
        <div className={styles.footer}>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "Creating…" : "Create Project"}
          </Button>
        </div>
      }
    >
      <FormField
        label="Project Name"
        id="project-name"
        placeholder="my-website"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      <div className={styles.locationRow}>
        <FormField
          label="Location"
          id="project-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Select a folder…"
        />
        <Button
          variant="secondary"
          size="sm"
          className={styles.browseButton}
          onClick={handleBrowse}
        >
          Browse
        </Button>
      </div>

      <p className={styles.sectionLabel}>Template</p>
      <div className={styles.templateGrid}>
        {TEMPLATES.map((t: TemplateInfo) => (
          <div
            key={t.id}
            className={`${styles.templateCard} ${selectedTemplate === t.id ? styles.selected : ""}`}
            onClick={() => setSelectedTemplate(t.id)}
          >
            <span className={styles.templateName}>{t.name}</span>
            <span className={styles.templateDesc}>{t.description}</span>
            <span className={styles.templatePages}>
              {t.pageCount} {t.pageCount === 1 ? "page" : "pages"}
            </span>
          </div>
        ))}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </Modal>
  );
}
