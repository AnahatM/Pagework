import { type JSX } from "react";
import "./TextInput.css";

/**
 * TextInput component properties
 */
interface TextInputProps {
  /** Input field value */
  defaultValue: string;
  /** Change event handler */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Whether or not this is a text area */
  isTextArea?: boolean;
  /** Maximum character limit */
  maxLength?: number;
}

/**
 * TextInput component
 *
 * This component is a generic text input field.
 *
 * @returns {JSX.Element} The Input Box that can be used for text input in a form.
 */
export default function TextInput(props: TextInputProps): JSX.Element {
  const { defaultValue, onChange, placeholder, className, disabled, isTextArea, maxLength } = props;

  const handleChange = (value: string): void => {
    if (maxLength && value.length > maxLength) {
      return; // Don't update if exceeds max length
    }
    onChange?.(value);
  };

  return (
    <>
      {isTextArea ? (
        <textarea
          defaultValue={defaultValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`text-input ${className}`}
          disabled={disabled}
          maxLength={maxLength}
        />
      ) : (
        <input
          type="text"
          defaultValue={defaultValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`text-input ${className}`}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
      {maxLength && (
        <div className="character-count">
          {defaultValue.length}/{maxLength}
        </div>
      )}
    </>
  );
}
