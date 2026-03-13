# Pagework — Component Registry

This document defines every component available in Pagework, how the component registry works, and planned future components.

---

## 1. Registry Architecture

The component registry is the central definition of what components exist, what props they accept, and how the inspector should render controls for them. It lives in:

- **Frontend**: `src/utils/componentRegistry.ts` — TypeScript definitions used by the inspector UI
- **Backend**: `src-tauri/src/codegen/` — Rust-side knowledge of component imports and JSX generation

### Registry Entry Schema

```typescript
interface ComponentDefinition {
  type: string; // Unique identifier (e.g., "GenericSection")
  displayName: string; // Human-friendly name shown in UI
  description: string; // Brief description for the component palette
  category: ComponentCategory; // Grouping in the palette
  icon: string; // Icon identifier for the block representation
  acceptsChildren: boolean; // Can contain nested components
  allowedChildren?: string[]; // If set, restricts which types can be nested
  allowedParents?: string[]; // If set, restricts where this can be placed
  props: PropDefinition[]; // Editable properties
}

type ComponentCategory =
  | "sections" // Layout sections (GenericSection, SplitSection, etc.)
  | "content" // Content display (Banner, SectionHeader, ImageCarousel, etc.)
  | "text" // Text components (TextParagraph, LargeText, etc.)
  | "media" // Images and video (SectionImage, VideoEmbed, etc.)
  | "interactive" // Buttons, inputs, etc. (LinkButton, CustomButton, etc.)
  | "data" // Data display (Table, NumberDisplay, DecoratedList, etc.)
  | "utility" // Spacing, layout helpers (SizedBox, FlexRow)
  | "design" // Visual/decorative (GridBackground)
  | "blog"; // Blog-specific (BlogPostCard, BlogPostContent)

interface PropDefinition {
  name: string; // Prop name (matches React component prop)
  displayName: string; // Human-friendly label
  description?: string; // Tooltip/help text
  type: PropType;
  defaultValue?: unknown; // Default when component is first added
  required: boolean;
  group?: string; // Inspector section grouping (e.g., "Layout", "Content")
}

type PropType =
  | { kind: "string" }
  | { kind: "text" } // Multi-line text area
  | { kind: "markdown" } // Multi-line with markdown syntax hints
  | { kind: "number"; min?: number; max?: number; step?: number }
  | { kind: "boolean" }
  | { kind: "select"; options: { label: string; value: string }[] }
  | { kind: "image" } // Opens file picker, stores asset path
  | { kind: "color" } // Color picker
  | { kind: "url" } // URL input with validation
  | { kind: "array"; itemSchema: PropDefinition[] }; // Array of objects sub-editor
```

---

## 2. Included Components (v1)

### 2.1 Section Components (`sections`)

These are the top-level layout containers. They accept children.

#### `GenericSection`

> Simple content wrapper with standard padding and panel styling.

| Prop                            | Type | Default | Required | Description |
| ------------------------------- | ---- | ------- | -------- | ----------- |
| _(none — content via children)_ |      |         |          |             |

- **Accepts children**: Yes (any content component)

#### `InvisibleSection`

> Content wrapper without visible panel styling. Optional blur backdrop.

| Prop   | Type    | Default | Required | Description                     |
| ------ | ------- | ------- | -------- | ------------------------------- |
| `blur` | boolean | `false` | No       | Apply blur effect to background |

- **Accepts children**: Yes

#### `SplitSection`

> Two-column equal-width layout. Stacks on mobile.

| Prop                                                                 | Type | Default | Required | Description |
| -------------------------------------------------------------------- | ---- | ------- | -------- | ----------- |
| _(columns defined by children — first half left, second half right)_ |      |         |          |             |

- **Accepts children**: Yes
- **Note**: Children are split into left/right columns. In codegen, first N/2 go to `leftContent`, rest to `rightContent`.

#### `SectionWithImage`

> Two-column layout: content on one side, large image on the other.

| Prop                   | Type                                | Default      | Required | Description                  |
| ---------------------- | ----------------------------------- | ------------ | -------- | ---------------------------- |
| `imageUrl`             | image                               | —            | Yes      | Image source                 |
| `altText`              | string                              | `""`         | No       | Image alt text               |
| `imagePosition`        | select: `left`, `right`             | `"right"`    | No       | Which side the image appears |
| `imageStyle`           | select: `floating`, `stretchToEdge` | `"floating"` | No       | Image sizing style           |
| `minImageHeight`       | number (min: 100)                   | `200`        | No       | Minimum image height in px   |
| `tintImage`            | boolean                             | `false`      | No       | Apply tint filter            |
| `removeTintOnHover`    | boolean                             | `false`      | No       | Remove tint on hover         |
| `brightenImageOnHover` | boolean                             | `false`      | No       | Brighten on hover            |

- **Accepts children**: Yes (content side)

#### `DynamicSectionRow`

> Flexible grid of section panels that auto-wrap.

| Prop              | Type    | Default | Required | Description              |
| ----------------- | ------- | ------- | -------- | ------------------------ |
| `gap`             | number  | `20`    | No       | Gap between panels in px |
| `minSectionWidth` | number  | `280`   | No       | Minimum width per panel  |
| `equalWidth`      | boolean | `true`  | No       | Force equal widths       |

- **Accepts children**: Yes (each child becomes a panel in the grid)

#### `ScrollableContainer`

> Vertically scrollable area with optional scroll hint.

| Prop             | Type    | Default   | Required | Description               |
| ---------------- | ------- | --------- | -------- | ------------------------- |
| `maxHeight`      | string  | `"600px"` | No       | Maximum height            |
| `enableBorder`   | boolean | `true`    | No       | Show border               |
| `showScrollHint` | boolean | `false`   | No       | Animated scroll indicator |

- **Accepts children**: Yes

---

### 2.2 Content Components (`content`)

#### `Banner`

> Full-width image banner with optional overlay content.

| Prop                     | Type    | Default    | Required | Description                |
| ------------------------ | ------- | ---------- | -------- | -------------------------- |
| `lightImageUrl`          | image   | —          | No       | Image for light theme      |
| `darkImageUrl`           | image   | —          | No       | Image for dark theme       |
| `imageUrl`               | image   | —          | No       | Fallback image (any theme) |
| `altText`                | string  | `"Banner"` | Yes      | Alt text                   |
| `maxHeightPx`            | number  | —          | No       | Maximum banner height      |
| `showScrollHint`         | boolean | `false`    | No       | Show scroll-down animation |
| `hideScrollHintOnScroll` | boolean | `false`    | No       | Auto-hide hint on scroll   |

- **Accepts children**: Yes (overlay content like BannerHeader)

#### `BannerHeader`

> Text overlay for use inside Banner.

| Prop             | Type   | Default | Required | Description            |
| ---------------- | ------ | ------- | -------- | ---------------------- |
| `preHeadingText` | string | —       | No       | Small text above title |
| `titleText`      | string | —       | Yes      | Main title             |
| `subtitleText`   | string | —       | No       | Subtitle/tagline       |

- **Accepts children**: No
- **Allowed parents**: `Banner`

#### `SectionHeader`

> Section title with optional subtitle and link button.

| Prop                    | Type                     | Default  | Required | Description                    |
| ----------------------- | ------------------------ | -------- | -------- | ------------------------------ |
| `title`                 | string                   | —        | Yes      | Section title                  |
| `subtitle`              | string                   | —        | No       | Subtitle text                  |
| `preHeading`            | string                   | —        | No       | Pre-heading text               |
| `align`                 | select: `left`, `center` | `"left"` | No       | Text alignment                 |
| `linkButtonUrl`         | url                      | —        | No       | Optional button URL            |
| `linkButtonText`        | string                   | —        | No       | Optional button text           |
| `linkButtonAlwaysBelow` | boolean                  | `false`  | No       | Button below instead of inline |

- **Accepts children**: No

#### `ImageCarousel`

> Slideshow with navigation controls.

| Prop               | Type                                                     | Default | Required | Description                |
| ------------------ | -------------------------------------------------------- | ------- | -------- | -------------------------- |
| `images`           | array: `[{path: image, caption?: string, alt?: string}]` | `[]`    | Yes      | Carousel images            |
| `autoScroll`       | boolean                                                  | `false` | No       | Auto-advance slides        |
| `autoScrollTimeMS` | number (min: 500)                                        | `3000`  | No       | Delay between slides in ms |

- **Accepts children**: No

#### `NumberDisplay`

> Large number with descriptive label.

| Prop            | Type   | Default | Required | Description                      |
| --------------- | ------ | ------- | -------- | -------------------------------- |
| `displayNumber` | string | —       | Yes      | Number to display (e.g., "100+") |
| `numberLabel`   | string | —       | Yes      | Label below number               |
| `miniText`      | string | —       | No       | Small text below label           |

- **Accepts children**: No

---

### 2.3 Text Components (`text`)

#### `TextParagraph`

> Rich text paragraph with markdown support.

| Prop           | Type                             | Default  | Required | Description                                                      |
| -------------- | -------------------------------- | -------- | -------- | ---------------------------------------------------------------- |
| `text`         | markdown                         | —        | Yes      | Text content (supports **bold**, _italic_, _underline_, [links]) |
| `highlight`    | boolean                          | `false`  | No       | Highlight style                                                  |
| `bold`         | boolean                          | `false`  | No       | Bold all text                                                    |
| `centered`     | boolean                          | `false`  | No       | Center align                                                     |
| `italic`       | boolean                          | `false`  | No       | Italicize all                                                    |
| `uppercase`    | boolean                          | `false`  | No       | Uppercase transform                                              |
| `maxWidth`     | number                           | `650`    | No       | Max width in px                                                  |
| `fullWidth`    | boolean                          | `true`   | No       | Use full container width                                         |
| `spaceAfter`   | boolean                          | `false`  | No       | Add bottom margin                                                |
| `heading`      | select: `none`, `h1`, `h2`, `h3` | `"none"` | No       | Render as heading                                                |
| `borderBottom` | boolean                          | `false`  | No       | Add bottom border                                                |

- **Accepts children**: No

#### `LargeText`

> Large styled display text.

| Prop         | Type                                         | Default    | Required | Description      |
| ------------ | -------------------------------------------- | ---------- | -------- | ---------------- |
| `text`       | string                                       | —          | Yes      | Text to display  |
| `textAlign`  | select: `left`, `center`, `right`            | `"left"`   | No       | Alignment        |
| `fontSizePx` | number (min: 12, max: 200)                   | `30`       | No       | Font size in px  |
| `fontWeight` | select: `normal`, `bold`, `black`, `lighter` | `"normal"` | No       | Weight           |
| `fontType`   | select: `normal`, `display`                  | `"normal"` | No       | Font family type |

- **Accepts children**: No

#### `CopyCodeBox`

> Text block with copy-to-clipboard button.

| Prop            | Type   | Default                  | Required | Description              |
| --------------- | ------ | ------------------------ | -------- | ------------------------ |
| `text`          | text   | —                        | Yes      | Text to display and copy |
| `label`         | string | —                        | Yes      | Label above the box      |
| `copiedMessage` | string | `"Copied to clipboard."` | No       | Message on copy          |

- **Accepts children**: No

---

### 2.4 Media Components (`media`)

#### `SectionImage`

> Image with optional caption.

| Prop           | Type           | Default | Required | Description           |
| -------------- | -------------- | ------- | -------- | --------------------- |
| `imagePath`    | image          | —       | Yes      | Image source          |
| `caption`      | string         | —       | No       | Caption text          |
| `altText`      | string         | —       | No       | Alt text              |
| `widthPercent` | number (1-100) | `100`   | No       | Width as percentage   |
| `disableClick` | boolean        | `false` | No       | Disable click-to-open |

- **Accepts children**: No

#### `VideoEmbed`

> Embedded video (YouTube, Vimeo, or direct URL).

| Prop          | Type                         | Default   | Required | Description                      |
| ------------- | ---------------------------- | --------- | -------- | -------------------------------- |
| `videoUrl`    | url                          | —         | Yes      | Video URL (YouTube/Vimeo/direct) |
| `title`       | string                       | `"Video"` | No       | Title for accessibility          |
| `aspectRatio` | select: `16:9`, `4:3`, `1:1` | `"16:9"`  | No       | Aspect ratio                     |

- **Accepts children**: No
- **Note**: New component, not in original template. Must be created.

---

### 2.5 Interactive Components (`interactive`)

#### `LinkButton`

> Styled navigation button/link.

| Prop             | Type                                          | Default     | Required | Description             |
| ---------------- | --------------------------------------------- | ----------- | -------- | ----------------------- |
| `linktext`       | string                                        | —           | Yes      | Button text             |
| `href`           | url                                           | —           | Yes      | Link destination        |
| `backgroundType` | select: `primary`, `secondary`, `transparent` | `"primary"` | No       | Button style            |
| `fontType`       | select: `normal`, `display`                   | `"normal"`  | No       | Font family             |
| `outlineType`    | select: `none`, `normal`, `primary`           | `"none"`    | No       | Border style            |
| `openInNewTab`   | boolean                                       | `false`     | No       | Open link in new tab    |
| `iconPath`       | image                                         | —           | No       | Optional button icon    |
| `iconAlt`        | string                                        | —           | No       | Icon alt text           |
| `fitToText`      | boolean                                       | `false`     | No       | Shrink width to content |

- **Accepts children**: No

#### `CustomButton`

> Interactive button (for forms or actions).

| Prop        | Type                                                              | Default     | Required | Description    |
| ----------- | ----------------------------------------------------------------- | ----------- | -------- | -------------- |
| `text`      | string                                                            | —           | Yes      | Button label   |
| `variant`   | select: `primary`, `secondary`, `positive`, `warning`, `negative` | `"primary"` | No       | Color variant  |
| `style`     | select: `solid`, `translucent`                                    | `"solid"`   | No       | Fill style     |
| `fontStyle` | select: `normal`, `display`                                       | `"normal"`  | No       | Font family    |
| `disabled`  | boolean                                                           | `false`     | No       | Disabled state |

- **Accepts children**: No

---

### 2.6 Data Components (`data`)

#### `Table`

> Data table with columns and rows.

| Prop              | Type                                     | Default | Required | Description            |
| ----------------- | ---------------------------------------- | ------- | -------- | ---------------------- |
| `columns`         | array: `[{header: string, key: string}]` | `[]`    | Yes      | Column definitions     |
| `data`            | array: `[{[key]: string}]`               | `[]`    | Yes      | Row data               |
| `showBorders`     | boolean                                  | `true`  | No       | Show cell borders      |
| `alternatingRows` | boolean                                  | `true`  | No       | Alternating row colors |

- **Accepts children**: No

#### `DecoratedList`

> Styled list with titles and descriptions.

| Prop    | Type                                                                     | Default | Required | Description |
| ------- | ------------------------------------------------------------------------ | ------- | -------- | ----------- |
| `items` | array: `[{title: string, description: string, showBulletDot?: boolean}]` | `[]`    | Yes      | List items  |

- **Accepts children**: No

#### `Collapsible`

> Expandable/collapsible section.

| Prop              | Type    | Default | Required | Description    |
| ----------------- | ------- | ------- | -------- | -------------- |
| `title`           | string  | —       | Yes      | Section title  |
| `defaultExpanded` | boolean | `false` | No       | Start expanded |

- **Accepts children**: Yes

---

### 2.7 Utility Components (`utility`)

#### `SizedBox`

> Empty spacing element.

| Prop     | Type   | Default | Required | Description       |
| -------- | ------ | ------- | -------- | ----------------- |
| `height` | number | `20`    | No       | Height in px      |
| `width`  | string | —       | No       | Width (CSS value) |

- **Accepts children**: No

#### `FlexRow`

> Horizontal flex container.

| Prop             | Type                                                                        | Default        | Required | Description             |
| ---------------- | --------------------------------------------------------------------------- | -------------- | -------- | ----------------------- |
| `gap`            | number                                                                      | `10`           | No       | Gap between items in px |
| `alignItems`     | select: `flex-start`, `center`, `flex-end`                                  | `"center"`     | No       | Vertical alignment      |
| `justifyContent` | select: `flex-start`, `center`, `flex-end`, `space-between`, `space-around` | `"flex-start"` | No       | Horizontal distribution |
| `wrap`           | select: `nowrap`, `wrap`, `wrap-reverse`                                    | `"nowrap"`     | No       | Wrap behavior           |
| `fullWidth`      | boolean                                                                     | `false`        | No       | Fill container width    |

- **Accepts children**: Yes

---

### 2.8 Design Components (`design`)

#### `GridBackground`

> Animated canvas grid with glow effects. Typically placed at top of page.

| Prop            | Type                       | Default | Required | Description             |
| --------------- | -------------------------- | ------- | -------- | ----------------------- |
| `gridSize`      | number (min: 10, max: 200) | `50`    | No       | Grid cell size          |
| `showGrid`      | boolean                    | `true`  | No       | Show grid lines         |
| `enableRipples` | boolean                    | `true`  | No       | Click ripple animations |

- **Accepts children**: No
- **Note**: Simplified props for builder. Advanced props (colors, opacity) inherit from theme.

---

## 3. Components NOT Exposed in Builder

These exist in the template but are internal/low-level:

| Component                                 | Reason Hidden                                 |
| ----------------------------------------- | --------------------------------------------- |
| `SectionPanel`                            | Internal wrapper used by GenericSection       |
| `SectionWrapper`                          | Internal wrapper used by sections             |
| `BackgroundGradientTransition`            | Advanced design element                       |
| `NavigationButton`                        | Internal to Navbar                            |
| `Sidebar` (mobile nav)                    | Internal to Navbar                            |
| `FooterArea`, `FooterLinks`, `FooterLink` | Internal to Footer                            |
| `SocialLinks`                             | Internal to Footer                            |
| `ThemeSwitch`                             | Included in Navbar/Footer automatically       |
| `ScrollDownHint`                          | Controlled via Banner's `showScrollHint` prop |
| `BackButton`                              | Auto-included in relevant pages               |
| `Tooltip`                                 | Used internally by other components           |
| `TextInput`, `TextArea`, `Checkbox`       | Form components (future expansion)            |
| `Layout`                                  | App shell wrapper                             |
| `LoadingFallback`, `NotFoundPage`         | Core pages (auto-generated)                   |

---

## 4. Future Components (Planned)

These components should be created and added to the registry in future versions:

### High Priority

| Component     | Category    | Description                                                      |
| ------------- | ----------- | ---------------------------------------------------------------- |
| `VideoEmbed`  | media       | YouTube/Vimeo iframe embed (needed for Content Creator template) |
| `ContactForm` | interactive | Name/email/message form with mailto or API endpoint              |
| `Testimonial` | content     | Quote with author name, role, avatar                             |
| `PricingCard` | content     | Pricing tier with features list and CTA button                   |
| `FeatureCard` | content     | Icon + title + description card                                  |
| `Timeline`    | data        | Vertical timeline with dated entries                             |
| `FAQ`         | data        | Question/answer pairs using collapsibles                         |
| `HeroSection` | content     | Full-viewport section with background, title, CTA                |
| `StatsRow`    | content     | Row of NumberDisplay components                                  |
| `SocialBar`   | interactive | Horizontal row of social media icon links                        |

### Medium Priority

| Component     | Category | Description                                             |
| ------------- | -------- | ------------------------------------------------------- |
| `Accordion`   | data     | Multiple collapsible sections (only one open at a time) |
| `TabGroup`    | data     | Tabbed content panels                                   |
| `ProgressBar` | data     | Horizontal progress indicator                           |
| `Badge`       | text     | Small labeled tag/chip                                  |
| `Divider`     | utility  | Horizontal rule with optional text                      |
| `Spacer`      | utility  | Flexible growing space                                  |
| `IconText`    | content  | Icon image + text label, inline                         |
| `Map`         | media    | Embedded Google Maps iframe                             |
| `Alert`       | content  | Colored info/warning/error banner                       |
| `CodeBlock`   | text     | Syntax-highlighted code display                         |

### Low Priority (Future)

| Component         | Category    | Description                          |
| ----------------- | ----------- | ------------------------------------ |
| `Marquee`         | design      | Scrolling text ticker                |
| `ParallaxSection` | design      | Parallax scroll effect background    |
| `CountUpNumber`   | design      | Animated number counter              |
| `TypewriterText`  | design      | Animated typewriter text effect      |
| `Masonry`         | layout      | Pinterest-style grid layout          |
| `Modal`           | interactive | Click-to-open popup dialog           |
| `Lightbox`        | media       | Image gallery with fullscreen viewer |

---

## 5. Adding a New Component

To add a new component to Pagework:

1. **Create the React component** in `templates/components/{category}/` — standard React component with TypeScript props interface.

2. **Add registry entry** in `src/utils/componentRegistry.ts` — define the `ComponentDefinition` with all props, types, defaults, and metadata.

3. **Add codegen support** in `src-tauri/src/codegen/pages.rs` — add the component type to the JSX generation switch/match, mapping manifest prop values to JSX attributes.

4. **Update existing projects** — when a user opens a project created with an older version of Pagework, the new component source files should be copied into their project's `src/components/` directory if missing.

5. **Add to starter templates** (optional) — if the component should appear in any starter template, add it to the relevant template definition.
