/// Code generation orchestrator.
/// Coordinates all generators to produce a complete website from a manifest.

pub mod component_map;
pub mod pages;
pub mod routes;
pub mod navigation;
pub mod footer;
pub mod theme;
pub mod app_shell;
pub mod static_files;
pub mod blog;

use crate::manifest::schema::SiteBuilderManifest;
use std::path::Path;

/// Regenerate all website source files from the manifest.
pub fn regenerate_all(
    project_path: &Path,
    manifest: &SiteBuilderManifest,
    templates_dir: &Path,
) -> Result<Vec<String>, String> {
    let mut generated_files: Vec<String> = Vec::new();

    let src = project_path.join("src");
    let pages_dir = src.join("pages");
    let routes_dir = src.join("routes");
    let styles_dir = src.join("styles");

    // Ensure directories exist
    for dir in [&pages_dir, &routes_dir, &styles_dir] {
        std::fs::create_dir_all(dir)
            .map_err(|e| format!("create dir {}: {}", dir.display(), e))?;
    }

    // 1. Copy template component/hook/util files
    static_files::copy_template_files(templates_dir, project_path)?;
    generated_files.push("(template files copied)".to_string());

    // 2. Generate page files
    for page in &manifest.pages {
        let filename = pages::page_filename(&page.name);
        let content = pages::generate_page(page);
        let path = pages_dir.join(&filename);
        write_file(&path, &content)?;
        generated_files.push(format!("src/pages/{}", filename));
    }

    // 2b. Generate blog pages
    if let Some(ref blog_config) = manifest.blog_config {
        let blog_pages_dir = pages_dir.join("blog");
        std::fs::create_dir_all(&blog_pages_dir)
            .map_err(|e| format!("create blog pages dir: {}", e))?;

        // Blog index page
        let index_content = blog::generate_blog_index(&blog_config.posts);
        write_file(&blog_pages_dir.join("BlogIndexPage.tsx"), &index_content)?;
        generated_files.push("src/pages/blog/BlogIndexPage.tsx".to_string());

        // Individual blog post pages
        for post in &blog_config.posts {
            let filename = blog::blog_post_filename(&post.slug);
            let content = blog::generate_blog_post_page(post);
            write_file(&blog_pages_dir.join(&filename), &content)?;
            generated_files.push(format!("src/pages/blog/{}", filename));
        }
    }

    // 3. Generate routes
    let routes_content = routes::generate_routes(&manifest.pages, &manifest.blog_config);
    let routes_path = routes_dir.join("RoutesConfiguration.tsx");
    write_file(&routes_path, &routes_content)?;
    generated_files.push("src/routes/RoutesConfiguration.tsx".to_string());

    // 4. Generate navigation config
    let nav_content = navigation::generate_navigation(&manifest.navigation);
    let nav_path = routes_dir.join("NavigationConfiguration.json");
    write_file(&nav_path, &nav_content)?;
    generated_files.push("src/routes/NavigationConfiguration.json".to_string());

    // 5. Generate footer config
    let footer_content = footer::generate_footer(&manifest.footer);
    let footer_path = routes_dir.join("FooterConfiguration.ts");
    write_file(&footer_path, &footer_content)?;
    generated_files.push("src/routes/FooterConfiguration.ts".to_string());

    // 6. Generate theme
    let theme_css = theme::generate_theme_css(&manifest.theme);
    write_file(&styles_dir.join("Theme.css"), &theme_css)?;
    generated_files.push("src/styles/Theme.css".to_string());

    let index_css = theme::generate_index_css(&manifest.theme);
    write_file(&src.join("index.css"), &index_css)?;
    generated_files.push("src/index.css".to_string());

    // 7. Generate app shell files
    let app_tsx = app_shell::generate_app_tsx();
    write_file(&src.join("App.tsx"), &app_tsx)?;
    generated_files.push("src/App.tsx".to_string());

    let main_tsx = app_shell::generate_main_tsx();
    write_file(&src.join("main.tsx"), &main_tsx)?;
    generated_files.push("src/main.tsx".to_string());

    let index_html = app_shell::generate_index_html(&manifest.site_settings);
    write_file(&project_path.join("index.html"), &index_html)?;
    generated_files.push("index.html".to_string());

    // 8. Generate config files
    let pkg = static_files::generate_package_json(
        &manifest.project_name,
        &manifest.site_settings.author_name,
    );
    write_file(&project_path.join("package.json"), &pkg)?;
    generated_files.push("package.json".to_string());

    write_file(
        &project_path.join("vite.config.ts"),
        static_files::generate_vite_config(),
    )?;
    generated_files.push("vite.config.ts".to_string());

    write_file(
        &project_path.join("tsconfig.json"),
        static_files::generate_tsconfig(),
    )?;
    generated_files.push("tsconfig.json".to_string());

    write_file(
        &project_path.join("tsconfig.app.json"),
        static_files::generate_tsconfig_app(),
    )?;
    generated_files.push("tsconfig.app.json".to_string());

    write_file(
        &project_path.join("tsconfig.node.json"),
        static_files::generate_tsconfig_node(),
    )?;
    generated_files.push("tsconfig.node.json".to_string());

    write_file(
        &project_path.join("vercel.json"),
        static_files::generate_vercel_json(),
    )?;
    generated_files.push("vercel.json".to_string());

    // 9. Create public/assets directories
    let public_assets = project_path.join("public").join("assets");
    for subdir in ["banners", "graphics", "icons", "socials", "images"] {
        std::fs::create_dir_all(public_assets.join(subdir))
            .map_err(|e| format!("create assets dir: {}", e))?;
    }

    Ok(generated_files)
}

fn write_file(path: &Path, content: &str) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| format!("create parent {}: {}", parent.display(), e))?;
    }
    std::fs::write(path, content)
        .map_err(|e| format!("write {}: {}", path.display(), e))
}
