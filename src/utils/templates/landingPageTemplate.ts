import type { SiteBuilderManifest } from "@/types/manifest";
import { baseManifest, component, page } from "./helpers";

export function landingPageTemplate(projectName: string): SiteBuilderManifest {
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
