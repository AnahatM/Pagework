import type { SiteBuilderManifest } from "@/types/manifest";
import { baseManifest, component, page } from "./helpers";

export function blankTemplate(projectName: string): SiteBuilderManifest {
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
