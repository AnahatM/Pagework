/// Footer code generator
/// Generates FooterConfiguration.ts from the manifest footer config.

use crate::manifest::schema::FooterConfig;

/// Generate FooterConfiguration.ts content.
pub fn generate_footer(footer: &FooterConfig) -> String {
    let mut out = String::new();

    // Interfaces
    out.push_str("export interface FooterLinkData {\n");
    out.push_str("  label: string;\n");
    out.push_str("  url: string;\n");
    out.push_str("  openInNewTab?: boolean;\n");
    out.push_str("  tooltip?: string;\n");
    out.push_str("}\n\n");

    out.push_str("export interface FooterColumnData {\n");
    out.push_str("  header: string;\n");
    out.push_str("  links: FooterLinkData[];\n");
    out.push_str("}\n\n");

    // Footer columns data
    out.push_str("export const footerColumns: FooterColumnData[] = [\n");
    for col in &footer.columns {
        out.push_str("  {\n");
        out.push_str(&format!("    header: \"{}\",\n", escape_str(&col.header)));
        out.push_str("    links: [\n");
        for link in &col.links {
            out.push_str("      { ");
            out.push_str(&format!("label: \"{}\", ", escape_str(&link.label)));
            out.push_str(&format!("url: \"{}\"", escape_str(&link.url)));
            if link.open_in_new_tab {
                out.push_str(", openInNewTab: true");
            }
            if !link.tooltip.is_empty() {
                out.push_str(&format!(", tooltip: \"{}\"", escape_str(&link.tooltip)));
            }
            out.push_str(" },\n");
        }
        out.push_str("    ],\n");
        out.push_str("  },\n");
    }
    out.push_str("];\n");

    // Social links export
    out.push_str("\nexport interface SocialLinkData {\n");
    out.push_str("  platform: string;\n");
    out.push_str("  url: string;\n");
    out.push_str("  iconPath: string;\n");
    out.push_str("}\n\n");

    out.push_str("export const socialLinks: SocialLinkData[] = [\n");
    for social in &footer.social_links {
        out.push_str(&format!(
            "  {{ platform: \"{}\", url: \"{}\", iconPath: \"{}\" }},\n",
            escape_str(&social.platform),
            escape_str(&social.url),
            escape_str(&social.icon_path),
        ));
    }
    out.push_str("];\n");

    out
}

fn escape_str(s: &str) -> String {
    s.replace('\\', "\\\\").replace('"', "\\\"")
}
