import type { HTMLAttributes, ReactNode } from "react";
import styles from "./GlassPanel.module.css";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassPanel({ className, children, ...props }: GlassPanelProps) {
  const cls = [styles.panel, className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...props}>
      {children}
    </div>
  );
}
