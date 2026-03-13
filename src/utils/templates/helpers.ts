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
    "page-background": "#e7e7f7",
    "panel-background": "#ababc4",
    "panel-background-translucent": "#ababc483",
    "panel-shadow-light": "#bdbdd3",
    "panel-shadow-dark": "#7c7c9c",
    outline: "#6c6c86",
    primary: "#1d1d27",
    "inverse-primary": "#e7e7f7",
    secondary: "#333342",
    text: "#050315",
    "text-selection": "#bdbdd3",
    "grid-background-lines": "#ababc4",
  },
  dark: {
    "page-background": "#050315",
    "panel-background": "#0a081c",
    "panel-background-translucent": "#12102565",
    "panel-shadow-light": "#14113a",
    "panel-shadow-dark": "#0c0a26",
    outline: "#1f1b42",
    primary: "#9a98c2",
    "inverse-primary": "#0a081c",
    secondary: "#6c6ca1",
    text: "#bdbdd3",
    "text-selection": "#3a3a52",
    "grid-background-lines": "#353355",
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
      logoPath: "",
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
