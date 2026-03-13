/// Blog post code generator
/// Generates individual blog post pages and a blog index page from the manifest.

use crate::manifest::schema::BlogPost;
use super::component_map::component_import_info;
use std::collections::BTreeSet;

/// Generate a blog post page .tsx file.
pub fn generate_blog_post_page(post: &BlogPost) -> String {
    let mut imports: BTreeSet<String> = BTreeSet::new();
    for comp in &post.components {
        collect_imports_recursive(comp, &mut imports);
    }

    let mut out = String::new();

    for import in &imports {
        out.push_str(import);
        out.push('\n');
    }
    if !imports.is_empty() {
        out.push('\n');
    }
    out.push_str("import type { JSX } from \"react\";\n\n");

    let fn_name = blog_post_function_name(&post.slug);

    out.push_str(&format!(
        "export default function {}(): JSX.Element {{\n  return (\n    <>\n",
        fn_name
    ));

    // Blog post header section
    out.push_str("      <article>\n");
    if !post.cover_image_path.is_empty() {
        let escaped = post.cover_image_path.replace('"', "&quot;");
        out.push_str(&format!(
            "        <img src=\"{}\" alt=\"{}\" style={{{{ width: \"100%\", maxHeight: \"400px\", objectFit: \"cover\" }}}} />\n",
            escaped,
            post.title.replace('"', "&quot;"),
        ));
    }
    out.push_str(&format!(
        "        <h1>{}</h1>\n",
        html_escape(&post.title)
    ));
    out.push_str(&format!(
        "        <time dateTime=\"{}\">{}</time>\n",
        html_escape(&post.date),
        html_escape(&post.date)
    ));
    if !post.excerpt.is_empty() {
        out.push_str(&format!(
            "        <p>{}</p>\n",
            html_escape(&post.excerpt)
        ));
    }
    out.push_str("      </article>\n");

    // Render component tree
    for component in &post.components {
        render_component(component, 3, &mut out);
    }

    out.push_str("    </>\n  );\n}\n");
    out
}

/// Generate a blog index page that lists all posts.
pub fn generate_blog_index(posts: &[BlogPost]) -> String {
    let mut out = String::new();

    out.push_str("import { Link } from \"react-router-dom\";\n");
    out.push_str("import type { JSX } from \"react\";\n\n");

    out.push_str("export default function BlogIndexPage(): JSX.Element {\n");
    out.push_str("  return (\n");
    out.push_str("    <>\n");
    out.push_str("      <h1>Blog</h1>\n");
    out.push_str("      <div style={{ display: \"flex\", flexDirection: \"column\", gap: \"2rem\" }}>\n");

    for post in posts {
        let path = format!("/blog/{}", post.slug);
        out.push_str("        <article>\n");
        if !post.cover_image_path.is_empty() {
            out.push_str(&format!(
                "          <img src=\"{}\" alt=\"{}\" style={{{{ width: \"100%\", maxHeight: \"200px\", objectFit: \"cover\" }}}} />\n",
                html_escape(&post.cover_image_path),
                html_escape(&post.title),
            ));
        }
        out.push_str(&format!(
            "          <h2><Link to=\"{}\">{}</Link></h2>\n",
            html_escape(&path),
            html_escape(&post.title),
        ));
        out.push_str(&format!(
            "          <time dateTime=\"{}\">{}</time>\n",
            html_escape(&post.date),
            html_escape(&post.date),
        ));
        if !post.excerpt.is_empty() {
            out.push_str(&format!(
                "          <p>{}</p>\n",
                html_escape(&post.excerpt),
            ));
        }
        out.push_str("        </article>\n");
    }

    out.push_str("      </div>\n");
    out.push_str("    </>\n");
    out.push_str("  );\n");
    out.push_str("}\n");
    out
}

/// Get the filename for a blog post page.
pub fn blog_post_filename(slug: &str) -> String {
    format!("BlogPost_{}.tsx", blog_post_function_name(slug))
}

/// Convert a slug like "my-first-post" to "MyFirstPost".
fn blog_post_function_name(slug: &str) -> String {
    let mut result = String::new();
    let mut cap_next = true;
    for ch in slug.chars() {
        if ch.is_alphanumeric() {
            if cap_next {
                result.extend(ch.to_uppercase());
                cap_next = false;
            } else {
                result.push(ch);
            }
        } else {
            cap_next = true;
        }
    }
    if result.is_empty() {
        "BlogPost".to_string()
    } else {
        result
    }
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

fn collect_imports_recursive(
    comp: &crate::manifest::schema::ComponentInstance,
    imports: &mut BTreeSet<String>,
) {
    if let Some((path, _)) = component_import_info(&comp.component_type) {
        imports.insert(format!(
            "import {} from \"@components/{}\";",
            comp.component_type, path
        ));
    }
    for child in &comp.children {
        collect_imports_recursive(child, imports);
    }
}

fn render_component(
    comp: &crate::manifest::schema::ComponentInstance,
    indent: usize,
    out: &mut String,
) {
    let pad = "  ".repeat(indent);
    let info = component_import_info(&comp.component_type);
    let accepts_children = info.map(|(_, ac)| ac).unwrap_or(false);
    let tag = &comp.component_type;

    out.push_str(&format!("{}<{}", pad, tag));

    let props = render_props(&comp.props);
    if !props.is_empty() {
        let combined = props.join(" ");
        if combined.len() < 60 {
            out.push(' ');
            out.push_str(&combined);
        } else {
            for p in &props {
                out.push('\n');
                out.push_str(&format!("{}  {}", pad, p));
            }
            out.push('\n');
            out.push_str(&pad);
        }
    }

    if comp.children.is_empty() && !accepts_children {
        out.push_str(" />\n");
    } else {
        out.push_str(">\n");
        for child in &comp.children {
            render_component(child, indent + 1, out);
        }
        out.push_str(&format!("{}</{}>\n", pad, tag));
    }
}

fn render_props(
    props: &std::collections::HashMap<String, serde_json::Value>,
) -> Vec<String> {
    let mut result: Vec<String> = Vec::new();
    let mut keys: Vec<&String> = props.keys().collect();
    keys.sort();
    for key in keys {
        let value = &props[key];
        match value {
            serde_json::Value::String(s) => {
                let escaped = s.replace('\\', "\\\\").replace('"', "\\\"");
                result.push(format!("{}=\"{}\"", key, escaped));
            }
            serde_json::Value::Bool(true) => result.push(key.to_string()),
            serde_json::Value::Bool(false) => result.push(format!("{}={{false}}", key)),
            serde_json::Value::Number(n) => result.push(format!("{}={{{}}}", key, n)),
            serde_json::Value::Array(_) | serde_json::Value::Object(_) => {
                let json = serde_json::to_string(value).unwrap_or_default();
                result.push(format!("{}={{{}}}", key, json));
            }
            serde_json::Value::Null => {}
        }
    }
    result
}
