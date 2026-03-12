# SiteBuilder — Technical Architecture

## 1. Tech Stack

| Layer              | Technology                       | Purpose                                              |
| ------------------ | -------------------------------- | ---------------------------------------------------- |
| Desktop shell      | **Tauri v2** (Rust)              | Native window, filesystem access, process management |
| Frontend UI        | **React 19 + TypeScript**        | Builder app interface (runs in Tauri webview)        |
| State management   | **Zustand**                      | Lightweight, minimal-boilerplate state stores        |
| Code editor        | **Monaco Editor** (read-only)    | View generated source files                          |
| Styling            | **CSS Modules**                  | Scoped styles for builder components                 |
| Build tool         | **Vite**                         | Builder frontend bundling                            |
| Generated websites | **React 19 + Vite + TypeScript** | What users' websites are built with                  |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Tauri v2 Application                      │
│                                                             │
│  ┌──────────────────────┐    ┌───────────────────────────┐  │
│  │   React Frontend     │    │   Rust Backend             │  │
│  │   (Webview)          │    │   (Tauri Core)             │  │
│  │                      │    │                            │  │
│  │  ┌────────────────┐  │    │  ┌──────────────────────┐  │  │
│  │  │ Zustand Stores │◄─┼─IPC──┤ Commands (IPC API)   │  │  │
│  │  │ • projectStore │  │    │  │ • project commands   │  │  │
│  │  │ • uiStore      │  │    │  │ • codegen commands   │  │  │
│  │  │ • devServer    │  │    │  │ • asset commands     │  │  │
│  │  └───────┬────────┘  │    │  │ • devserver commands │  │  │
│  │          │           │    │  │ • system commands    │  │  │
│  │  ┌───────▼────────┐  │    │  └──────────┬───────────┘  │  │
│  │  │ UI Components  │  │    │             │              │  │
│  │  │ • Layout shell │  │    │  ┌──────────▼───────────┐  │  │
│  │  │ • Inspector    │  │    │  │ Code Generation      │  │  │
│  │  │ • Page view    │  │    │  │ Engine                │  │  │
│  │  │ • Modals       │  │    │  │ • pages generator    │  │  │
│  │  │ • Code editor  │  │    │  │ • routes generator   │  │  │
│  │  └────────────────┘  │    │  │ • theme generator    │  │  │
│  │                      │    │  │ • nav generator      │  │  │
│  └──────────────────────┘    │  │ • footer generator   │  │  │
│                              │  │ • app shell gen      │  │  │
│                              │  └──────────┬───────────┘  │  │
│                              │             │              │  │
│                              │  ┌──────────▼───────────┐  │  │
│                              │  │ Filesystem           │  │  │
│                              │  │ • Read/write manifest│  │  │
│                              │  │ • Write generated    │  │  │
│                              │  │   .tsx/.css/.json     │  │  │
│                              │  │ • Copy assets        │  │  │
│                              │  │ • Spawn npm process  │  │  │
│                              │  └──────────────────────┘  │  │
│                              └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │  User's Website       │
                  │  Project Folder       │
                  │                       │
                  │  sitebuilder.project  │
                  │  .json               │
                  │  src/                │
                  │  public/             │
                  │  package.json        │
                  │  vite.config.ts      │
                  │  ...                 │
                  └───────────────────────┘
```

---

## 3. Data Flow

### 3.1 Manifest → Code Generation Pipeline

```
User interacts with UI
        │
        ▼
Zustand store updated (in-memory manifest)
        │
        ▼
Save triggered (auto or Ctrl+S)
        │
        ├──► Write sitebuilder.project.json to disk
        │
        └──► Invoke Rust codegen commands via IPC
                │
                ├──► Generate page .tsx files
                ├──► Generate RoutesConfiguration.tsx
                ├──► Generate NavigationConfiguration.json
                ├──► Generate FooterConfiguration.ts
                ├──► Generate Theme.css + index.css
                ├──► Generate App.tsx, main.tsx
                └──► Generate index.html (title, favicon)
                        │
                        ▼
                Vite dev server (if running) hot-reloads
                        │
                        ▼
                Browser preview updates automatically
```

### 3.2 Save Flow

```
Ctrl+S or auto-save timer
        │
        ▼
projectStore.save()
        │
        ├──► tauri.invoke("save_manifest", { manifest })
        │         └──► Write JSON to disk
        │
        └──► tauri.invoke("regenerate_all", { manifest })
                  └──► Run all codegen modules
                           └──► Write generated files to project/src/
```

### 3.3 Asset Import Flow

```
User clicks image picker
        │
        ▼
tauri.invoke("pick_and_copy_asset", { projectPath, category })
        │
        ├──► Open native file dialog (Tauri API)
        ├──► User selects image file
        ├──► Determine category subfolder (banners/, icons/, etc.)
        ├──► Copy file to project/public/assets/{category}/
        └──► Return relative asset path (e.g., "/assets/banners/hero.png")
                │
                ▼
        Store path in manifest prop value
```

---

## 4. Module Architecture

### 4.1 Rust Backend Modules

```
src-tauri/src/
├── main.rs                      Entry point, Tauri builder setup
├── lib.rs                       Module re-exports
│
├── commands/                    Tauri IPC command handlers
│   ├── mod.rs                   Re-exports all command modules
│   ├── project.rs               create_project, open_project, save_manifest,
│   │                            get_recent_projects, validate_project
│   ├── codegen.rs               regenerate_all, regenerate_page,
│   │                            regenerate_theme, regenerate_routes, etc.
│   ├── assets.rs                pick_and_copy_asset, delete_asset,
│   │                            list_assets, get_asset_categories
│   ├── devserver.rs             start_devserver, stop_devserver,
│   │                            get_devserver_status
│   └── system.rs                check_node_installed, check_npm_installed,
│                                open_in_explorer, get_default_project_dir,
│                                run_npm_install
│
├── codegen/                     Code generation engine
│   ├── mod.rs                   Orchestrator: regenerate_all()
│   ├── pages.rs                 Generate individual page .tsx files
│   ├── routes.rs                Generate RoutesConfiguration.tsx
│   ├── navigation.rs            Generate NavigationConfiguration.json
│   ├── footer.rs                Generate FooterConfiguration.ts
│   ├── theme.rs                 Generate Theme.css and index.css
│   ├── app_shell.rs             Generate App.tsx, main.tsx, index.html
│   ├── package_json.rs          Generate/update package.json
│   ├── static_files.rs          Copy static config files (tsconfig, vite.config, etc.)
│   └── templates/               Starter template data (Blank, Portfolio, etc.)
│       ├── mod.rs
│       ├── blank.rs
│       ├── portfolio.rs
│       ├── landing_page.rs
│       ├── blog.rs
│       └── content_creator.rs
│
├── manifest/                    Manifest handling
│   ├── mod.rs                   Read, write, validate manifest
│   ├── schema.rs                Rust structs matching manifest JSON schema
│   └── migration.rs             Version migration (for future schema changes)
│
└── utils/                       Shared utilities
    ├── mod.rs
    ├── paths.rs                 Path normalization, project structure helpers
    └── fonts.rs                 Curated Google Fonts list
```

### 4.2 React Frontend Modules

```
src/
├── main.tsx                     React entry, Tauri setup
├── App.tsx                      Root layout, welcome screen vs project view
├── index.css                    Global builder styles
│
├── styles/                      Builder app styling
│   ├── variables.css            CSS variables (dark theme, acrylic effects)
│   ├── glass.css                Shared glassy/translucent surface styles
│   └── animations.css           Subtle transitions and animations
│
├── stores/                      Zustand state management
│   ├── projectStore.ts          Manifest state: pages, components, theme, nav, etc.
│   │                            Actions: addPage, removePage, addComponent,
│   │                            updateProp, moveComponent, etc.
│   ├── uiStore.ts               UI state: selectedPage, selectedComponent,
│   │                            activePanel, inspectorTab, etc.
│   └── devServerStore.ts        Dev server: status, port, logs
│
├── types/                       TypeScript type definitions
│   ├── manifest.ts              Manifest types (mirrors Rust schema)
│   ├── components.ts            Component registry types
│   └── ui.ts                    UI-specific types
│
├── tauri/                       Tauri IPC wrappers (thin async functions)
│   ├── projectCommands.ts       createProject(), openProject(), saveManifest()
│   ├── codegenCommands.ts       regenerateAll(), regeneratePage()
│   ├── assetCommands.ts         pickAndCopyAsset(), listAssets()
│   ├── devServerCommands.ts     startDevServer(), stopDevServer()
│   └── systemCommands.ts        checkNodeInstalled(), openInExplorer()
│
├── components/
│   ├── layout/                  App shell
│   │   ├── AppShell.tsx         Main layout grid (sidebar + center + inspector)
│   │   ├── TopBar.tsx           Project name, action buttons
│   │   ├── StatusBar.tsx        Dev server status, project path
│   │   ├── LeftSidebar.tsx      Page list, nav/footer/theme/settings links
│   │   └── RightSidebar.tsx     Inspector panel container
│   │
│   ├── panels/                  Center panel views
│   │   ├── PageStructureView.tsx    Component block tree for current page
│   │   ├── CodeEditorView.tsx       Read-only Monaco file viewer
│   │   └── PanelTabs.tsx            Tab switcher (Structure / Code)
│   │
│   ├── inspector/               Property inspector
│   │   ├── InspectorPanel.tsx   Main inspector container
│   │   ├── ComponentInspector.tsx   Props editor for selected component
│   │   ├── PageInspector.tsx    Page settings editor
│   │   ├── ThemeInspector.tsx   Theme color/font editor
│   │   ├── NavInspector.tsx     Navigation editor
│   │   ├── FooterInspector.tsx  Footer editor
│   │   ├── SiteSettingsInspector.tsx  Global site settings
│   │   └── controls/            Reusable inspector input controls
│   │       ├── TextControl.tsx
│   │       ├── NumberControl.tsx
│   │       ├── ToggleControl.tsx
│   │       ├── DropdownControl.tsx
│   │       ├── ColorPickerControl.tsx
│   │       ├── ImagePickerControl.tsx
│   │       ├── TextAreaControl.tsx
│   │       └── ArrayEditorControl.tsx
│   │
│   ├── blocks/                  Component block representations
│   │   ├── ComponentBlock.tsx   Single component block (type + summary)
│   │   ├── ComponentBlockList.tsx   Vertical list of blocks
│   │   ├── AddComponentButton.tsx   "+ Add Component" button
│   │   └── ComponentPalette.tsx     Component picker modal/panel
│   │
│   ├── modals/                  Dialog windows
│   │   ├── NewProjectModal.tsx
│   │   ├── OpenProjectModal.tsx
│   │   ├── ConfirmDeleteModal.tsx
│   │   ├── SetupGuideModal.tsx      Node.js installation guide
│   │   └── PublishGuideModal.tsx     Vercel/GitHub deployment steps
│   │
│   ├── welcome/                 Welcome/home screen
│   │   ├── WelcomeScreen.tsx
│   │   ├── RecentProjectsList.tsx
│   │   └── TemplateSelector.tsx
│   │
│   └── shared/                  Reusable UI primitives
│       ├── Button.tsx
│       ├── IconButton.tsx
│       ├── GlassPanel.tsx       Translucent acrylic panel
│       ├── Modal.tsx            Base modal container
│       ├── Tooltip.tsx
│       ├── Badge.tsx
│       └── Divider.tsx
│
├── hooks/
│   ├── useAutoSave.ts           Auto-save timer hook
│   ├── useKeyboardShortcuts.ts  Ctrl+S and other shortcuts
│   └── useDevServer.ts          Dev server lifecycle management
│
└── utils/
    ├── componentRegistry.ts     Component definitions, prop schemas, categories
    └── fontList.ts              Curated Google Fonts data
```

---

## 5. Zustand Store Design

### 5.1 Project Store (`projectStore.ts`)

```typescript
interface ProjectStore {
  // State
  manifest: SiteBuilderManifest | null;
  projectPath: string | null;
  isDirty: boolean; // Unsaved changes exist

  // Project lifecycle
  createProject: (config: NewProjectConfig) => Promise<void>;
  openProject: (path: string) => Promise<void>;
  closeProject: () => void;
  save: () => Promise<void>;

  // Page operations
  addPage: (page: PageConfig) => void;
  updatePage: (pageId: string, updates: Partial<PageConfig>) => void;
  removePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;

  // Component operations
  addComponent: (
    pageId: string,
    parentId: string | null,
    component: ComponentInstance,
  ) => void;
  removeComponent: (pageId: string, componentId: string) => void;
  updateComponentProp: (
    pageId: string,
    componentId: string,
    propName: string,
    value: unknown,
  ) => void;
  moveComponent: (
    pageId: string,
    componentId: string,
    direction: "up" | "down",
  ) => void;
  duplicateComponent: (pageId: string, componentId: string) => void;

  // Theme
  updateThemeColor: (
    theme: "light" | "dark",
    variable: string,
    value: string,
  ) => void;
  updateFont: (variable: string, fontFamily: string) => void;

  // Navigation
  updateNavItems: (items: NavItem[]) => void;

  // Footer
  updateFooterColumns: (columns: FooterColumn[]) => void;
  updateSocialLinks: (links: SocialLink[]) => void;

  // Site settings
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}
```

### 5.2 UI Store (`uiStore.ts`)

```typescript
interface UIStore {
  // Selection
  selectedPageId: string | null;
  selectedComponentId: string | null;
  activeInspectorTab:
    | "component"
    | "page"
    | "theme"
    | "nav"
    | "footer"
    | "settings";
  activeCenterPanel: "structure" | "code";

  // Code editor
  codeEditorFile: string | null; // Currently viewed file path

  // Modals
  activeModal: string | null;
  modalProps: Record<string, unknown>;

  // Actions
  selectPage: (pageId: string) => void;
  selectComponent: (componentId: string | null) => void;
  setInspectorTab: (tab: string) => void;
  setCenterPanel: (panel: "structure" | "code") => void;
  openModal: (name: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
}
```

### 5.3 Dev Server Store (`devServerStore.ts`)

```typescript
interface DevServerStore {
  status: "stopped" | "starting" | "running" | "error";
  port: number | null;
  errorMessage: string | null;

  startServer: () => Promise<void>;
  stopServer: () => Promise<void>;
  openInBrowser: () => void;
}
```

---

## 6. Code Generation Strategy

### 6.1 Principles

- **Deterministic**: Same manifest always produces identical output files.
- **Modular**: Each generator handles one concern (pages, routes, theme, etc.).
- **Incremental-ready**: Architecture supports regenerating a single file or all files. For v1, regenerate all on save for simplicity.
- **Clean output**: Generated code should be readable, well-formatted, and idiomatic React/TypeScript.

### 6.2 Generated File Map

| Manifest Section | Generated File(s)                                                       |
| ---------------- | ----------------------------------------------------------------------- |
| `pages[]`        | `src/pages/{PageName}Page.tsx` for each page                            |
| `pages[]`        | `src/routes/RoutesConfiguration.tsx`                                    |
| `navigation`     | `src/routes/NavigationConfiguration.json`                               |
| `footer`         | `src/routes/FooterConfiguration.ts`                                     |
| `theme`          | `src/styles/Theme.css`                                                  |
| `theme.fonts`    | `src/index.css` (Google Fonts imports + font variables)                 |
| `siteSettings`   | `index.html` (title, favicon, meta)                                     |
| `siteSettings`   | `src/main.tsx`                                                          |
| —                | `src/App.tsx` (generated once, rarely changes)                          |
| —                | `vite.config.ts`, `tsconfig.json`, etc. (static, copied from templates) |
| —                | `package.json` (generated with correct dependencies)                    |

### 6.3 Component Source Files

The actual React component implementations (Banner.tsx, SectionHeader.tsx, etc.) are **not generated** — they are **copied** from the `templates/components/` directory in the SiteBuilder app into the user's project on creation. They remain unchanged unless the user updates their SiteBuilder app version.

---

## 7. User's Website Project Structure

When a user creates or opens a project, this is the structure:

```
MyWebsite/
├── sitebuilder.project.json     ← Manifest (source of truth)
├── index.html                   ← Generated
├── package.json                 ← Generated
├── vite.config.ts               ← Static (copied from template)
├── tsconfig.json                ← Static
├── tsconfig.app.json            ← Static
├── tsconfig.node.json           ← Static
├── vercel.json                  ← Generated (for Vercel deploy)
├── public/
│   ├── favicon.ico              ← User's favicon
│   └── assets/
│       ├── banners/             ← User-uploaded banner images
│       ├── graphics/            ← Logos, decorative images
│       ├── icons/               ← Navigation/UI icons
│       ├── socials/             ← Social media icons
│       └── images/              ← General content images
├── src/
│   ├── main.tsx                 ← Generated
│   ├── App.tsx                  ← Generated
│   ├── index.css                ← Generated (fonts, global vars)
│   ├── vite-env.d.ts            ← Static
│   ├── components/              ← Copied from template (not generated)
│   │   ├── base/
│   │   ├── content/
│   │   ├── core/
│   │   ├── design/
│   │   ├── layouts/
│   │   ├── navigation/
│   │   ├── other/
│   │   ├── ui/
│   │   └── utils/
│   ├── hooks/                   ← Copied from template
│   ├── pages/                   ← Generated (one file per page)
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── core/
│   │       └── NotFoundPage.tsx  ← Static template
│   ├── routes/
│   │   ├── RoutesConfiguration.tsx        ← Generated
│   │   ├── NavigationConfiguration.json   ← Generated
│   │   ├── FooterConfiguration.ts         ← Generated
│   │   └── AssetPathHandler.ts            ← Copied from template
│   ├── styles/
│   │   ├── Theme.css            ← Generated
│   │   └── Resets.css           ← Copied from template
│   └── utils/                   ← Copied from template
└── node_modules/                ← npm install (gitignored)
```

---

## 8. IPC Communication Pattern

All Rust↔React communication uses Tauri v2's `invoke` pattern:

```typescript
// Frontend: src/tauri/projectCommands.ts
import { invoke } from "@tauri-apps/api/core";

export async function saveManifest(
  projectPath: string,
  manifest: SiteBuilderManifest,
): Promise<void> {
  return invoke("save_manifest", { projectPath, manifest });
}

export async function regenerateAll(
  projectPath: string,
  manifest: SiteBuilderManifest,
): Promise<void> {
  return invoke("regenerate_all", { projectPath, manifest });
}
```

```rust
// Backend: src-tauri/src/commands/project.rs
#[tauri::command]
async fn save_manifest(project_path: String, manifest: SiteBuilderManifest) -> Result<(), String> {
    // Write manifest JSON to disk
}
```

---

## 9. Key Design Patterns

| Pattern                    | Usage                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Single source of truth** | Manifest JSON drives everything. UI reads/writes manifest. Code is derived.                               |
| **Command pattern (IPC)**  | All backend operations are discrete, named commands with typed parameters.                                |
| **Registry pattern**       | Component definitions live in a central registry with prop schemas, enabling dynamic inspector rendering. |
| **Observer pattern**       | Zustand subscriptions update UI when manifest state changes.                                              |
| **Template method**        | Each codegen module follows the same pattern: receive manifest section → produce file string.             |
| **Strategy pattern**       | Starter templates are interchangeable manifest generators implementing a common interface.                |
