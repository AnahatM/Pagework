/// Theme code generator
/// Generates Theme.css and index.css from the manifest theme config.

use crate::manifest::schema::ThemeConfig;

/// Generate Theme.css content.
pub fn generate_theme_css(theme: &ThemeConfig) -> String {
    let mut out = String::new();

    // Global colors
    out.push_str(":root {\n");
    out.push_str(&format!("  --positive: {};\n", theme.global.positive));
    out.push_str(&format!("  --positive-dark: {};\n", theme.global.positive_dark));
    out.push_str(&format!("  --positive-light: {};\n", theme.global.positive_light));
    out.push_str(&format!("  --positive-translucent: {};\n", theme.global.positive_translucent));
    out.push('\n');
    out.push_str(&format!("  --warning: {};\n", theme.global.warning));
    out.push_str(&format!("  --warning-dark: {};\n", theme.global.warning_dark));
    out.push_str(&format!("  --warning-light: {};\n", theme.global.warning_light));
    out.push_str(&format!("  --warning-translucent: {};\n", theme.global.warning_translucent));
    out.push('\n');
    out.push_str(&format!("  --negative: {};\n", theme.global.negative));
    out.push_str(&format!("  --negative-dark: {};\n", theme.global.negative_dark));
    out.push_str(&format!("  --negative-light: {};\n", theme.global.negative_light));
    out.push_str(&format!("  --negative-translucent: {};\n", theme.global.negative_translucent));
    out.push_str("}\n\n");

    // Light theme
    out.push_str(":root[data-theme=\"light\"] {\n");
    write_color_set(&theme.light, &mut out);
    out.push_str("}\n\n");

    // Dark theme
    out.push_str(":root[data-theme=\"dark\"] {\n");
    write_color_set(&theme.dark, &mut out);
    out.push_str("}\n");

    out
}

fn write_color_set(colors: &crate::manifest::schema::ThemeColorSet, out: &mut String) {
    out.push_str(&format!("  --page-background: {};\n", colors.page_background));
    out.push('\n');
    out.push_str(&format!("  --panel-background: {};\n", colors.panel_background));
    out.push_str(&format!("  --panel-background-translucent: {};\n", colors.panel_background_translucent));
    out.push_str(&format!("  --panel-shadow-light: {};\n", colors.panel_shadow_light));
    out.push_str(&format!("  --panel-shadow-dark: {};\n", colors.panel_shadow_dark));
    out.push_str(&format!("  --outline: {};\n", colors.outline));
    out.push('\n');
    out.push_str(&format!("  --primary: {};\n", colors.primary));
    out.push_str(&format!("  --inverse-primary: {};\n", colors.inverse_primary));
    out.push_str(&format!("  --secondary: {};\n", colors.secondary));
    out.push('\n');
    out.push_str(&format!("  --text: {};\n", colors.text));
    out.push_str(&format!("  --text-selection: {};\n", colors.text_selection));
    out.push('\n');
    out.push_str(&format!("  --grid-background-lines: {};\n", colors.grid_background_lines));
}

/// Generate index.css content with font imports and CSS variables.
pub fn generate_index_css(theme: &ThemeConfig) -> String {
    let normal_font = &theme.fonts.normal;
    let display_font = &theme.fonts.display;

    // Build Google Fonts URL from font names
    let font_url = build_google_fonts_url(normal_font, display_font);

    let mut out = String::new();

    if !font_url.is_empty() {
        out.push_str(&format!("@import url(\"{}\");\n", font_url));
    }
    out.push_str("@import \"./styles/Theme.css\";\n");
    out.push_str("@import \"./styles/Resets.css\";\n\n");

    out.push_str(":root {\n");
    out.push_str(&format!(
        "  --font-normal: \"{}\", \"Roboto\", Arial, sans-serif;\n",
        normal_font
    ));
    out.push_str(&format!(
        "  --font-display: \"{}\", \"Oswald\", Monospace, sans-serif;\n",
        display_font
    ));
    out.push_str("  --font-size-normal: 10.5pt;\n");
    out.push_str("  --font-weight-normal: 300;\n\n");
    out.push_str("  --mobile-width: 820px;\n");
    out.push_str("  --tablet-width: 1080px;\n");
    out.push_str("  --max-width: 1200px;\n");
    out.push_str("}\n");

    out
}

/// Build a Google Fonts import URL for the given font families.
fn build_google_fonts_url(normal: &str, display: &str) -> String {
    let mut families = Vec::new();

    let normal_param = font_to_google_param(normal);
    if !normal_param.is_empty() {
        families.push(normal_param);
    }

    let display_param = font_to_google_param(display);
    if !display_param.is_empty() && display != normal {
        families.push(display_param);
    }

    if families.is_empty() {
        return String::new();
    }

    format!(
        "https://fonts.googleapis.com/css2?{}&display=swap",
        families.join("&")
    )
}

/// Convert a font name to a Google Fonts URL parameter.
fn font_to_google_param(font: &str) -> String {
    let trimmed = font.trim();
    if trimmed.is_empty() {
        return String::new();
    }
    // Replace spaces with + for URL
    let encoded = trimmed.replace(' ', "+");
    format!("family={}:wght@100..900", encoded)
}
