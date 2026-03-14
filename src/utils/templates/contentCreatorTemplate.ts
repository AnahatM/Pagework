import type { SiteBuilderManifest } from "@/types/manifest";
import { baseManifest, component, page, uid } from "./helpers";

export function contentCreatorTemplate(
  projectName: string,
): SiteBuilderManifest {
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
        component(
          "Banner",
          {
            lightImageUrl: "/assets/banners/main_banner_light.png",
            darkImageUrl: "/assets/banners/main_banner_dark.png",
            altText: "Banner",
          },
          [
            component("BannerHeader", {
              titleText: projectName,
              subtitleText: "Creator • Educator • Entertainer",
            }),
          ],
        ),
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
