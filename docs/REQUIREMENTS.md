# Pagework — Requirements & Design Decisions

## 1. Product Vision

A local desktop application that enables non-technical users to build, customize, and publish websites using a library of premade React components — without writing any code. Inspired by Unity's inspector pattern: select a component, edit its properties in a sidebar panel.

**Target user**: Someone comfortable installing Node.js from step-by-step instructions, but who has never written code. Think "Google Sites" level of simplicity, but producing a real React+Vite website they own and can deploy.

---

## 2. Core Principles

| Principle                   | Description                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Manifest-driven**         | A single JSON manifest (`pagework.project.json`) is the source of truth for the entire website. All code is generated from it. |
| **No code required**        | Every aspect of the website is controllable through the visual interface.                                                      |
| **Real website output**     | The generated project is a standard React+Vite app — deployable anywhere, no vendor lock-in.                                   |
| **Clean separation**        | Pagework app ≠ user's website project. They are fully independent filesystem entities.                                         |
| **Extensible architecture** | Designed so new components, templates, features (preview panel, AI generation, etc.) can be added with minimal refactoring.    |

---

## 3. Functional Requirements

### 3.1 Project Management

| Requirement               | Details                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Create project**        | New project wizard with: project name, directory (default `~/Pagework/Projects/` or custom), starter template selection. |
| **Open project**          | Open any existing Pagework project by browsing to its folder (locate `pagework.project.json`).                           |
| **Recent projects**       | App remembers recently opened projects for quick re-opening on the welcome screen.                                       |
| **Save**                  | Auto-save on changes + manual Ctrl+S. Both update the manifest and regenerate affected code files.                       |
| **One project at a time** | Single-project window. Open a different project by returning to welcome screen or File → Open.                           |
| **Open in file explorer** | Button to open the project folder in the system file manager.                                                            |

### 3.2 Starter Templates

| Template            | Description                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Blank**           | Single empty home page, no components.                                                                               |
| **Portfolio**       | Banner, about section, projects section, contact section. Based on PortfolioWebsiteTemplate.                         |
| **Landing Page**    | Hero section with CTA, features grid, call-to-action footer.                                                         |
| **Blog**            | Home page with blog post cards. Clicking a card navigates to a slug page (`/blog/:slug`) with the full post content. |
| **Content Creator** | Sections for embedded/linked videos, social links, about section.                                                    |

All templates start with plain, basic colors and minimal content — just enough structure to demonstrate the layout.

### 3.3 Page Management

| Requirement       | Details                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Create pages**  | Add new pages with: display name, URL path, page title (browser tab), meta description. |
| **Edit pages**    | Modify page settings (name, path, title, description) at any time.                      |
| **Delete pages**  | Remove pages with confirmation dialog.                                                  |
| **Reorder pages** | Change page order (affects navigation).                                                 |
| **Home page**     | Always exists at `/`, cannot be deleted.                                                |

### 3.4 Component System

| Requirement                  | Details                                                                                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Add components**           | Add components to a page from a categorized component palette.                                                                                                                         |
| **Remove components**        | Delete a component from a page with confirmation.                                                                                                                                      |
| **Reorder components**       | Move components up/down within a page (and within parent containers).                                                                                                                  |
| **Duplicate components**     | Clone a component with all its current prop values.                                                                                                                                    |
| **Nesting**                  | Section-level components (GenericSection, InvisibleSection, SplitSection, etc.) can contain child components (SectionHeader, TextParagraph, SectionImage, LinkButton, SizedBox, etc.). |
| **Component representation** | Components shown as styled blocks in the page structure view — displaying component type and summary of key prop values. Not a WYSIWYG preview.                                        |

### 3.5 Inspector (Property Editor)

| Prop Type                                              | UI Control                                                              |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `string`                                               | Text input (single line)                                                |
| `string` (long text / markdown)                        | Text area (multi-line)                                                  |
| `number`                                               | Number input with optional min/max/step                                 |
| `boolean`                                              | Toggle switch                                                           |
| `string` union (`"left" \| "right"`)                   | Dropdown select                                                         |
| Image path                                             | File picker button → system file dialog → copies file to project assets |
| Color                                                  | Color picker (for theme colors)                                         |
| Complex arrays (`ListItem[]`, `CarouselImage[]`, etc.) | Sub-editor with add/remove/reorder items                                |

**Children are NOT an inspector prop** — they are managed through the nested component tree in the page structure view.

### 3.6 Theming

| Requirement         | Details                                                                                                                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Color variables** | All CSS custom properties editable: page-background, panel-background, panel-shadow-light, panel-shadow-dark, outline, primary, inverse-primary, secondary, text, text-selection, grid-background-lines, positive, warning, negative (and their variants). |
| **Both themes**     | Light theme and dark theme colors are independently editable.                                                                                                                                                                                              |
| **Color picker**    | Full color picker control for each variable.                                                                                                                                                                                                               |
| **Fonts**           | Curated list of ~30–50 popular Google Fonts for `--font-normal` and `--font-display`.                                                                                                                                                                      |
| **No layout vars**  | `--font-size-normal`, `--max-width`, `--mobile-width` etc. are NOT user-editable.                                                                                                                                                                          |

### 3.7 Navigation Editor

| Requirement        | Details                                                    |
| ------------------ | ---------------------------------------------------------- |
| **Navbar items**   | Full CRUD for nav items: link name, path, icon, sub-pages. |
| **Reorder**        | Move nav items up/down.                                    |
| **Sub-pages**      | Add/remove/edit dropdown sub-page links under a nav item.  |
| **Icon selection** | Pick from available icon assets or upload custom.          |

### 3.8 Footer Editor

| Requirement        | Details                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| **Footer columns** | Full CRUD for footer link columns.                                            |
| **Column links**   | Add/remove/edit links within each column (label, URL, tooltip, openInNewTab). |
| **Social links**   | Dedicated editor for social media links and icons.                            |

### 3.9 Site Settings (Centralized)

| Setting          | Details                                                                           |
| ---------------- | --------------------------------------------------------------------------------- |
| Site title       | Browser tab title (global)                                                        |
| Author name      | Used in footer, copyright, etc.                                                   |
| Site description | Meta description for SEO                                                          |
| Copyright text   | Footer copyright line                                                             |
| Favicon          | Upload custom favicon                                                             |
| Social links     | GitHub, LinkedIn, Twitter/X, YouTube, etc. — used by footer and social components |

### 3.10 Preview & Dev Server

| Requirement          | Details                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Start preview**    | Button runs `npm run dev` as a background child process in the project directory.                                             |
| **Open in browser**  | Opens `localhost:5173` (or assigned port) in the user's default browser.                                                      |
| **Status indicator** | Visual indicator showing dev server state: stopped / starting / running / error.                                              |
| **Stop server**      | Button to kill the dev server process.                                                                                        |
| **Auto-install**     | On first open of a project, run `npm install` if `node_modules/` doesn't exist. Show progress.                                |
| **Node.js check**    | On app startup, check if Node.js and npm are installed. If not, show setup instructions with step-by-step guide for their OS. |

### 3.11 Code Editor

| Requirement             | Details                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| **Read-only Monaco**    | Embedded Monaco editor showing generated files.                                         |
| **Tab switching**       | Center panel switches between Page Structure view and Code Editor view.                 |
| **File browser**        | Can navigate and view generated files: pages, configs, CSS, routes, navigation configs. |
| **Syntax highlighting** | TSX, CSS, JSON, TypeScript — handled by Monaco.                                         |

### 3.12 Publishing

| Requirement            | Details                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Vercel**             | Generate `vercel.json` config. Show step-by-step deployment instructions.        |
| **GitHub Pages**       | Show step-by-step instructions for deploying via GitHub Pages.                   |
| **No CLI integration** | Just config files + written directions. No running `vercel deploy` from the app. |
| **No build button**    | No "Build for Production" button for now.                                        |
| **No export/zip**      | Project is already on their filesystem. "Open in File Explorer" button suffices. |

### 3.13 Keyboard Shortcuts

| Shortcut | Action       |
| -------- | ------------ |
| `Ctrl+S` | Save project |

---

## 4. Non-Functional Requirements

| Requirement              | Details                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Platform**             | Windows (primary), macOS and Linux (Tauri supports all three).                                           |
| **Performance**          | Instant UI interactions. Code generation < 1 second for typical projects.                                |
| **No internet required** | App works fully offline. Google Fonts are bundled via curated list.                                      |
| **No analytics**         | No Vercel Analytics, Speed Insights, or Google Analytics in generated sites or builder app.              |
| **English only**         | No internationalization for now.                                                                         |
| **Naming**               | App name and branding are TBD — code should make it trivial to change the name (single constant/config). |

---

## 5. Builder App UI

### 5.1 Theme

- **Dark theme only** for the builder app itself.
- Clean, minimalist aesthetic.
- Glassy surfaces, acrylic transparency, translucent layered UI elements.

### 5.2 Layout

```
┌─────────────────────────────────────────────────────────┐
│  Top Bar: [Logo/Name]  [Project Name]  [Preview ▶]      │
│           [Save 💾]  [Settings ⚙]                       │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │               │
│  Left    │   Center Panel               │   Right       │
│  Sidebar │                              │   Sidebar     │
│          │   [Page Structure] [Code]    │               │
│  • Pages │                              │   Inspector   │
│  • Nav   │   Component blocks /         │   Panel       │
│  • Footer│   Read-only code editor      │               │
│  • Theme │                              │   Props for   │
│  • Site  │                              │   selected    │
│  Settings│                              │   component   │
│          │                              │               │
├──────────┴──────────────────────────────┴───────────────┤
│  Status Bar: [Server: ● Running] [Project path]         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Welcome Screen

Shown when no project is open:

- App logo and name
- "New Project" button → project creation wizard
- "Open Project" button → file browser
- Recent projects list with timestamps

---

## 6. Out of Scope (v1)

| Feature                           | Status                                      |
| --------------------------------- | ------------------------------------------- |
| WYSIWYG preview in app            | Deferred — use browser preview instead      |
| Embedded webview preview panel    | Future expansion (architecture supports it) |
| AI-assisted content generation    | Future expansion (architecture supports it) |
| Undo/redo                         | Not included                                |
| Build for production button       | Not included                                |
| CLI deployment integration        | Not included                                |
| Multi-language / i18n             | Not included                                |
| Custom component creation by user | Not included                                |
| Drag-and-drop reordering          | Not included (use move up/down buttons)     |
| Analytics integration             | Not included                                |
| Builder light theme               | Not included                                |

---

## 7. Future Expansion Notes

The architecture should make these easy to add later without major refactoring:

1. **Embedded preview panel** — A webview panel in the center area showing the live site.
2. **AI content generation** — Generate text, suggest layouts, auto-fill sections.
3. **Drag-and-drop** — Replace move buttons with drag-and-drop reordering.
4. **Custom components** — Let advanced users create and register new component types.
5. **Component marketplace** — Download community-created component packs.
6. **Undo/redo** — Manifest state history stack.
7. **Multi-project tabs** — Open multiple projects in tabs.
8. **Collaboration** — Real-time collaborative editing (distant future).
