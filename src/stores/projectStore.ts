/* ═══════════════════════════════════════════
   Project Store
   Central manifest state and all mutation actions
   ═══════════════════════════════════════════ */

import type {
  ComponentInstance,
  FooterColumn,
  NavItem,
  PageConfig,
  SiteBuilderManifest,
  SiteSettings,
  SocialLink,
} from "@/types/manifest";
import { create } from "zustand";

interface ProjectState {
  manifest: SiteBuilderManifest | null;
  projectPath: string | null;
  isDirty: boolean;
}

interface ProjectActions {
  /* ── Project lifecycle ─────────────────── */
  setProject: (manifest: SiteBuilderManifest, projectPath: string) => void;
  closeProject: () => void;
  markClean: () => void;

  /* ── Page operations ───────────────────── */
  addPage: (page: PageConfig) => void;
  updatePage: (pageId: string, updates: Partial<PageConfig>) => void;
  removePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;

  /* ── Component operations ──────────────── */
  addComponent: (
    pageId: string,
    parentId: string | null,
    component: ComponentInstance,
  ) => void;
  removeComponent: (pageId: string, componentId: string) => void;
  updateComponentProp: (
    pageId: string,
    componentId: string,
    propName: string,
    value: unknown,
  ) => void;
  moveComponent: (
    pageId: string,
    componentId: string,
    direction: "up" | "down",
  ) => void;
  duplicateComponent: (pageId: string, componentId: string) => void;

  /* ── Theme ─────────────────────────────── */
  updateThemeColor: (
    theme: "light" | "dark",
    variable: string,
    value: string,
  ) => void;
  updateGlobalColor: (variable: string, value: string) => void;
  updateFont: (variable: "normal" | "display", fontFamily: string) => void;

  /* ── Navigation ────────────────────────── */
  updateNavItems: (items: NavItem[]) => void;
  updateNavLogo: (logoPath: string) => void;

  /* ── Footer ────────────────────────────── */
  updateFooterColumns: (columns: FooterColumn[]) => void;
  updateSocialLinks: (links: SocialLink[]) => void;

  /* ── Site settings ─────────────────────── */
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}

/* ── Deep-clone helpers for immutable updates ── */

function updateManifest(
  state: ProjectState,
  updater: (m: SiteBuilderManifest) => SiteBuilderManifest,
): Partial<ProjectState> {
  if (!state.manifest) return {};
  return { manifest: updater({ ...state.manifest }), isDirty: true };
}

function findAndRemoveComponent(
  components: ComponentInstance[],
  id: string,
): { updated: ComponentInstance[]; removed: ComponentInstance | null } {
  for (let i = 0; i < components.length; i++) {
    if (components[i].id === id) {
      const removed = components[i];
      return {
        updated: [...components.slice(0, i), ...components.slice(i + 1)],
        removed,
      };
    }
    const result = findAndRemoveComponent(components[i].children, id);
    if (result.removed) {
      const updated = [...components];
      updated[i] = { ...updated[i], children: result.updated };
      return { updated, removed: result.removed };
    }
  }
  return { updated: components, removed: null };
}

function updateComponentInTree(
  components: ComponentInstance[],
  id: string,
  updater: (c: ComponentInstance) => ComponentInstance,
): ComponentInstance[] {
  return components.map((c) => {
    if (c.id === id) return updater({ ...c });
    if (c.children.length > 0) {
      return { ...c, children: updateComponentInTree(c.children, id, updater) };
    }
    return c;
  });
}

function addComponentToParent(
  components: ComponentInstance[],
  parentId: string,
  component: ComponentInstance,
): ComponentInstance[] {
  return components.map((c) => {
    if (c.id === parentId) {
      return { ...c, children: [...c.children, component] };
    }
    if (c.children.length > 0) {
      return {
        ...c,
        children: addComponentToParent(c.children, parentId, component),
      };
    }
    return c;
  });
}

function moveInArray<T>(
  arr: T[],
  index: number,
  direction: "up" | "down",
): T[] {
  const newArr = [...arr];
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= newArr.length) return newArr;
  [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
  return newArr;
}

function moveComponentInTree(
  components: ComponentInstance[],
  id: string,
  direction: "up" | "down",
): ComponentInstance[] {
  const index = components.findIndex((c) => c.id === id);
  if (index !== -1) {
    return moveInArray(components, index, direction);
  }
  return components.map((c) => {
    if (c.children.length > 0) {
      return { ...c, children: moveComponentInTree(c.children, id, direction) };
    }
    return c;
  });
}

function deepCloneComponent(
  component: ComponentInstance,
  newIdPrefix: string,
): ComponentInstance {
  return {
    ...component,
    id: `${newIdPrefix}_${crypto.randomUUID().slice(0, 8)}`,
    props: { ...component.props },
    children: component.children.map((c) => deepCloneComponent(c, newIdPrefix)),
  };
}

function duplicateComponentInTree(
  components: ComponentInstance[],
  id: string,
): ComponentInstance[] {
  const index = components.findIndex((c) => c.id === id);
  if (index !== -1) {
    const clone = deepCloneComponent(components[index], "dup");
    const result = [...components];
    result.splice(index + 1, 0, clone);
    return result;
  }
  return components.map((c) => {
    if (c.children.length > 0) {
      return { ...c, children: duplicateComponentInTree(c.children, id) };
    }
    return c;
  });
}

/* ══════════════════════════════════════════════
   Store
   ══════════════════════════════════════════════ */

export const useProjectStore = create<ProjectState & ProjectActions>()(
  (set) => ({
    manifest: null,
    projectPath: null,
    isDirty: false,

    /* ── Project lifecycle ─────────────────── */

    setProject: (manifest, projectPath) =>
      set({ manifest, projectPath, isDirty: false }),

    closeProject: () =>
      set({ manifest: null, projectPath: null, isDirty: false }),

    markClean: () => set({ isDirty: false }),

    /* ── Page operations ───────────────────── */

    addPage: (page) =>
      set((state) =>
        updateManifest(state, (m) => ({ ...m, pages: [...m.pages, page] })),
      ),

    updatePage: (pageId, updates) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          pages: m.pages.map((p) =>
            p.id === pageId ? { ...p, ...updates } : p,
          ),
        })),
      ),

    removePage: (pageId) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          pages: m.pages.filter((p) => p.id !== pageId),
        })),
      ),

    reorderPages: (fromIndex, toIndex) =>
      set((state) =>
        updateManifest(state, (m) => {
          const pages = [...m.pages];
          const [moved] = pages.splice(fromIndex, 1);
          pages.splice(toIndex, 0, moved);
          return { ...m, pages };
        }),
      ),

    /* ── Component operations ──────────────── */

    addComponent: (pageId, parentId, component) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          pages: m.pages.map((p) => {
            if (p.id !== pageId) return p;
            if (parentId === null) {
              return { ...p, components: [...p.components, component] };
            }
            return {
              ...p,
              components: addComponentToParent(
                p.components,
                parentId,
                component,
              ),
            };
          }),
        })),
      ),

    removeComponent: (pageId, componentId) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          pages: m.pages.map((p) => {
            if (p.id !== pageId) return p;
            const { updated } = findAndRemoveComponent(
              p.components,
              componentId,
            );
            return { ...p, components: updated };
          }),
        })),
      ),

    updateComponentProp: (pageId, componentId, propName, value) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          pages: m.pages.map((p) => {
            if (p.id !== pageId) return p;
            return {
              ...p,
              components: updateComponentInTree(
                p.components,
                componentId,
                (c) => ({
                  ...c,
                  props: { ...c.props, [propName]: value },
                }),
              ),
            };
          }),
        })),
      ),

    moveComponent: (pageId, componentId, direction) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          pages: m.pages.map((p) => {
            if (p.id !== pageId) return p;
            return {
              ...p,
              components: moveComponentInTree(
                p.components,
                componentId,
                direction,
              ),
            };
          }),
        })),
      ),

    duplicateComponent: (pageId, componentId) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          pages: m.pages.map((p) => {
            if (p.id !== pageId) return p;
            return {
              ...p,
              components: duplicateComponentInTree(p.components, componentId),
            };
          }),
        })),
      ),

    /* ── Theme ─────────────────────────────── */

    updateThemeColor: (theme, variable, value) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          theme: {
            ...m.theme,
            [theme]: { ...m.theme[theme], [variable]: value },
          },
        })),
      ),

    updateGlobalColor: (variable, value) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          theme: {
            ...m.theme,
            global: { ...m.theme.global, [variable]: value },
          },
        })),
      ),

    updateFont: (variable, fontFamily) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          theme: {
            ...m.theme,
            fonts: { ...m.theme.fonts, [variable]: fontFamily },
          },
        })),
      ),

    /* ── Navigation ────────────────────────── */

    updateNavItems: (items) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          navigation: { ...m.navigation, navItems: items },
        })),
      ),

    updateNavLogo: (logoPath) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          navigation: { ...m.navigation, logoPath },
        })),
      ),

    /* ── Footer ────────────────────────────── */

    updateFooterColumns: (columns) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          footer: { ...m.footer, columns },
        })),
      ),

    updateSocialLinks: (links) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          footer: { ...m.footer, socialLinks: links },
        })),
      ),

    /* ── Site settings ─────────────────────── */

    updateSiteSettings: (settings) =>
      set((state) =>
        updateManifest(state, (m) => ({
          ...m,
          siteSettings: { ...m.siteSettings, ...settings },
        })),
      ),
  }),
);
