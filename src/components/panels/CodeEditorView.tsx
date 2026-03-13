import Editor from "@monaco-editor/react";
import { useProjectStore } from "@stores/projectStore";
import { listProjectFiles, readProjectFile } from "@tauri/projectCommands";
import { useEffect, useState } from "react";
import styles from "./CodeEditorView.module.css";

function languageFromPath(path: string): string {
  if (path.endsWith(".tsx") || path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".html")) return "html";
  return "plaintext";
}

/** Group files by their directory prefix for the tree display. */
function groupFiles(files: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const file of files) {
    const lastSlash = file.lastIndexOf("/");
    const dir = lastSlash === -1 ? "" : file.slice(0, lastSlash);
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir)!.push(file);
  }
  return groups;
}

export function CodeEditorView() {
  const projectPath = useProjectStore((s) => s.projectPath);
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (!projectPath) return;
    setLoadingFiles(true);
    listProjectFiles(projectPath)
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoadingFiles(false));
  }, [projectPath]);

  useEffect(() => {
    if (!projectPath || !selectedFile) {
      setFileContent("");
      return;
    }
    setLoadingContent(true);
    readProjectFile(projectPath, selectedFile)
      .then(setFileContent)
      .catch(() => setFileContent("// Could not load file"))
      .finally(() => setLoadingContent(false));
  }, [projectPath, selectedFile]);

  if (!projectPath) {
    return <div className={styles.emptyState}>No project open</div>;
  }

  const grouped = groupFiles(files);

  return (
    <div className={styles.container}>
      <div className={styles.fileTree}>
        <div className={styles.fileTreeHeader}>Generated Files</div>
        {loadingFiles ? (
          <div className={styles.emptyState}>Loading files…</div>
        ) : files.length === 0 ? (
          <div className={styles.emptyState}>
            No generated files yet. Save your project to generate code.
          </div>
        ) : (
          [...grouped.entries()].map(([dir, dirFiles]) => (
            <div key={dir}>
              {dir && <div className={styles.folderLabel}>{dir}</div>}
              {dirFiles.map((file) => (
                <button
                  key={file}
                  type="button"
                  className={`${styles.fileItem} ${file === selectedFile ? styles.fileItemActive : ""}`}
                  onClick={() => setSelectedFile(file)}
                  title={file}
                >
                  {file.split("/").pop()}
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      <div className={styles.editorPane}>
        {selectedFile ? (
          <>
            <div className={styles.editorHeader}>
              {selectedFile}
              {loadingContent && (
                <span style={{ marginLeft: 8, opacity: 0.5 }}>Loading…</span>
              )}
            </div>
            <div className={styles.editorWrapper}>
              <Editor
                height="100%"
                language={languageFromPath(selectedFile)}
                value={fileContent}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            Select a file to view its generated code
          </div>
        )}
      </div>
    </div>
  );
}
