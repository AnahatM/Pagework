/* ═══════════════════════════════════════════
   Manifest Types
   Single source of truth for sitebuilder.project.json
   ═══════════════════════════════════════════ */

/** Top-level manifest schema */
export interface SiteBuilderManifest {
  version: number;
  projectName: string;
  siteSettings: SiteSettings;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  footer: FooterConfig;
  pages: PageConfig[];
  assets: AssetsConfig;
  blogConfig?: BlogConfig;
}

/* ── Site Settings ───────────────────────── */

export interface SiteSettings {
  siteTitle: string;
  authorName: string;
  siteDescription: string;
  copyrightText: string;
  faviconPath: string;
}

/* ── Theme ───────────────────────────────── */

export interface ThemeConfig {
  fonts: ThemeFonts;
  light: ThemeColorSet;
  dark: ThemeColorSet;
  global: ThemeGlobalColors;
}

export interface ThemeFonts {
  normal: string;
  display: string;
}

export interface ThemeColorSet {
  "page-background": string;
  "panel-background": string;
  "panel-background-translucent": string;
  "panel-shadow-light": string;
  "panel-shadow-dark": string;
  outline: string;
  primary: string;
  "inverse-primary": string;
  secondary: string;
  text: string;
  "text-selection": string;
  "grid-background-lines": string;
}

export interface ThemeGlobalColors {
  positive: string;
  "positive-dark": string;
  "positive-light": string;
  "positive-translucent": string;
  warning: string;
  "warning-dark": string;
  "warning-light": string;
  "warning-translucent": string;
  negative: string;
  "negative-dark": string;
  "negative-light": string;
  "negative-translucent": string;
}

/* ── Navigation ──────────────────────────── */

export interface NavigationConfig {
  logoPath: string;
  navItems: NavItem[];
}

export interface NavItem {
  id: string;
  linkName: string;
  path: string;
  linkIcon: string;
  subPages: NavItem[];
}

/* ── Footer ──────────────────────────────── */

export interface FooterConfig {
  columns: FooterColumn[];
  socialLinks: SocialLink[];
}

export interface FooterColumn {
  id: string;
  header: string;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  openInNewTab: boolean;
  tooltip: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconPath: string;
}

/* ── Pages ───────────────────────────────── */

export interface PageConfig {
  id: string;
  name: string;
  path: string;
  title: string;
  metaDescription: string;
  isHomePage: boolean;
  components: ComponentInstance[];
}

/* ── Components ──────────────────────────── */

export interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: ComponentInstance[];
}

/* ── Blog ────────────────────────────────── */

export interface BlogConfig {
  posts: BlogPost[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImagePath: string;
  components: ComponentInstance[];
}

/* ── Assets ──────────────────────────────── */

export interface AssetsConfig {
  categories: Record<string, AssetCategory>;
}

export interface AssetCategory {
  path: string;
}

/* ── Project Metadata (not in manifest) ─── */

export interface RecentProject {
  name: string;
  path: string;
  lastOpened: string;
}

export interface NewProjectConfig {
  projectName: string;
  projectPath: string;
  template: ProjectTemplate;
}

export type ProjectTemplate =
  | "blank"
  | "portfolio"
  | "landing-page"
  | "blog"
  | "content-creator"
  | "component-demo";
