# SiteBuilder — Code Style & Architecture Guidelines

Rules for keeping the codebase clean, DRY, maintainable, and extensible.

---

## 1. General Principles

- **DRY**: Never duplicate logic. Extract shared code into utilities or shared modules.
- **Single Responsibility**: Each file does one thing. Each function does one thing.
- **Small files**: No file should exceed ~300 lines. If it does, split it into sub-modules.
- **Explicit over implicit**: Name things clearly. Avoid abbreviations (except well-known ones like `id`, `url`, `props`).
- **No dead code**: Remove unused imports, variables, and functions immediately.
- **No magic numbers/strings**: Use named constants. Define them close to where they're used, or in a shared constants file if used across modules.

---

## 2. File Naming

| Entity           | Convention                                  | Example                     |
| ---------------- | ------------------------------------------- | --------------------------- |
| React components | PascalCase `.tsx`                           | `ComponentBlock.tsx`        |
| Hooks            | camelCase starting with `use`               | `useAutoSave.ts`            |
| Stores           | camelCase ending with `Store`               | `projectStore.ts`           |
| Utilities        | camelCase `.ts`                             | `componentRegistry.ts`      |
| Types            | camelCase `.ts` in `types/`                 | `manifest.ts`               |
| CSS Modules      | PascalCase `.module.css` matching component | `ComponentBlock.module.css` |
| Rust modules     | snake_case `.rs`                            | `app_shell.rs`              |
| Rust commands    | snake_case function names                   | `save_manifest`             |

---

## 3. React / TypeScript

### Component Structure

```typescript
// 1. Imports (grouped: react, libs, stores, components, hooks, types, styles)
import { useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import type { ComponentInstance } from "@/types/manifest";
import styles from "./ComponentBlock.module.css";

// 2. Types (if component-specific and small; otherwise in types/)
interface ComponentBlockProps {
  component: ComponentInstance;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

// 3. Component (named export, no default exports)
export function ComponentBlock({ component, onSelect, isSelected }: ComponentBlockProps) {
  // hooks first
  const updateProp = useProjectStore((s) => s.updateComponentProp);

  // handlers
  const handleClick = () => onSelect(component.id);

  // render
  return (
    <div className={styles.block} onClick={handleClick}>
      {/* ... */}
    </div>
  );
}
```

### Rules

- **Named exports only** — no `export default`. Makes imports explicit and refactor-friendly.
- **No inline styles** except for truly dynamic values (e.g., computed positions). Use CSS Modules.
- **Destructure props** in the function signature.
- **Keep components pure** when possible. Side effects belong in hooks or stores.
- **One component per file** — except tiny, tightly-coupled helper components used only by the parent.
- **Zustand selectors**: Always use selectors to avoid unnecessary re-renders.

  ```typescript
  // Good — only re-renders when selectedComponentId changes
  const selectedId = useUIStore((s) => s.selectedComponentId);

  // Bad — re-renders on any store change
  const store = useUIStore();
  ```

### Zustand Conventions

```typescript
import { create } from "zustand";

interface UIStore {
  selectedPageId: string | null;
  selectPage: (id: string) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  selectedPageId: null,
  selectPage: (id) => set({ selectedPageId: id }),
}));
```

- Store files export a single `use{Name}Store` hook.
- Group state and actions together in the interface.
- Use `set()` for simple updates, `get()` when you need current state in an action.

---

## 4. Rust

### Module Organization

```rust
// src-tauri/src/commands/project.rs

use crate::manifest::schema::SiteBuilderManifest;
use crate::utils::paths;
use tauri::command;

/// Create a new project directory with initial manifest and template files.
#[command]
pub async fn create_project(
    project_name: String,
    project_path: String,
    template: String,
) -> Result<SiteBuilderManifest, String> {
    // Implementation...
}
```

### Rules

- **Error handling**: All commands return `Result<T, String>`. Map internal errors to user-friendly messages.
- **Serde**: All manifest types derive `Serialize` and `Deserialize`.
- **No unwrap()**: Use `?` operator or explicit error handling. `unwrap()` only in tests.
- **Document public functions**: Brief `///` doc comment explaining purpose.
- **Avoid large functions**: Break into helpers if a function exceeds ~50 lines.

### Code Generation Rules

Code generators must produce **clean, readable, well-formatted** output. The generated code should look like a human wrote it.

```rust
// codegen/pages.rs — Each generator follows this pattern:

/// Generate a page .tsx file from a page manifest entry.
pub fn generate_page(page: &PageConfig, all_components: &ComponentRegistry) -> String {
    let mut output = String::new();

    // 1. Generate imports
    let imports = collect_imports(page);
    output.push_str(&generate_import_block(&imports));

    // 2. Generate component function
    output.push_str(&generate_page_function(page));

    output
}
```

- **Keep generators modular**: Separate functions for imports, JSX tree, prop formatting.
- **Use string builders**: Build output incrementally, not with format macros for large blocks.
- **Indentation**: Generated code uses 2-space indentation (matching React conventions).
- **Template strings**: For static boilerplate (vite.config, tsconfig), use include_str! or template files, not inline strings.

---

## 5. CSS (Builder App)

### Naming

- Use CSS Modules for component scoping.
- Class names: camelCase within modules.
  ```css
  /* ComponentBlock.module.css */
  .block {
  }
  .blockSelected {
  }
  .blockHeader {
  }
  ```

### Theme Variables

All builder app colors, sizes, and effects in `src/styles/variables.css`:

```css
:root {
  /* Base colors */
  --bg-primary: #0d0d12;
  --bg-secondary: #16161e;
  --bg-tertiary: #1e1e28;
  --bg-glass: rgba(30, 30, 40, 0.7);

  /* Glass/acrylic effects */
  --glass-blur: 12px;
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

  /* Text */
  --text-primary: #e4e4e8;
  --text-secondary: #8888a0;
  --text-muted: #555568;

  /* Accent */
  --accent: #6c6cff;
  --accent-hover: #8484ff;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Glass Panel Pattern

```css
.glassPanel {
  background: var(--bg-glass);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-shadow);
}
```

---

## 6. Project Organization Rules

### Import Order

TypeScript files — group imports with blank lines between groups:

```typescript
// 1. React / built-in
import { useState, useCallback } from "react";

// 2. Third-party libraries
import { invoke } from "@tauri-apps/api/core";
import Editor from "@monaco-editor/react";

// 3. Stores
import { useProjectStore } from "@/stores/projectStore";

// 4. Components
import { GlassPanel } from "@/components/shared/GlassPanel";

// 5. Hooks
import { useAutoSave } from "@/hooks/useAutoSave";

// 6. Types
import type { ComponentInstance } from "@/types/manifest";

// 7. Styles
import styles from "./MyComponent.module.css";
```

### Path Aliases

```json
{
  "@/*": ["src/*"],
  "@components/*": ["src/components/*"],
  "@stores/*": ["src/stores/*"],
  "@hooks/*": ["src/hooks/*"],
  "@types/*": ["src/types/*"],
  "@tauri/*": ["src/tauri/*"],
  "@utils/*": ["src/utils/*"],
  "@styles/*": ["src/styles/*"]
}
```

---

## 7. Extensibility Patterns

### Adding a New Inspector Section

1. Create `src/components/inspector/{Name}Inspector.tsx`
2. Add the section key to `UIStore.activeInspectorTab` union type
3. Add the tab to `LeftSidebar.tsx` navigation
4. Add the case to `RightSidebar.tsx` switch

### Adding a New Component to Registry

See [COMPONENT_REGISTRY.md](COMPONENT_REGISTRY.md#5-adding-a-new-component).

### Adding a New Tauri Command

1. Create the Rust function in the appropriate `commands/` module
2. Register it in `main.rs` via `.invoke_handler(tauri::generate_handler![...])`
3. Create the TypeScript wrapper in `src/tauri/{module}Commands.ts`

### Adding a New Starter Template

1. Create `src-tauri/src/codegen/templates/{name}.rs`
2. Implement the manifest generator function returning a `SiteBuilderManifest`
3. Register in `src-tauri/src/codegen/templates/mod.rs`
4. Add to `TemplateSelector.tsx` UI

---

## 8. Anti-Patterns to Avoid

| Don't                                   | Do Instead                                       |
| --------------------------------------- | ------------------------------------------------ |
| Large god-components (500+ lines)       | Split into sub-components                        |
| Prop drilling through 3+ levels         | Use Zustand store or React context               |
| String-based component type checking    | Use the typed registry                           |
| Inline codegen template strings in Rust | Use separate template files or builder functions |
| Manual JSON serialization               | Use serde derive                                 |
| Catching all errors silently            | Show user-friendly error messages                |
| Direct filesystem access from React     | Always go through Tauri commands                 |
| Storing derived state                   | Compute it (or use Zustand's derived state)      |
| CSS !important                          | Fix the specificity issue properly               |
| `any` type in TypeScript                | Define proper types                              |
