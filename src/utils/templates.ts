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

function componentDemoTemplate(projectName: string): SiteBuilderManifest {
  const m = baseManifest(projectName);
  m.siteSettings.siteDescription =
    "A demo website showcasing every available component.";
  m.navigation.navItems = [
    { id: uid("nav"), linkName: "Home", path: "/", linkIcon: "", subPages: [] },
    {
      id: uid("nav"),
      linkName: "Content",
      path: "/content",
      linkIcon: "",
      subPages: [],
    },
    {
      id: uid("nav"),
      linkName: "Data",
      path: "/data",
      linkIcon: "",
      subPages: [],
    },
    {
      id: uid("nav"),
      linkName: "Layout",
      path: "/layout",
      linkIcon: "",
      subPages: [],
    },
  ];
  m.pages = [
    // ── Page 1: Home — Banner, headers, text ──
    page({
      name: "Home",
      path: "/",
      isHomePage: true,
      components: [
        component("Banner", { altText: "Hero Banner", showScrollHint: true }, [
          component("BannerHeader", {
            preHeadingText: "Welcome to",
            titleText: projectName,
            subtitleText: "A showcase of every component",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", {
            title: "Section Header",
            subtitle: "With an optional subtitle and pre-heading.",
            preHeading: "DEMO",
            linkButtonUrl: "#",
            linkButtonText: "Learn More",
          }),
          component("TextParagraph", {
            text: "This is a **TextParagraph** component. It supports basic text content and is the primary way to add body copy to your pages.",
          }),
          component("LargeText", {
            text: "Large Text stands out.",
            widthPercent: 100,
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Number Displays" }),
          component(
            "FlexRow",
            { gap: 40, justifyContent: "center", wrap: "wrap" },
            [
              component("NumberDisplay", {
                displayNumber: "42",
                numberLabel: "Components",
              }),
              component("NumberDisplay", {
                displayNumber: "∞",
                numberLabel: "Possibilities",
              }),
              component("NumberDisplay", {
                displayNumber: "0",
                numberLabel: "Limits",
              }),
            ],
          ),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Buttons & Links" }),
          component(
            "FlexRow",
            { gap: 12, justifyContent: "flex-start", wrap: "wrap" },
            [
              component("LinkButton", {
                linktext: "Primary Button",
                href: "#",
                backgroundType: "primary",
              }),
              component("LinkButton", {
                linktext: "Secondary",
                href: "#",
                backgroundType: "secondary",
              }),
              component("LinkButton", {
                linktext: "Positive",
                href: "#",
                backgroundType: "positive",
              }),
              component("LinkButton", {
                linktext: "Warning",
                href: "#",
                backgroundType: "warning",
              }),
              component("LinkButton", {
                linktext: "Negative",
                href: "#",
                backgroundType: "negative",
              }),
            ],
          ),
        ]),
      ],
    }),

    // ── Page 2: Content — media, code, carousel ──
    page({
      name: "Content",
      path: "/content",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Code Block" }),
          component("CopyCodeBox", {
            code: 'const greeting = "Hello, World!";\nconsole.log(greeting);',
          }),
        ]),
        component(
          "SectionWithImage",
          {
            imageUrl: "",
            altText: "Demo image",
            imagePosition: "right",
            imageStyle: "floating",
          },
          [
            component("SectionHeader", { title: "Section with Image" }),
            component("TextParagraph", {
              text: "This layout places content on one side and an image on the other. Set an image URL in the inspector to see it.",
            }),
          ],
        ),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Video Embed" }),
          component("VideoEmbed", {
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            title: "Sample Video",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Image Carousel" }),
          component("ImageCarousel", {
            images: [
              { url: "", alt: "Slide 1", caption: "First slide" },
              { url: "", alt: "Slide 2", caption: "Second slide" },
              { url: "", alt: "Slide 3", caption: "Third slide" },
            ],
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Collapsible / Accordion" }),
          component(
            "Collapsible",
            {
              title: "Click to expand",
              openByDefault: false,
            },
            [
              component("TextParagraph", {
                text: "This content is hidden until the user clicks the header. Great for FAQs.",
              }),
            ],
          ),
          component(
            "Collapsible",
            {
              title: "Another collapsible section",
              openByDefault: true,
            },
            [
              component("TextParagraph", {
                text: "This one starts open by default.",
              }),
            ],
          ),
        ]),
      ],
    }),

    // ── Page 3: Data — table, list ──
    page({
      name: "Data",
      path: "/data",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Data Table" }),
          component("Table", {
            columns: [
              { header: "Name", key: "name" },
              { header: "Type", key: "type" },
              { header: "Category", key: "category" },
            ],
            data: [
              { name: "Banner", type: "Content", category: "Hero" },
              { name: "Table", type: "Data", category: "Display" },
              { name: "TextParagraph", type: "Text", category: "Body" },
              { name: "LinkButton", type: "Interactive", category: "Action" },
            ],
            showBorders: true,
            alternatingRows: true,
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Decorated List" }),
          component("DecoratedList", {
            items: [
              {
                title: "First Item",
                description: "A description for the first item.",
              },
              {
                title: "Second Item",
                description: "A description for the second item.",
              },
              {
                title: "Third Item",
                description: "A description for the third item.",
              },
            ],
          }),
        ]),
      ],
    }),

    // ── Page 4: Layout — split, dynamic row, scroll, grid, invisible ──
    page({
      name: "Layout",
      path: "/layout",
      components: [
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Split Section" }),
        ]),
        component("SplitSection", {}, [
          component("GenericSection", {}, [
            component("SectionHeader", { title: "Left Column" }),
            component("TextParagraph", {
              text: "SplitSection creates a two-column layout that stacks on mobile.",
            }),
          ]),
          component("GenericSection", {}, [
            component("SectionHeader", { title: "Right Column" }),
            component("TextParagraph", {
              text: "Each side can contain its own set of components.",
            }),
          ]),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Dynamic Section Row" }),
        ]),
        component("DynamicSectionRow", { gap: 20, minSectionWidth: 250 }, [
          component("GenericSection", {}, [
            component("SectionHeader", { title: "Card 1" }),
            component("TextParagraph", { text: "Auto-wrapping grid." }),
          ]),
          component("GenericSection", {}, [
            component("SectionHeader", { title: "Card 2" }),
            component("TextParagraph", { text: "Responsive columns." }),
          ]),
          component("GenericSection", {}, [
            component("SectionHeader", { title: "Card 3" }),
            component("TextParagraph", { text: "Minimum width control." }),
          ]),
        ]),
        component("InvisibleSection", {}, [
          component("SectionHeader", { title: "Invisible Section" }),
          component("TextParagraph", {
            text: "This section has no visible panel styling — content floats directly on the page background.",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Scrollable Container" }),
          component(
            "ScrollableContainer",
            { maxHeight: "200px", enableBorder: true, showScrollHint: true },
            [
              component("TextParagraph", {
                text: "Line 1: This container scrolls when content overflows.",
              }),
              component("TextParagraph", {
                text: "Line 2: Keep adding content to see scrolling.",
              }),
              component("TextParagraph", {
                text: "Line 3: The scroll hint fades at the bottom.",
              }),
              component("TextParagraph", {
                text: "Line 4: Useful for limiting tall content areas.",
              }),
              component("TextParagraph", {
                text: "Line 5: The max height is configurable.",
              }),
            ],
          ),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Sized Box Spacer" }),
          component("TextParagraph", { text: "Above the spacer." }),
          component("SizedBox", { height: 60 }),
          component("TextParagraph", { text: "Below the 60px spacer." }),
        ]),
        component("GridBackground", {}, [
          component("GenericSection", {}, [
            component("SectionHeader", { title: "Grid Background" }),
            component("TextParagraph", {
              text: "This section has a grid pattern background behind it.",
            }),
          ]),
        ]),
      ],
    }),
  ];
  return m;
}

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
    case "component-demo":
      return componentDemoTemplate(projectName);
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
  {
    id: "component-demo",
    name: "Component Demo",
    description: "Showcases every available component for testing.",
    pageCount: 4,
  },
];
