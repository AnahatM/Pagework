/// Static file management and package.json generator.
/// Copies template component files and generates config files.

use std::path::Path;

/// Generate package.json content.
pub fn generate_package_json(project_name: &str, author_name: &str) -> String {
    let safe_name = project_name
        .to_lowercase()
        .replace(' ', "-")
        .chars()
        .filter(|c| c.is_alphanumeric() || *c == '-' || *c == '_')
        .collect::<String>();

    format!(
        r#"{{
  "name": "{}",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {{
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }},
  "dependencies": {{
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.2"
  }},
  "devDependencies": {{
    "@types/node": "^24.0.4",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react-swc": "^3.9.0",
    "typescript": "~5.8.3",
    "vite": "^6.3.5",
    "vite-tsconfig-paths": "^5.1.4"
  }},
  "author": "{}"
}}
"#,
        safe_name, author_name
    )
}

/// Generate vite.config.ts content.
pub fn generate_vite_config() -> &'static str {
    r#"import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
    },
  },
});
"#
}

/// Generate tsconfig.json content.
pub fn generate_tsconfig() -> &'static str {
    r#"{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@routes/*": ["src/routes/*"]
    }
  }
}
"#
}

/// Generate tsconfig.app.json content.
pub fn generate_tsconfig_app() -> &'static str {
    r#"{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@routes/*": ["src/routes/*"]
    }
  },
  "include": ["src"]
}
"#
}

/// Generate tsconfig.node.json content.
pub fn generate_tsconfig_node() -> &'static str {
    r#"{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@routes/*": ["src/routes/*"]
    }
  },
  "include": ["vite.config.ts"]
}
"#
}

/// Generate vercel.json content.
pub fn generate_vercel_json() -> &'static str {
    r#"{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
"#
}

/// Copy template files from the bundled templates directory to the project.
pub fn copy_template_files(templates_dir: &Path, project_dir: &Path) -> Result<(), String> {
    eprintln!("[codegen] copy_template_files: templates_dir={}", templates_dir.display());

    // Copy components directory
    let src_components = templates_dir.join("components");
    let dst_components = project_dir.join("src").join("components");
    eprintln!("[codegen] copying components: src={} (exists={}), dst={}", src_components.display(), src_components.exists(), dst_components.display());
    copy_dir_recursive(&src_components, &dst_components)?;

    // Copy hooks directory
    let src_hooks = templates_dir.join("hooks");
    let dst_hooks = project_dir.join("src").join("hooks");
    copy_dir_recursive(&src_hooks, &dst_hooks)?;

    // Copy utils directory
    let src_utils = templates_dir.join("utils");
    let dst_utils = project_dir.join("src").join("utils");
    copy_dir_recursive(&src_utils, &dst_utils)?;

    // Copy individual files
    let dst_src = project_dir.join("src");
    let dst_styles = dst_src.join("styles");
    let dst_routes = dst_src.join("routes");

    std::fs::create_dir_all(&dst_styles).map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&dst_routes).map_err(|e| e.to_string())?;

    // Resets.css → src/styles/Resets.css
    copy_file_if_exists(
        &templates_dir.join("Resets.css"),
        &dst_styles.join("Resets.css"),
    )?;

    // AssetPathHandler.ts → src/routes/AssetPathHandler.ts
    copy_file_if_exists(
        &templates_dir.join("AssetPathHandler.ts"),
        &dst_routes.join("AssetPathHandler.ts"),
    )?;

    // vite-env.d.ts → src/vite-env.d.ts
    copy_file_if_exists(
        &templates_dir.join("vite-env.d.ts"),
        &dst_src.join("vite-env.d.ts"),
    )?;

    // Copy default assets (banners, icons) into project's public/assets/
    let default_assets = templates_dir.join("assets").join("defaults");
    if default_assets.exists() {
        let public_assets = project_dir.join("public").join("assets");
        // Banner images → public/assets/banners/
        let banners_dir = public_assets.join("banners");
        std::fs::create_dir_all(&banners_dir).map_err(|e| e.to_string())?;
        copy_file_if_exists(
            &default_assets.join("main_banner_light.png"),
            &banners_dir.join("main_banner_light.png"),
        )?;
        copy_file_if_exists(
            &default_assets.join("main_banner_dark.png"),
            &banners_dir.join("main_banner_dark.png"),
        )?;
        // Logo → public/assets/icons/
        let icons_dir = public_assets.join("icons");
        std::fs::create_dir_all(&icons_dir).map_err(|e| e.to_string())?;
        copy_file_if_exists(
            &default_assets.join("PageworkLogo_White.png"),
            &icons_dir.join("PageworkLogo_White.png"),
        )?;
    }

    // Create NotFoundPage if not present
    let not_found_dir = project_dir.join("src").join("pages").join("core");
    std::fs::create_dir_all(&not_found_dir).map_err(|e| e.to_string())?;
    let not_found_path = not_found_dir.join("NotFoundPage.tsx");
    if !not_found_path.exists() {
        std::fs::write(&not_found_path, generate_not_found_page()).map_err(|e| e.to_string())?;
    }

    Ok(())
}

fn copy_dir_recursive(src: &Path, dst: &Path) -> Result<(), String> {
    if !src.exists() {
        return Ok(());
    }

    std::fs::create_dir_all(dst).map_err(|e| format!("create dir {}: {}", dst.display(), e))?;

    let entries = std::fs::read_dir(src)
        .map_err(|e| format!("read dir {}: {}", src.display(), e))?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if src_path.is_dir() {
            copy_dir_recursive(&src_path, &dst_path)?;
        } else {
            std::fs::copy(&src_path, &dst_path)
                .map_err(|e| format!("copy {} -> {}: {}", src_path.display(), dst_path.display(), e))?;
        }
    }

    Ok(())
}

fn copy_file_if_exists(src: &Path, dst: &Path) -> Result<(), String> {
    if src.exists() {
        std::fs::copy(src, dst)
            .map_err(|e| format!("copy {} -> {}: {}", src.display(), dst.display(), e))?;
    }
    Ok(())
}

fn generate_not_found_page() -> &'static str {
    r#"import type { JSX } from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage(): JSX.Element {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Page not found</p>
      <Link to="/" style={{ color: "var(--primary)", textDecoration: "underline" }}>
        Go Home
      </Link>
    </div>
  );
}
"#
}
