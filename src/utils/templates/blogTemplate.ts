import type { SiteBuilderManifest } from "@/types/manifest";
import { baseManifest, component, page, uid } from "./helpers";

export function blogTemplate(projectName: string): SiteBuilderManifest {
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
