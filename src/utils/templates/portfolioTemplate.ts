import type { SiteBuilderManifest } from "@/types/manifest";
import { baseManifest, component, page, uid } from "./helpers";

export function portfolioTemplate(projectName: string): SiteBuilderManifest {
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
        component(
          "Banner",
          {
            lightImageUrl: "/assets/banners/main_banner_light.png",
            darkImageUrl: "/assets/banners/main_banner_dark.png",
            altText: "Banner",
            showScrollHint: true,
          },
          [
            component("BannerHeader", {
              preHeadingText: "Hello, I'm",
              titleText: projectName,
              subtitleText: "Developer & Designer",
            }),
          ],
        ),
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
