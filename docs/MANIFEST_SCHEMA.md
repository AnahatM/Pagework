# Pagework — Manifest Schema (`pagework.project.json`)

This document defines the complete schema for the manifest file that serves as the single source of truth for every user website project.

---

## Top-Level Schema

```jsonc
{
  "version": 1, // Schema version (for future migrations)
  "projectName": "My Portfolio",

  "siteSettings": {
    /* ... */
  }, // Global site configuration
  "theme": {
    /* ... */
  }, // Colors and fonts
  "navigation": {
    /* ... */
  }, // Navbar items
  "footer": {
    /* ... */
  }, // Footer columns, social links
  "pages": [
    /* ... */
  ], // All pages and their component trees
  "assets": {
    /* ... */
  }, // Asset metadata
}
```

---

## `siteSettings`

```jsonc
{
  "siteSettings": {
    "siteTitle": "My Portfolio", // Browser tab title (default)
    "authorName": "John Doe", // Used in footer, copyright
    "siteDescription": "A personal portfolio", // Meta description
    "copyrightText": "© 2026 John Doe", // Footer copyright line
    "faviconPath": "/favicon.ico", // Relative to public/
  },
}
```

---

## `theme`

```jsonc
{
  "theme": {
    "fonts": {
      "normal": "Inter", // --font-normal
      "display": "Geist Mono", // --font-display
    },
    "light": {
      "page-background": "#eaeaea",
      "panel-background": "#b0b0b0",
      "panel-background-translucent": "#b0b0b083",
      "panel-shadow-light": "#c0c0c0",
      "panel-shadow-dark": "#808080",
      "outline": "#707070",
      "primary": "#1a1a1a",
      "inverse-primary": "#eaeaea",
      "secondary": "#363636",
      "text": "#050505",
      "text-selection": "#c0c0c0",
      "grid-background-lines": "#b0b0b0",
    },
    "dark": {
      "page-background": "#0a0a0a",
      "panel-background": "#141414",
      "panel-background-translucent": "#1a1a1a65",
      "panel-shadow-light": "#1e1e1e",
      "panel-shadow-dark": "#0e0e0e",
      "outline": "#2a2a2a",
      "primary": "#a0a0a0",
      "inverse-primary": "#141414",
      "secondary": "#707070",
      "text": "#c0c0c0",
      "text-selection": "#3a3a3a",
      "grid-background-lines": "#353535",
    },
    "global": {
      "positive": "#00b35c",
      "positive-dark": "#10814b",
      "positive-light": "#30e28c",
      "positive-translucent": "#00b35c24",
      "warning": "#ffb300",
      "warning-dark": "#eea700",
      "warning-light": "#ffc643",
      "warning-translucent": "#ffb30024",
      "negative": "#fb3250",
      "negative-dark": "#cc0523",
      "negative-light": "#ff7a8e",
      "negative-translucent": "#fb325024",
    },
  },
}
```

---

## `navigation`

```jsonc
{
  "navigation": {
    "logoPath": "/assets/graphics/logo.png", // Navbar logo image
    "navItems": [
      {
        "id": "nav-home",
        "linkName": "Home",
        "path": "/",
        "linkIcon": "house.png", // Filename in /assets/icons/
        "subPages": [
          {
            "id": "nav-about",
            "linkName": "About",
            "path": "/about",
            "linkIcon": "person.png",
          },
        ],
      },
      {
        "id": "nav-projects",
        "linkName": "Projects",
        "path": "/projects",
        "linkIcon": "folder.png",
        "subPages": [],
      },
    ],
  },
}
```

---

## `footer`

```jsonc
{
  "footer": {
    "columns": [
      {
        "id": "footer-col-1",
        "header": "Navigation",
        "links": [
          {
            "id": "flink-1",
            "label": "Home",
            "url": "/",
            "openInNewTab": false,
            "tooltip": "Go to homepage",
          },
        ],
      },
      {
        "id": "footer-col-2",
        "header": "Social",
        "links": [
          {
            "id": "flink-2",
            "label": "GitHub",
            "url": "https://github.com/username",
            "openInNewTab": true,
            "tooltip": "View GitHub profile",
          },
        ],
      },
    ],
    "socialLinks": [
      {
        "id": "social-github",
        "platform": "github",
        "url": "https://github.com/username",
        "iconPath": "/assets/socials/github.png",
      },
      {
        "id": "social-linkedin",
        "platform": "linkedin",
        "url": "https://linkedin.com/in/username",
        "iconPath": "/assets/socials/linkedin.png",
      },
    ],
  },
}
```

---

## `pages`

```jsonc
{
  "pages": [
    {
      "id": "page-home",
      "name": "Home", // Display name in builder
      "path": "/", // URL path
      "title": "Home - My Portfolio", // Browser tab title
      "metaDescription": "Welcome to my site", // SEO meta
      "isHomePage": true, // Cannot be deleted
      "components": [
        // Component tree (see below)
      ],
    },
    {
      "id": "page-about",
      "name": "About",
      "path": "/about",
      "title": "About - My Portfolio",
      "metaDescription": "Learn more about me",
      "isHomePage": false,
      "components": [
        /* ... */
      ],
    },
  ],
}
```

---

## Component Instances

Each component in a page's `components` array follows this structure:

```jsonc
{
  "id": "comp-abc123", // Unique ID (generated UUID)
  "type": "GenericSection", // Component type (from registry)
  "props": {
    // Prop values (type-specific)
    // example for GenericSection: no own props
  },
  "children": [
    // Nested child components
    {
      "id": "comp-def456",
      "type": "SectionHeader",
      "props": {
        "title": "About Me",
        "align": "left",
      },
      "children": [],
    },
    {
      "id": "comp-ghi789",
      "type": "TextParagraph",
      "props": {
        "text": "Welcome to my portfolio!",
        "fullWidth": true,
        "maxWidth": 1200,
      },
      "children": [],
    },
  ],
}
```

### Component Instance Schema

```jsonc
{
  "id": "string", // UUID, unique within the project
  "type": "string", // Must match a key in the component registry
  "props": {
    // Key-value pairs matching the component's prop schema
    "[propName]": "any", // Value type depends on prop definition
  },
  "children": [
    // Array of nested ComponentInstance objects
    // Only allowed if the component's registry entry has `acceptsChildren: true`
  ],
}
```

---

## `assets`

Tracks metadata about imported assets (not the files themselves):

```jsonc
{
  "assets": {
    "categories": {
      "banners": { "path": "/assets/banners/" },
      "graphics": { "path": "/assets/graphics/" },
      "icons": { "path": "/assets/icons/" },
      "socials": { "path": "/assets/socials/" },
      "images": { "path": "/assets/images/" },
    },
  },
}
```

---

## Blog-Specific Schema (Blog Template)

When using the Blog template, pages can have a special `blogConfig`:

```jsonc
{
  "id": "page-blog-index",
  "name": "Blog",
  "path": "/blog",
  "title": "Blog - My Site",
  "metaDescription": "Read my latest posts",
  "isHomePage": false,
  "blogConfig": {
    "posts": [
      {
        "id": "post-001",
        "slug": "my-first-post",
        "title": "My First Blog Post",
        "date": "2026-03-12",
        "excerpt": "A brief preview of the post...",
        "coverImagePath": "/assets/images/post-cover.png",
        "components": [
          // Component tree for the post content
          {
            "id": "comp-post-header",
            "type": "SectionHeader",
            "props": { "title": "My First Blog Post" },
            "children": [],
          },
          {
            "id": "comp-post-body",
            "type": "TextParagraph",
            "props": { "text": "Full blog post content..." },
            "children": [],
          },
        ],
      },
    ],
  },
  "components": [], // Blog index page auto-generates card grid from posts
}
```

---

## Content Creator-Specific Schema

Video sections for the Content Creator template:

```jsonc
{
  "id": "comp-video-embed",
  "type": "VideoEmbed",
  "props": {
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "My Latest Video",
    "aspectRatio": "16:9",
  },
  "children": [],
}
```

---

## Full Example Manifest

```jsonc
{
  "version": 1,
  "projectName": "My Portfolio",

  "siteSettings": {
    "siteTitle": "My Portfolio",
    "authorName": "John Doe",
    "siteDescription": "Personal portfolio website",
    "copyrightText": "© 2026 John Doe",
    "faviconPath": "/favicon.ico",
  },

  "theme": {
    "fonts": {
      "normal": "Inter",
      "display": "Geist Mono",
    },
    "light": {
      "page-background": "#eaeaea",
      "panel-background": "#b0b0b0",
      "panel-background-translucent": "#b0b0b083",
      "panel-shadow-light": "#c0c0c0",
      "panel-shadow-dark": "#808080",
      "outline": "#707070",
      "primary": "#1a1a1a",
      "inverse-primary": "#eaeaea",
      "secondary": "#363636",
      "text": "#050505",
      "text-selection": "#c0c0c0",
      "grid-background-lines": "#b0b0b0",
    },
    "dark": {
      "page-background": "#0a0a0a",
      "panel-background": "#141414",
      "panel-background-translucent": "#1a1a1a65",
      "panel-shadow-light": "#1e1e1e",
      "panel-shadow-dark": "#0e0e0e",
      "outline": "#2a2a2a",
      "primary": "#a0a0a0",
      "inverse-primary": "#141414",
      "secondary": "#707070",
      "text": "#c0c0c0",
      "text-selection": "#3a3a3a",
      "grid-background-lines": "#353535",
    },
    "global": {
      "positive": "#00b35c",
      "positive-dark": "#10814b",
      "positive-light": "#30e28c",
      "positive-translucent": "#00b35c24",
      "warning": "#ffb300",
      "warning-dark": "#eea700",
      "warning-light": "#ffc643",
      "warning-translucent": "#ffb30024",
      "negative": "#fb3250",
      "negative-dark": "#cc0523",
      "negative-light": "#ff7a8e",
      "negative-translucent": "#fb325024",
    },
  },

  "navigation": {
    "logoPath": "/assets/graphics/logo.png",
    "navItems": [
      {
        "id": "nav-home",
        "linkName": "Home",
        "path": "/",
        "linkIcon": "house.png",
        "subPages": [],
      },
    ],
  },

  "footer": {
    "columns": [
      {
        "id": "footer-col-nav",
        "header": "Navigation",
        "links": [
          {
            "id": "flink-home",
            "label": "Home",
            "url": "/",
            "openInNewTab": false,
            "tooltip": "Go to homepage",
          },
        ],
      },
    ],
    "socialLinks": [],
  },

  "pages": [
    {
      "id": "page-home",
      "name": "Home",
      "path": "/",
      "title": "My Portfolio",
      "metaDescription": "Welcome to my portfolio",
      "isHomePage": true,
      "components": [
        {
          "id": "comp-001",
          "type": "GenericSection",
          "props": {},
          "children": [
            {
              "id": "comp-002",
              "type": "SectionHeader",
              "props": {
                "title": "Welcome",
                "align": "left",
              },
              "children": [],
            },
            {
              "id": "comp-003",
              "type": "TextParagraph",
              "props": {
                "text": "This is my portfolio website.",
                "fullWidth": true,
              },
              "children": [],
            },
          ],
        },
      ],
    },
  ],

  "assets": {
    "categories": {
      "banners": { "path": "/assets/banners/" },
      "graphics": { "path": "/assets/graphics/" },
      "icons": { "path": "/assets/icons/" },
      "socials": { "path": "/assets/socials/" },
      "images": { "path": "/assets/images/" },
    },
  },
}
```
