import { Button } from "@components/shared/Button";
import { Modal } from "@components/shared/Modal";
import { useCallback, useState } from "react";
import styles from "./TableEditorModal.module.css";

interface TableColumn {
  header: string;
  key: string;
}

interface TableEditorModalProps {
  columns: TableColumn[];
  data: Record<string, string>[];
  onSave: (columns: TableColumn[], data: Record<string, string>[]) => void;
  onClose: () => void;
}

function makeKey(header: string, existing: string[]): string {
  const base = header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  let key = base || "col";
  let i = 1;
  while (existing.includes(key)) {
    key = `${base}_${i++}`;
  }
  return key;
}

export function TableEditorModal({
  columns: initialColumns,
  data: initialData,
  onSave,
  onClose,
}: TableEditorModalProps) {
  const hasExisting = initialColumns.length > 0;
  const [mode, setMode] = useState<"setup" | "edit">(
    hasExisting ? "edit" : "setup",
  );
  const [setupRows, setSetupRows] = useState(3);
  const [setupCols, setSetupCols] = useState(3);
  const [columns, setColumns] = useState<TableColumn[]>(initialColumns);
  const [data, setData] = useState<Record<string, string>[]>(
    initialData.map((row) => {
      const normalized: Record<string, string> = {};
      for (const [k, v] of Object.entries(row)) {
        normalized[k] = String(v ?? "");
      }
      return normalized;
    }),
  );

  const handleSetup = useCallback(() => {
    const cols: TableColumn[] = [];
    for (let i = 0; i < setupCols; i++) {
      cols.push({ header: `Column ${i + 1}`, key: `col_${i + 1}` });
    }
    const rows: Record<string, string>[] = [];
    for (let i = 0; i < setupRows; i++) {
      const row: Record<string, string> = {};
      for (const col of cols) row[col.key] = "";
      rows.push(row);
    }
    setColumns(cols);
    setData(rows);
    setMode("edit");
  }, [setupRows, setupCols]);

  const updateHeader = useCallback((index: number, header: string) => {
    setColumns((prev) => {
      const next = [...prev];
      const oldKey = next[index].key;
      const otherKeys = next.filter((_, i) => i !== index).map((c) => c.key);
      const newKey = makeKey(header, otherKeys);
      next[index] = { header, key: newKey };
      // Rename key in all rows
      if (oldKey !== newKey) {
        setData((rows) =>
          rows.map((row) => {
            const updated = { ...row };
            updated[newKey] = updated[oldKey] ?? "";
            delete updated[oldKey];
            return updated;
          }),
        );
      }
      return next;
    });
  }, []);

  const updateCell = useCallback(
    (rowIdx: number, colKey: string, value: string) => {
      setData((prev) => {
        const next = [...prev];
        next[rowIdx] = { ...next[rowIdx], [colKey]: value };
        return next;
      });
    },
    [],
  );

  const addColumn = useCallback(() => {
    const existingKeys = columns.map((c) => c.key);
    const newCol: TableColumn = {
      header: `Column ${columns.length + 1}`,
      key: makeKey(`Column ${columns.length + 1}`, existingKeys),
    };
    setColumns((prev) => [...prev, newCol]);
    setData((prev) => prev.map((row) => ({ ...row, [newCol.key]: "" })));
  }, [columns]);

  const removeColumn = useCallback(
    (index: number) => {
      const removedKey = columns[index].key;
      setColumns((prev) => prev.filter((_, i) => i !== index));
      setData((prev) =>
        prev.map((row) => {
          const updated = { ...row };
          delete updated[removedKey];
          return updated;
        }),
      );
    },
    [columns],
  );

  const addRow = useCallback(() => {
    const row: Record<string, string> = {};
    for (const col of columns) row[col.key] = "";
    setData((prev) => [...prev, row]);
  }, [columns]);

  const removeRow = useCallback((index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveRow = useCallback((index: number, direction: "up" | "down") => {
    setData((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    onSave(columns, data);
    onClose();
  }, [columns, data, onSave, onClose]);

  if (mode === "setup") {
    return (
      <Modal
        title="Create Table"
        onClose={onClose}
        footer={
          <Button
            onClick={handleSetup}
            disabled={setupRows < 1 || setupCols < 1}
          >
            Create
          </Button>
        }
      >
        <div className={styles.wrapper}>
          <div className={styles.setupSection}>
            <div className={styles.setupRow}>
              <span className={styles.setupLabel}>Columns</span>
              <input
                type="number"
                className={styles.setupInput}
                value={setupCols}
                min={1}
                max={20}
                onChange={(e) =>
                  setSetupCols(
                    Math.max(1, Math.min(20, parseInt(e.target.value) || 1)),
                  )
                }
              />
            </div>
            <div className={styles.setupRow}>
              <span className={styles.setupLabel}>Rows</span>
              <input
                type="number"
                className={styles.setupInput}
                value={setupRows}
                min={1}
                max={100}
                onChange={(e) =>
                  setSetupRows(
                    Math.max(1, Math.min(100, parseInt(e.target.value) || 1)),
                  )
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Edit Table"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </>
      }
    >
      <div className={styles.wrapper}>
        <div className={styles.toolbar}>
          <button className={styles.toolbarBtn} onClick={addColumn}>
            + Column
          </button>
          <button className={styles.toolbarBtn} onClick={addRow}>
            + Row
          </button>
        </div>

        {columns.length === 0 ? (
          <div className={styles.emptyState}>
            Add columns to start building your table.
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.rowIndex}>#</th>
                  {columns.map((col, ci) => (
                    <th key={col.key}>
                      <div className={styles.headerCell}>
                        <input
                          className={styles.headerInput}
                          value={col.header}
                          placeholder="Header"
                          onChange={(e) => updateHeader(ci, e.target.value)}
                        />
                        {columns.length > 1 && (
                          <button
                            className={styles.removeColBtn}
                            onClick={() => removeColumn(ci)}
                            title="Remove column"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className={styles.rowActions} />
                </tr>
              </thead>
              <tbody>
                {data.map((row, ri) => (
                  <tr key={ri}>
                    <td className={styles.rowIndex}>{ri + 1}</td>
                    {columns.map((col) => (
                      <td key={col.key}>
                        <input
                          className={styles.cellInput}
                          value={row[col.key] ?? ""}
                          onChange={(e) =>
                            updateCell(ri, col.key, e.target.value)
                          }
                        />
                      </td>
                    ))}
                    <td className={styles.rowActions}>
                      <div className={styles.rowActionsInner}>
                        <button
                          className={styles.rowActionBtn}
                          title="Move up"
                          onClick={() => moveRow(ri, "up")}
                          disabled={ri === 0}
                        >
                          ↑
                        </button>
                        <button
                          className={styles.rowActionBtn}
                          title="Move down"
                          onClick={() => moveRow(ri, "down")}
                          disabled={ri === data.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          className={`${styles.rowActionBtn} ${styles.danger}`}
                          title="Delete row"
                          onClick={() => removeRow(ri)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}
