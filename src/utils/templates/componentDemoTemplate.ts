import type { SiteBuilderManifest } from "@/types/manifest";
import { baseManifest, component, page, uid } from "./helpers";

export function componentDemoTemplate(
  projectName: string,
): SiteBuilderManifest {
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
        component(
          "Banner",
          {
            imageUrl: "/assets/banners/banner.webp",
            altText: "Hero Banner",
            showScrollHint: true,
          },
          [
            component("BannerHeader", {
              preHeadingText: "Welcome to",
              titleText: projectName,
              subtitleText: "A showcase of every component",
            }),
          ],
        ),
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
                linktext: "Transparent",
                href: "#",
                backgroundType: "transparent",
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
            text: "npm install my-package",
            label: "Install Command",
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
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            title: "Sample Video",
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Image Carousel" }),
          component("ImageCarousel", {
            images: [
              { path: "", alt: "Slide 1", caption: "First slide" },
              { path: "", alt: "Slide 2", caption: "Second slide" },
              { path: "", alt: "Slide 3", caption: "Third slide" },
            ],
          }),
        ]),
        component("GenericSection", {}, [
          component("SectionHeader", { title: "Collapsible / Accordion" }),
          component(
            "Collapsible",
            {
              title: "Click to expand",
              defaultExpanded: false,
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
              defaultExpanded: true,
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

    // ── Page 4: Layout — invisible, scroll, spacer, grid ──
    page({
      name: "Layout",
      path: "/layout",
      components: [
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
        component("GridBackground", {}),
      ],
    }),
  ];
  return m;
}
