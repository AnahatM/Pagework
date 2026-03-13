import { type JSX } from "react";
import "./Table.css";

interface TableColumn {
  header: string;
  key: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
  className?: string;
  showBorders?: boolean;
  alternatingRows?: boolean;
  minWidth?: string;
}

export default function Table({
  columns,
  data,
  className = "",
  showBorders = true,
  alternatingRows = true,
  minWidth = "800px"
}: TableProps): JSX.Element {
  const tableClasses = [
    "simple-table",
    showBorders ? "bordered" : "borderless",
    alternatingRows ? "alternating" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="table-container">
      <table className={tableClasses} style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
