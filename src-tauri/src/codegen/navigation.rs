/// Navigation code generator
/// Generates NavigationConfiguration.json from the manifest navigation config.

use crate::manifest::schema::{NavigationConfig, NavItem};

/// Generate NavigationConfiguration.json content.
pub fn generate_navigation(nav: &NavigationConfig) -> String {
    let json_items: Vec<serde_json::Value> = nav
        .nav_items
        .iter()
        .map(nav_item_to_json)
        .collect();

    let root = serde_json::json!({
        "navItems": json_items,
        "otherPages": []
    });

    serde_json::to_string_pretty(&root).unwrap_or_else(|_| "{}".to_string())
}

fn nav_item_to_json(item: &NavItem) -> serde_json::Value {
    let mut obj = serde_json::json!({
        "linkName": item.link_name,
        "path": item.path,
        "linkIcon": item.link_icon,
    });

    if !item.sub_pages.is_empty() {
        let subs: Vec<serde_json::Value> = item
            .sub_pages
            .iter()
            .map(nav_item_to_json)
            .collect();
        obj["subPages"] = serde_json::Value::Array(subs);
    }

    obj
}
