# Pagework — Implementation Roadmap

Step-by-step plan organized into phases. Each phase builds on the previous one and produces a testable milestone.

---

## Phase 0: Project Scaffolding

> Get the repo structure in place, dependencies installed, and the app skeleton running.

### 0.1 Initialize Tauri v2 + React project

- Run `npm create tauri-app@latest` with React + TypeScript template
- Configure Tauri v2 with proper app identifiers and window settings
- Verify the empty Tauri app launches

### 0.2 Set up project structure

- Create all planned directories (`commands/`, `codegen/`, `manifest/`, `stores/`, etc.)
- Set up path aliases in `tsconfig.json` and `vite.config.ts`
- Install frontend dependencies: Zustand, Monaco Editor for React, a color picker library

### 0.3 Configure builder app styling foundation

- Create CSS variables for the dark theme (glassy/acrylic aesthetic)
- Create shared glass panel styles
- Set up CSS Modules configuration
- Create base layout primitives (`GlassPanel`, `Button`, `IconButton`, etc.)

### 0.4 Create app branding constants

- Single file for app name, version, default paths — easy to change later
- Placeholder icon and logo

---

## Phase 1: Core Data Layer

> Manifest types, Zustand stores, and Tauri IPC commands for project CRUD.

### 1.1 Define TypeScript manifest types

- Create `src/types/manifest.ts` matching the schema in `MANIFEST_SCHEMA.md`
- Create `src/types/components.ts` for component registry types

### 1.2 Define Rust manifest types

- Create `src-tauri/src/manifest/schema.rs` with serde-compatible structs
- Write read/write/validate functions in `src-tauri/src/manifest/mod.rs`

### 1.3 Implement Tauri project commands

- `create_project`: Create directory, write initial manifest, copy template files
- `open_project`: Read and validate manifest
- `save_manifest`: Write manifest to disk
- `get_recent_projects`: Read/write recent projects list (from app data dir)
- `validate_project`: Check manifest integrity

### 1.4 Implement Zustand stores

- `projectStore.ts`: Full manifest state with all CRUD actions
- `uiStore.ts`: Selection, panel, and modal state
- `devServerStore.ts`: Server status tracking

### 1.5 Create Tauri IPC wrappers

- `src/tauri/projectCommands.ts` — thin async wrappers around `invoke()`
- Type-safe request/response handling

---

## Phase 2: Welcome Screen & Project Management

> Users can create, open, and manage projects.

### 2.1 Welcome screen UI

- App logo, name, and version
- "New Project" button
- "Open Project" button
- Recent projects list with project name, path, last opened date

### 2.2 New Project modal

- Project name input
- Directory picker (default path pre-filled)
- Template selector (Blank, Portfolio, Landing Page, Blog, Content Creator)
- "Create" button → creates project and opens it

### 2.3 Open Project flow

- Native file dialog to locate `pagework.project.json`
- Validate and load manifest
- Add to recent projects

### 2.4 Starter template definitions

- Create manifest generators for each template:
  - **Blank**: One home page, one SectionHeader + TextParagraph
  - **Portfolio**: Banner, about section, projects section, contact
  - **Landing Page**: Hero section, features grid, CTA section
  - **Blog**: Blog index page with post cards + one sample post
  - **Content Creator**: Video section, about, social links

---

## Phase 3: App Shell & Layout

> The main editor layout — sidebars, top bar, status bar, center panel.

### 3.1 App shell layout

- `AppShell.tsx`: CSS Grid layout with left sidebar, center panel, right sidebar
- Responsive panel sizing

### 3.2 Top bar

- App logo/name (read from branding constants)
- Current project name
- Preview button (disabled when server not available)
- Save button with dirty indicator
- Settings gear icon

### 3.3 Left sidebar

- Pages list (selectable, shows current page indicator)
- Add page button
- Sidebar navigation: Pages, Navigation, Footer, Theme, Site Settings
- Each section opens the corresponding inspector in the right sidebar

### 3.4 Status bar

- Dev server status indicator (dot: red/yellow/green + text)
- Project folder path (clickable → open in explorer)

### 3.5 Right sidebar container

- Inspector panel container that swaps content based on `activeInspectorTab`

### 3.6 Center panel with tabs

- Tab bar: "Structure" | "Code"
- Panel switching between PageStructureView and CodeEditorView

---

## Phase 4: Page Structure View

> The heart of the builder — viewing and manipulating the component tree.

### 4.1 Component block rendering

- `ComponentBlock.tsx`: Renders a single component as a styled card/block
  - Shows component type icon + display name
  - Shows summary of key props (e.g., title text, image thumbnail)
  - Selection highlight when clicked
  - Move up/down buttons
  - Delete button
  - Duplicate button

### 4.2 Component block list

- `ComponentBlockList.tsx`: Renders a page's component tree
  - Top-level components rendered as blocks
  - Nested children indented within parent blocks (collapsible)
  - Visual nesting indicators (left border, indentation)

### 4.3 Add component flow

- `AddComponentButton.tsx`: "+ Add Component" button at bottom of list and within container components
- `ComponentPalette.tsx`: Modal/popover showing available components organized by category
  - Component cards with icon, name, description
  - Category tabs/filters
  - Clicking adds the component with default prop values

### 4.4 Component selection → inspector

- Clicking a component block sets `selectedComponentId` in uiStore
- Right sidebar automatically shows ComponentInspector for the selected component

---

## Phase 5: Inspector Panel

> Property editing for components, pages, theme, nav, footer, and settings.

### 5.1 Inspector controls library

Build all reusable input controls:

- `TextControl.tsx` — single-line text input
- `TextAreaControl.tsx` — multi-line text area
- `NumberControl.tsx` — number input with min/max/step
- `ToggleControl.tsx` — boolean toggle switch
- `DropdownControl.tsx` — select dropdown
- `ColorPickerControl.tsx` — color picker with hex input
- `ImagePickerControl.tsx` — file picker button + preview thumbnail + asset path
- `ArrayEditorControl.tsx` — add/remove/reorder items, each item has sub-fields

### 5.2 Component inspector

- `ComponentInspector.tsx`: Dynamically renders controls based on selected component's registry definition
- Groups props by `group` field
- Shows component type name and description at top
- Prop changes update the manifest via projectStore

### 5.3 Page inspector

- `PageInspector.tsx`: Edit page name, URL path, title, meta description
- Delete page button (with confirmation, disabled for home page)

### 5.4 Theme inspector

- `ThemeInspector.tsx`: Color pickers for all theme variables
- Tabs or accordion for Light / Dark / Global
- Font selection dropdowns (from curated list)
- Preview swatches for each color

### 5.5 Navigation inspector

- `NavInspector.tsx`: Visual list of nav items
- Add/remove/reorder nav items
- Edit link name, path, icon for each
- Sub-pages editor (expandable list within each nav item)

### 5.6 Footer inspector

- `FooterInspector.tsx`: Visual list of footer columns
- Add/remove/reorder columns
- Edit links within each column
- Social links section with platform, URL, icon

### 5.7 Site settings inspector

- `SiteSettingsInspector.tsx`: Site title, author name, description, copyright, favicon

---

## Phase 6: Code Generation Engine

> Rust-side engine that converts manifest to website source files.

### 6.1 Template component files

- Package all React component source files (from PortfolioWebsiteTemplate) into `templates/components/`
- Include CSS files, hooks, utils, and static configs
- Organize by the same folder structure the generated project will use

### 6.2 Page code generator

- `codegen/pages.rs`: For each page in manifest, generate a `.tsx` file
  - Import statements for used components
  - Render component tree with props mapped to JSX attributes
  - Handle nesting (children passed as JSX children)

### 6.3 Routes generator

- `codegen/routes.rs`: Generate `RoutesConfiguration.tsx` from pages list
  - Lazy imports for each page
  - Route array with path, element, label, description

### 6.4 Navigation generator

- `codegen/navigation.rs`: Generate `NavigationConfiguration.json` from manifest nav items

### 6.5 Footer generator

- `codegen/footer.rs`: Generate `FooterConfiguration.ts` from manifest footer config

### 6.6 Theme generator

- `codegen/theme.rs`: Generate `Theme.css` from manifest theme colors
- `codegen/theme.rs`: Generate `index.css` with Google Fonts imports and font variables

### 6.7 App shell generator

- `codegen/app_shell.rs`: Generate `App.tsx`, `main.tsx`, `index.html`
  - Title, favicon, meta tags from site settings
  - No analytics imports

### 6.8 Static file copy

- `codegen/static_files.rs`: Copy `vite.config.ts`, `tsconfig*.json`, `vercel.json`, `Resets.css`, etc.
- `codegen/package_json.rs`: Generate `package.json` with correct dependencies

### 6.9 Orchestrator

- `codegen/mod.rs`: `regenerate_all()` — calls all generators in sequence
- Writes all output files to the project directory
- Returns list of generated/updated files for logging

---

## Phase 7: Asset Management

> Image file picking, copying, and organization.

### 7.1 Asset commands

- `pick_and_copy_asset`: Open native file dialog, copy selected image to appropriate `public/assets/{category}/` subfolder
- Auto-detect category based on use context (banner picker → banners/, icon picker → icons/, else → images/)
- Return relative asset path for manifest storage

### 7.2 Asset listing

- `list_assets`: List all files in each asset category folder
- Used by image picker to show existing assets

### 7.3 Image picker integration

- `ImagePickerControl.tsx` shows:
  - Current image thumbnail preview
  - "Choose Image" button → opens file dialog
  - "Browse Existing" → shows assets already in project
  - Clear button to remove image

---

## Phase 8: Dev Server & Preview

> Start/stop the Vite dev server and open the site in a browser.

### 8.1 System checks

- `check_node_installed`: Run `node --version`, return version or error
- `check_npm_installed`: Run `npm --version`, return version or error
- On app startup, check and show setup guide if missing

### 8.2 npm install

- `run_npm_install`: Spawn `npm install` in project directory
- Auto-run when opening a project without `node_modules/`
- Show progress/status in UI

### 8.3 Dev server management

- `start_devserver`: Spawn `npm run dev` as background child process
- Parse stdout for port number and "ready" signal
- `stop_devserver`: Kill the child process
- `get_devserver_status`: Return current status

### 8.4 Preview button

- Starts dev server if not running
- Opens `http://localhost:{port}` in default browser
- Status bar shows server state

### 8.5 Setup guide modal

- Step-by-step Node.js installation instructions
- Links to nodejs.org
- "Check Again" button to re-verify installation

---

## Phase 9: Code Editor View

> Read-only Monaco editor for viewing generated source files.

### 9.1 Code editor panel

- `CodeEditorView.tsx`: Monaco editor configured as read-only
- File tree sidebar within the panel showing viewable files:
  - `src/pages/*.tsx`
  - `src/routes/*`
  - `src/styles/Theme.css`
  - `src/index.css`
  - `index.html`
  - `package.json`

### 9.2 File loading

- Tauri command to read file contents: `read_project_file(projectPath, relativePath)`
- Syntax highlighting by file extension (tsx, css, json, ts, html)

---

## Phase 10: Save System

> Auto-save and manual save with full regeneration.

### 10.1 Manual save (Ctrl+S)

- Keyboard shortcut handler
- Calls `projectStore.save()` → writes manifest + regenerates all code
- Brief "Saved" toast/indicator

### 10.2 Auto-save

- Debounced auto-save (e.g., 3 seconds after last change)
- Same flow as manual save
- Dirty indicator on top bar (dot on save button when unsaved changes exist)

---

## Phase 11: Publishing Guide

> Config generation and step-by-step deployment instructions.

### 11.1 Vercel publishing

- Generate `vercel.json` with SPA rewrite rules (already done in codegen)
- Modal with step-by-step instructions:
  1. Push project to GitHub
  2. Connect repo to Vercel
  3. Deploy

### 11.2 GitHub Pages publishing

- Modal with instructions for GitHub Pages deployment
- Mention `vite.config.ts` base path configuration if needed

### 11.3 Open in File Explorer

- Button to open project folder in system file manager
- Uses Tauri's shell API

---

## Phase 12: Blog & Content Creator Features

> Template-specific functionality.

### 12.1 Blog management

- Blog post CRUD within the blog index page
- Post editor: title, slug, date, excerpt, cover image, content (component tree)
- Auto-generate blog index page with post cards
- Auto-generate slug routes and post pages

### 12.2 Video embed component

- Create `VideoEmbed.tsx` React component
- Parse YouTube/Vimeo URLs into embed iframes
- Add to component registry

### 12.3 Content Creator template

- Video section with VideoEmbed components
- Social links bar
- About section

---

## Phase 13: Polish & QA

> Final refinements, edge cases, and quality.

### 13.1 Error handling

- Graceful errors for all Tauri commands
- User-friendly error messages in UI
- Handle missing files, corrupt manifests, permission errors

### 13.2 UI polish

- Smooth transitions and animations
- Consistent spacing, sizing, and typography
- Loading states for async operations
- Empty states for lists

### 13.3 Edge cases

- Very long component trees
- Special characters in names/paths
- Missing assets (show placeholder)
- Concurrent save operations

### 13.4 Testing

- Test project creation with each template
- Test all component types in inspector
- Test code generation output correctness
- Test dev server lifecycle
- Test on clean machine (no Node.js) to verify setup guide

---

## Dependency Graph

```
Phase 0 (Scaffold)
    │
    ▼
Phase 1 (Data Layer)
    │
    ├─────────────────┐
    ▼                 ▼
Phase 2 (Projects)   Phase 3 (App Shell)
    │                 │
    └────────┬────────┘
             ▼
    Phase 4 (Page Structure)
             │
             ▼
    Phase 5 (Inspector)
             │
             ▼
    Phase 6 (Code Generation)
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
Phase 7   Phase 8   Phase 9
(Assets)  (DevSrv)  (Monaco)
    │        │        │
    └────────┼────────┘
             ▼
    Phase 10 (Save System)
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
Phase 11  Phase 12  Phase 13
(Publish) (Blog)    (Polish)
```
