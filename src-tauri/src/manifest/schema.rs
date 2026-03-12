use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/* ═══════════════════════════════════════════
   Manifest Schema (Rust)
   Mirrors TypeScript types in src/types/manifest.ts
   ═══════════════════════════════════════════ */

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SiteBuilderManifest {
    pub version: u32,
    pub project_name: String,
    pub site_settings: SiteSettings,
    pub theme: ThemeConfig,
    pub navigation: NavigationConfig,
    pub footer: FooterConfig,
    pub pages: Vec<PageConfig>,
    pub assets: AssetsConfig,
}

// ── Site Settings ────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SiteSettings {
    pub site_title: String,
    pub author_name: String,
    pub site_description: String,
    pub copyright_text: String,
    pub favicon_path: String,
}

// ── Theme ────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeConfig {
    pub fonts: ThemeFonts,
    pub light: ThemeColorSet,
    pub dark: ThemeColorSet,
    pub global: ThemeGlobalColors,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeFonts {
    pub normal: String,
    pub display: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct ThemeColorSet {
    pub page_background: String,
    pub panel_background: String,
    pub panel_background_translucent: String,
    pub panel_shadow_light: String,
    pub panel_shadow_dark: String,
    pub outline: String,
    pub primary: String,
    pub inverse_primary: String,
    pub secondary: String,
    pub text: String,
    pub text_selection: String,
    pub grid_background_lines: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct ThemeGlobalColors {
    pub positive: String,
    pub positive_dark: String,
    pub positive_light: String,
    pub positive_translucent: String,
    pub warning: String,
    pub warning_dark: String,
    pub warning_light: String,
    pub warning_translucent: String,
    pub negative: String,
    pub negative_dark: String,
    pub negative_light: String,
    pub negative_translucent: String,
}

// ── Navigation ───────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NavigationConfig {
    pub logo_path: String,
    pub nav_items: Vec<NavItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NavItem {
    pub id: String,
    pub link_name: String,
    pub path: String,
    pub link_icon: String,
    pub sub_pages: Vec<NavItem>,
}

// ── Footer ───────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FooterConfig {
    pub columns: Vec<FooterColumn>,
    pub social_links: Vec<SocialLink>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FooterColumn {
    pub id: String,
    pub header: String,
    pub links: Vec<FooterLink>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FooterLink {
    pub id: String,
    pub label: String,
    pub url: String,
    pub open_in_new_tab: bool,
    pub tooltip: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialLink {
    pub id: String,
    pub platform: String,
    pub url: String,
    pub icon_path: String,
}

// ── Pages ────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PageConfig {
    pub id: String,
    pub name: String,
    pub path: String,
    pub title: String,
    pub meta_description: String,
    pub is_home_page: bool,
    pub components: Vec<ComponentInstance>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blog_config: Option<BlogConfig>,
}

// ── Components ───────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ComponentInstance {
    pub id: String,
    #[serde(rename = "type")]
    pub component_type: String,
    pub props: HashMap<String, serde_json::Value>,
    pub children: Vec<ComponentInstance>,
}

// ── Blog ─────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlogConfig {
    pub posts: Vec<BlogPost>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlogPost {
    pub id: String,
    pub slug: String,
    pub title: String,
    pub date: String,
    pub excerpt: String,
    pub cover_image_path: String,
    pub components: Vec<ComponentInstance>,
}

// ── Assets ───────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssetsConfig {
    pub categories: HashMap<String, AssetCategory>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssetCategory {
    pub path: String,
}
