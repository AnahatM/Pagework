/* ═══════════════════════════════════════════
   Starter Template Generators
   Produce default SiteBuilderManifest for each template type
   ═══════════════════════════════════════════ */

import type {
  ComponentInstance,
  PageConfig,
  ProjectTemplate,
  SiteBuilderManifest,
} from "@/types/manifest";

/* ── Helpers ──────────────────────────────── */

let _counter = 0;
function uid(prefix = "c"): string {
  return `${prefix}_${Date.now().toString(36)}_${(++_counter).toString(36)}`;
}

function component(
  type: string,
  props: Record<string, unknown> = {},
  children: ComponentInstance[] = [],
): ComponentInstance {
  return { id: uid("comp"), type, props, children };
}

function page(
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

/* ── Shared defaults ─────────────────────── */

const DEFAULT_THEME = {
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

function baseManifest(projectName: string): SiteBuilderManifest {
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

/* ══════════════════════════════════════════════
   Template Generators
   ══════════════════════════════════════════════ */

function blankTemplate(projectName: string): SiteBuilderManifest {
  const m = baseManifest(projectName);
  m.pages = [
    page({
      name: "Home",
      path: "/",
      isHomePage: true,
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", {
            title: "Welcome",
            subtitle: "Get started by adding components.",
          }),
        ]),
      ],
    }),
  ];
  return m;
}

function portfolioTemplate(projectName: string): SiteBuilderManifest {
  const m = baseManifest(projectName);
  m.siteSettings.siteDescription = "My personal portfolio";
  m.navigation.navItems = [
    { id: uid("nav"), linkName: "Home", path: "/", linkIcon: "", subPages: [] },
    {
      id: uid("nav"),
      linkName: "Projects",
      path: "/projects",
      linkIcon: "",
      subPages: [],
    },
    {
      id: uid("nav"),
      linkName: "About",
      path: "/about",
      linkIcon: "",
      subPages: [],
    },
  ];
  m.pages = [
    page({
      name: "Home",
      path: "/",
      isHomePage: true,
      components: [
        component("Banner", { altText: "Banner", showScrollHint: true }, [
          component("BannerHeader", {
            preHeadingText: "Hello, I'm",
            titleText: projectName,
            subtitleText: "Developer & Designer",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "About Me" }),
          component("TextParagraph", {
            text: "Welcome to my portfolio. Add a description about yourself here.",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Featured Projects" }),
          component("TextParagraph", {
            text: "Showcase your best work here.",
          }),
        ]),
      ],
    }),
    page({
      name: "Projects",
      path: "/projects",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "All Projects" }),
          component("TextParagraph", {
            text: "Add your project details here.",
          }),
        ]),
      ],
    }),
    page({
      name: "About",
      path: "/about",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "About" }),
          component("TextParagraph", {
            text: "Tell your story here.",
          }),
        ]),
      ],
    }),
  ];
  return m;
}

function landingPageTemplate(projectName: string): SiteBuilderManifest {
  const m = baseManifest(projectName);
  m.siteSettings.siteDescription = "Landing page";
  m.pages = [
    page({
      name: "Home",
      path: "/",
      isHomePage: true,
      components: [
        component("Banner", { altText: "Hero", showScrollHint: true }, [
          component("BannerHeader", {
            titleText: projectName,
            subtitleText: "Your tagline goes here",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Features", align: "center" }),
          component("DynamicSectionRow", { gap: 20, minSectionWidth: 250 }, [
            component("GenericSection", {}, [
              component("SectionHeader", { title: "Feature 1" }),
              component("TextParagraph", { text: "Description of feature 1." }),
            ]),
            component("GenericSection", {}, [
              component("SectionHeader", { title: "Feature 2" }),
              component("TextParagraph", { text: "Description of feature 2." }),
            ]),
            component("GenericSection", {}, [
              component("SectionHeader", { title: "Feature 3" }),
              component("TextParagraph", { text: "Description of feature 3." }),
            ]),
          ]),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Get Started", align: "center" }),
          component("TextParagraph", {
            text: "Ready to begin? Click below.",
            centered: true,
          }),
          component("FlexRow", { justifyContent: "center" }, [
            component("LinkButton", {
              linktext: "Get Started",
              href: "#",
              backgroundType: "primary",
            }),
          ]),
        ]),
      ],
    }),
  ];
  return m;
}

function blogTemplate(projectName: string): SiteBuilderManifest {
  const m = baseManifest(projectName);
  m.siteSettings.siteDescription = "My blog";
  m.navigation.navItems = [
    { id: uid("nav"), linkName: "Home", path: "/", linkIcon: "", subPages: [] },
    {
      id: uid("nav"),
      linkName: "Blog",
      path: "/blog",
      linkIcon: "",
      subPages: [],
    },
  ];
  m.pages = [
    page({
      name: "Home",
      path: "/",
      isHomePage: true,
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Welcome to My Blog" }),
          component("TextParagraph", {
            text: "Thoughts, tutorials, and stories.",
          }),
        ]),
      ],
    }),
    page({
      name: "Blog",
      path: "/blog",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "All Posts" }),
          component("TextParagraph", {
            text: "Blog posts will appear here. Use the blog config to add posts.",
          }),
        ]),
      ],
    }),
  ];
  return m;
}

function contentCreatorTemplate(projectName: string): SiteBuilderManifest {
  const m = baseManifest(projectName);
  m.siteSettings.siteDescription = "Content creator page";
  m.navigation.navItems = [
    { id: uid("nav"), linkName: "Home", path: "/", linkIcon: "", subPages: [] },
    {
      id: uid("nav"),
      linkName: "Videos",
      path: "/videos",
      linkIcon: "",
      subPages: [],
    },
    {
      id: uid("nav"),
      linkName: "About",
      path: "/about",
      linkIcon: "",
      subPages: [],
    },
  ];
  m.pages = [
    page({
      name: "Home",
      path: "/",
      isHomePage: true,
      components: [
        component("Banner", { altText: "Banner" }, [
          component("BannerHeader", {
            titleText: projectName,
            subtitleText: "Creator • Educator • Entertainer",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Latest Content" }),
          component("TextParagraph", {
            text: "Embed your latest videos and content here.",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Stats" }),
          component(
            "FlexRow",
            { gap: 40, justifyContent: "center", wrap: "wrap" },
            [
              component("NumberDisplay", {
                displayNumber: "100K+",
                numberLabel: "Subscribers",
              }),
              component("NumberDisplay", {
                displayNumber: "500+",
                numberLabel: "Videos",
              }),
              component("NumberDisplay", {
                displayNumber: "10M+",
                numberLabel: "Views",
              }),
            ],
          ),
        ]),
      ],
    }),
    page({
      name: "Videos",
      path: "/videos",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "All Videos" }),
          component("TextParagraph", {
            text: "Add video embeds and descriptions here.",
          }),
        ]),
      ],
    }),
    page({
      name: "About",
      path: "/about",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "About Me" }),
          component("TextParagraph", {
            text: "Share your story and background here.",
          }),
        ]),
      ],
    }),
  ];
  return m;
}

/* ── Public API ───────────────────────────── */

export function generateTemplateManifest(
  template: ProjectTemplate,
  projectName: string,
): SiteBuilderManifest {
  switch (template) {
    case "blank":
      return blankTemplate(projectName);
    case "portfolio":
      return portfolioTemplate(projectName);
    case "landing-page":
      return landingPageTemplate(projectName);
    case "blog":
      return blogTemplate(projectName);
    case "content-creator":
      return contentCreatorTemplate(projectName);
  }
}

export interface TemplateInfo {
  id: ProjectTemplate;
  name: string;
  description: string;
  pageCount: number;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "blank",
    name: "Blank",
    description: "Empty project with one page.",
    pageCount: 1,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Personal portfolio with projects and about sections.",
    pageCount: 3,
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Single-page marketing site with features and CTA.",
    pageCount: 1,
  },
  {
    id: "blog",
    name: "Blog",
    description: "Blog-ready site with post listing.",
    pageCount: 2,
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Showcase videos, stats, and social links.",
    pageCount: 3,
  },
];
