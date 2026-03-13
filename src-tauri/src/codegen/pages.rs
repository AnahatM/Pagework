/// Page code generator
/// Converts a PageConfig into a React .tsx page file.

use crate::manifest::schema::{ComponentInstance, PageConfig};
use super::component_map::component_import_info;
use std::collections::BTreeSet;

/// Generate a page .tsx file from a PageConfig.
pub fn generate_page(page: &PageConfig) -> String {
    let mut imports: BTreeSet<String> = BTreeSet::new();
    collect_imports(&page.components, &mut imports);

    let mut out = String::new();

    // Import statements
    for import in &imports {
        out.push_str(import);
        out.push('\n');
    }
    if !imports.is_empty() {
        out.push_str("import type { JSX } from \"react\";\n\n");
    }

    // Function name from page name
    let fn_name = page_function_name(&page.name);

    out.push_str(&format!(
        "export default function {}(): JSX.Element {{\n  return (\n    <>\n",
        fn_name
    ));

    // Render component tree
    for component in &page.components {
        render_component(component, 3, &mut out);
    }

    out.push_str("    </>\n  );\n}\n");
    out
}

/// Collect all unique import statements from a component tree.
fn collect_imports(components: &[ComponentInstance], imports: &mut BTreeSet<String>) {
    for comp in components {
        if let Some((path, _)) = component_import_info(&comp.component_type) {
            imports.insert(format!(
                "import {} from \"@components/{}\";",
                comp.component_type, path
            ));
        }
        collect_imports(&comp.children, imports);
    }
}

/// Render a single component and its children as JSX.
fn render_component(comp: &ComponentInstance, indent: usize, out: &mut String) {
    let pad = "  ".repeat(indent);
    let info = component_import_info(&comp.component_type);
    let accepts_children = info.map(|(_, ac)| ac).unwrap_or(false);
    let tag = &comp.component_type;

    // Open tag
    out.push_str(&format!("{}<{}", pad, tag));

    // Props
    let props = render_props(&comp.props);
    if !props.is_empty() {
        // If short enough, inline; otherwise multi-line
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
        // Self-closing
        out.push_str(" />\n");
    } else {
        out.push_str(">\n");
        for child in &comp.children {
            render_component(child, indent + 1, out);
        }
        out.push_str(&format!("{}</{}>\n", pad, tag));
    }
}

/// Convert component props map to JSX attribute strings.
fn render_props(props: &std::collections::HashMap<String, serde_json::Value>) -> Vec<String> {
    let mut result: Vec<String> = Vec::new();
    let mut keys: Vec<&String> = props.keys().collect();
    keys.sort();

    for key in keys {
        let value = &props[key];
        match value {
            serde_json::Value::String(s) => {
                if s.contains('\n') || s.contains('"') {
                    // Use JS template literal for strings with newlines or quotes
                    let escaped = s.replace('\\', "\\\\").replace('`', "\\`").replace("${", "\\${");
                    result.push(format!("{}={{`{}`}}", key, escaped));
                } else {
                    // Simple string prop: key="value"
                    result.push(format!("{}=\"{}\"", key, s));
                }
            }
            serde_json::Value::Bool(true) => {
                // Boolean true: just the prop name
                result.push(key.to_string());
            }
            serde_json::Value::Bool(false) => {
                result.push(format!("{}={{false}}", key));
            }
            serde_json::Value::Number(n) => {
                result.push(format!("{}={{{}}}", key, n));
            }
            serde_json::Value::Array(_) | serde_json::Value::Object(_) => {
                // Complex values: serialize as JSON within curly braces
                let json = serde_json::to_string(value).unwrap_or_default();
                result.push(format!("{}={{{}}}", key, json));
            }
            serde_json::Value::Null => {} // skip null props
        }
    }
    result
}

/// Convert a page name like "Home Page" to a function name like "HomePage".
fn page_function_name(name: &str) -> String {
    let mut result = String::new();
    let mut cap_next = true;
    for ch in name.chars() {
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
        "Page".to_string()
    } else if !result.ends_with("Page") {
        format!("{}Page", result)
    } else {
        result
    }
}

/// Get the filename for a page (e.g., "Home" -> "HomePage.tsx").
pub fn page_filename(name: &str) -> String {
    format!("{}.tsx", page_function_name(name))
}
