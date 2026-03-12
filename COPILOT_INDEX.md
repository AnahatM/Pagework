# SiteBuilder — GitHub Copilot Context Index

> **Purpose**: This file gives GitHub Copilot (or any AI assistant) full context about the SiteBuilder project so development can continue seamlessly across sessions without re-explaining anything.

## What Is SiteBuilder?

SiteBuilder is a **local desktop application** for building websites without writing code. It uses a set of premade React components and a visual interface (inspired by Unity's inspector pattern) to let non-technical users create, edit, and publish websites. Built with **Rust + Tauri v2** (desktop shell) and **React + TypeScript** (UI).

The app is **manifest-driven**: a `sitebuilder.project.json` file is the single source of truth for every page, component, prop value, theme color, route, nav link, and footer link. The actual website codebase (React + Vite) is **generated** from this manifest. Users never need to touch code.

## Key Documents (Read These First)

| File                                                     | Purpose                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)             | All requirements, design decisions, constraints, and goals          |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)             | Technical architecture, module structure, data flow, tech stack     |
| [docs/MANIFEST_SCHEMA.md](docs/MANIFEST_SCHEMA.md)       | Full schema for `sitebuilder.project.json` manifest                 |
| [docs/COMPONENT_REGISTRY.md](docs/COMPONENT_REGISTRY.md) | All available website components, their props, and future additions |
| [docs/ROADMAP.md](docs/ROADMAP.md)                       | Step-by-step implementation plan with phases                        |
| [docs/STATUS.md](docs/STATUS.md)                         | Current progress — which phase/step we're on                        |
| [docs/CODE_STYLE.md](docs/CODE_STYLE.md)                 | Code style, architecture guidelines, and DRY conventions            |

## Project Structure (Planned)

```
SiteBuilder/
├── COPILOT_INDEX.md              ← YOU ARE HERE
├── docs/                         ← All design & planning docs
│
├── src-tauri/                    ← Rust/Tauri backend
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── src/
│   │   ├── main.rs               ← Tauri entry point
│   │   ├── lib.rs                ← Module exports
│   │   ├── commands/             ← Tauri IPC commands (called from React)
│   │   │   ├── mod.rs
│   │   │   ├── project.rs        ← Open/create/save projects
│   │   │   ├── codegen.rs        ← Generate website files from manifest
│   │   │   ├── assets.rs         ← Copy/manage image assets
│   │   │   ├── devserver.rs      ← Start/stop npm dev server
│   │   │   └── system.rs         ← Node.js checks, open file explorer, etc.
│   │   ├── codegen/              ← Code generation engine
│   │   │   ├── mod.rs
│   │   │   ├── pages.rs          ← Generate page .tsx files
│   │   │   ├── routes.rs         ← Generate RoutesConfiguration.tsx
│   │   │   ├── navigation.rs     ← Generate NavigationConfiguration.json
│   │   │   ├── footer.rs         ← Generate FooterConfiguration.ts
│   │   │   ├── theme.rs          ← Generate Theme.css
│   │   │   ├── app_shell.rs      ← Generate App.tsx, main.tsx, index.html
│   │   │   └── templates/        ← Starter template definitions
│   │   ├── manifest/             ← Manifest read/write/validate
│   │   │   ├── mod.rs
│   │   │   ├── schema.rs         ← Rust types matching manifest schema
│   │   │   └── migration.rs      ← Future: manifest version migrations
│   │   └── utils/                ← Shared Rust utilities
│
├── src/                          ← React frontend (Tauri webview)
│   ├── main.tsx                  ← React entry point
│   ├── App.tsx                   ← Root layout + routing
│   ├── index.css                 ← Global styles
│   ├── assets/                   ← Builder app static assets (icons, etc.)
│   ├── styles/                   ← Builder app theme/styles
│   ├── stores/                   ← Zustand state stores
│   │   ├── projectStore.ts       ← Current project manifest state
│   │   ├── uiStore.ts            ← UI state (selected component, panel, etc.)
│   │   └── devServerStore.ts     ← Dev server status
│   ├── components/               ← Builder UI components
│   │   ├── layout/               ← App shell: TopBar, Sidebar, Inspector, etc.
│   │   ├── panels/               ← Center panel views
│   │   │   ├── PageStructureView.tsx
│   │   │   └── CodeEditorView.tsx
│   │   ├── inspector/            ← Inspector prop controls
│   │   │   ├── InspectorPanel.tsx
│   │   │   ├── controls/         ← TextInput, NumberInput, Toggle, Dropdown,
│   │   │   │                        ColorPicker, ImagePicker, ArrayEditor, etc.
│   │   │   └── sections/         ← Grouped prop sections
│   │   ├── modals/               ← Dialogs: NewProject, OpenProject, Settings, etc.
│   │   ├── shared/               ← Reusable UI primitives
│   │   └── welcome/              ← Welcome/home screen
│   ├── hooks/                    ← Custom React hooks
│   ├── types/                    ← TypeScript types (manifest, components, etc.)
│   ├── utils/                    ← Frontend utilities
│   └── tauri/                    ← Tauri IPC call wrappers
│       ├── projectCommands.ts
│       ├── codegenCommands.ts
│       ├── assetCommands.ts
│       ├── devServerCommands.ts
│       └── systemCommands.ts
│
├── templates/                    ← Website template files (copied into new projects)
│   ├── base/                     ← Shared base files (vite.config, tsconfig, etc.)
│   └── components/               ← Pre-built React components for generated sites
│
├── package.json                  ← Builder frontend dependencies
├── vite.config.ts                ← Builder frontend Vite config
└── tsconfig.json                 ← Builder frontend TypeScript config
```

## Companion Project

The component library and website template originates from:

- **`c:\Dev\PortfolioWebsiteTemplate`** — Reference React+Vite website with all premade components

The SiteBuilder's `templates/` folder contains the actual component source files that get copied into user projects. These are derived from PortfolioWebsiteTemplate but may diverge.

## Quick Reference

- **State management**: Zustand (simple, minimal boilerplate)
- **Manifest file**: `sitebuilder.project.json` in project root — single source of truth
- **Code generation**: Rust-side, writes .tsx/.css/.json files from manifest
- **Preview**: `npm run dev` spawned as child process, opens default browser
- **Builder theme**: Dark only, glassy/acrylic/translucent aesthetic
- **Target user**: Non-coder who can follow step-by-step Node.js install instructions
- **No WYSIWYG**: Page structure shown as styled blocks, not rendered preview
