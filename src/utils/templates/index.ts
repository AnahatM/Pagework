import type { ProjectTemplate, SiteBuilderManifest } from "@/types/manifest";
import { blankTemplate } from "./blankTemplate";
import { blogTemplate } from "./blogTemplate";
import { componentDemoTemplate } from "./componentDemoTemplate";
import { contentCreatorTemplate } from "./contentCreatorTemplate";
import { landingPageTemplate } from "./landingPageTemplate";
import { portfolioTemplate } from "./portfolioTemplate";

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
