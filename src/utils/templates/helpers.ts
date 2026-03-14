import type {
  ComponentInstance,
  PageConfig,
  SiteBuilderManifest,
} from "@/types/manifest";

let _counter = 0;

export function uid(prefix = "c"): string {
  return `${prefix}_${Date.now().toString(36)}_${(++_counter).toString(36)}`;
}

export function component(
  type: string,
  props: Record<string, unknown> = {},
  children: ComponentInstance[] = [],
): ComponentInstance {
  return { id: uid("comp"), type, props, children };
}

export function page(
  overrides: Partial<PageConfig> & { name: string; path: string },
): PageConfig {
  return {
    id: uid("page"),
    title: "",
    metaDescription: "",
    isHomePage: false,
    components: [],
    ...overrides,
  };
}

export const DEFAULT_THEME = {
  fonts: { normal: "Inter", display: "Geist Mono" },
  light: {
    "page-background": "#eaeaea",
    "panel-background": "#b0b0b0",
    "panel-background-translucent": "#b0b0b083",
    "panel-shadow-light": "#c0c0c0",
    "panel-shadow-dark": "#808080",
    outline: "#707070",
    primary: "#1a1a1a",
    "inverse-primary": "#eaeaea",
    secondary: "#363636",
    text: "#050505",
    "text-selection": "#c0c0c0",
    "grid-background-lines": "#b0b0b0",
  },
  dark: {
    "page-background": "#0a0a0a",
    "panel-background": "#141414",
    "panel-background-translucent": "#1a1a1a65",
    "panel-shadow-light": "#1e1e1e",
    "panel-shadow-dark": "#0e0e0e",
    outline: "#2a2a2a",
    primary: "#a0a0a0",
    "inverse-primary": "#141414",
    secondary: "#707070",
    text: "#c0c0c0",
    "text-selection": "#3a3a3a",
    "grid-background-lines": "#353535",
  },
  global: {
    positive: "#00b35c",
    "positive-dark": "#10814b",
    "positive-light": "#30e28c",
    "positive-translucent": "#00b35c24",
    warning: "#ffb300",
    "warning-dark": "#eea700",
    "warning-light": "#ffc643",
    "warning-translucent": "#ffb30024",
    negative: "#fb3250",
    "negative-dark": "#cc0523",
    "negative-light": "#ff7a8e",
    "negative-translucent": "#fb325024",
  },
};

const DEFAULT_FOOTER = {
  columns: [
    {
      id: uid("fcol"),
      header: "Navigation",
      links: [
        {
          id: uid("fl"),
          label: "Home",
          url: "/",
          openInNewTab: false,
          tooltip: "Go home",
        },
      ],
    },
  ],
  socialLinks: [],
};

const DEFAULT_ASSETS = {
  categories: {
    banners: { path: "/assets/banners" },
    graphics: { path: "/assets/graphics" },
    icons: { path: "/assets/icons" },
    socials: { path: "/assets/socials" },
    images: { path: "/assets/images" },
  },
};

export function baseManifest(projectName: string): SiteBuilderManifest {
  return {
    version: 1,
    projectName,
    siteSettings: {
      siteTitle: projectName,
      authorName: "",
      siteDescription: "",
      copyrightText: `© ${new Date().getFullYear()}`,
      faviconPath: "/favicon.ico",
    },
    theme: DEFAULT_THEME,
    navigation: {
      logoPath: "/assets/icons/PageworkLogo_White.png",
      navItems: [
        {
          id: uid("nav"),
          linkName: "Home",
          path: "/",
          linkIcon: "",
          subPages: [],
        },
      ],
    },
    footer: DEFAULT_FOOTER,
    pages: [],
    assets: DEFAULT_ASSETS,
  };
}
