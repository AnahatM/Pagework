import type { InputHTMLAttributes } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function FormField({ label, hint, id, ...inputProps }: FormFieldProps) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input className={styles.input} id={id} {...inputProps} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
