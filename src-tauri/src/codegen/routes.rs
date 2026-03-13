/// Routes code generator
/// Generates RoutesConfiguration.tsx from the manifest pages list.

use crate::manifest::schema::{BlogConfig, PageConfig};
use super::pages::page_filename;
use super::blog::blog_post_filename;

/// Generate RoutesConfiguration.tsx content.
pub fn generate_routes(pages: &[PageConfig], blog_config: &Option<BlogConfig>) -> String {
    let mut out = String::new();

    out.push_str("import { lazy, type ReactNode } from \"react\";\n\n");

    // Lazy imports for each page
    for page in pages {
        let filename = page_filename(&page.name);
        let fn_name = filename.trim_end_matches(".tsx");
        out.push_str(&format!(
            "const {} = lazy(() => import(\"@pages/{}\"));\n",
            fn_name, fn_name
        ));
    }

    // Blog lazy imports
    if let Some(ref blog) = blog_config {
        if !blog.posts.is_empty() {
            out.push_str("const BlogIndexPage = lazy(() => import(\"@pages/blog/BlogIndexPage\"));\n");
            for post in &blog.posts {
                let filename = blog_post_filename(&post.slug);
                let fn_name = filename.trim_end_matches(".tsx");
                out.push_str(&format!(
                    "const {} = lazy(() => import(\"@pages/blog/{}\"));\n",
                    fn_name, fn_name
                ));
            }
        }
    }

    // Always include NotFoundPage
    out.push_str("const NotFoundPage = lazy(() => import(\"@pages/core/NotFoundPage\"));\n\n");

    // Route config interface
    out.push_str("export interface RouteConfig {\n");
    out.push_str("  path: string;\n");
    out.push_str("  element: ReactNode;\n");
    out.push_str("  exact?: boolean;\n");
    out.push_str("  label?: string;\n");
    out.push_str("  description?: string;\n");
    out.push_str("}\n\n");

    // Routes array
    out.push_str("export const routes: RouteConfig[] = [\n");
    for page in pages {
        let fn_name = page_filename(&page.name).replace(".tsx", "");
        let path_str = &page.path;
        let label = &page.name;
        let desc = if page.meta_description.is_empty() {
            page.title.clone()
        } else {
            page.meta_description.clone()
        };
        out.push_str(&format!(
            "  {{\n    path: \"{}\",\n    element: <{} />,\n    label: \"{}\",\n    description: \"{}\",\n  }},\n",
            escape_str(path_str),
            fn_name,
            escape_str(label),
            escape_str(&desc),
        ));
    }

    // Blog routes
    if let Some(ref blog) = blog_config {
        if !blog.posts.is_empty() {
            out.push_str(
                "  {\n    path: \"/blog\",\n    element: <BlogIndexPage />,\n    label: \"Blog\",\n    description: \"Blog posts\",\n  },\n"
            );
            for post in &blog.posts {
                let fn_name = blog_post_filename(&post.slug).replace(".tsx", "");
                out.push_str(&format!(
                    "  {{\n    path: \"/blog/{}\",\n    element: <{} />,\n    label: \"{}\",\n    description: \"{}\",\n  }},\n",
                    escape_str(&post.slug),
                    fn_name,
                    escape_str(&post.title),
                    escape_str(&post.excerpt),
                ));
            }
        }
    }

    // 404 catch-all
    out.push_str(
        "  {\n    path: \"*\",\n    element: <NotFoundPage />,\n    label: \"404 Not Found\",\n    description: \"Page not found\",\n  },\n"
    );
    out.push_str("];\n");

    out
}

fn escape_str(s: &str) -> String {
    s.replace('\\', "\\\\").replace('"', "\\\"")
}
