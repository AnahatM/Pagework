/// Maps component type names to their import paths in the generated website.
/// This mirrors the structure in PortfolioWebsiteTemplate's component directory.

/// Returns (import_path, accepts_children) for a given component type.
/// Import path is relative to `@components/`, e.g. "layouts/GenericSection".
pub fn component_import_info(component_type: &str) -> Option<(&'static str, bool)> {
    match component_type {
        // Sections (layouts/)
        "GenericSection" => Some(("layouts/GenericSection", true)),
        "InvisibleSection" => Some(("layouts/InvisibleSection", true)),
        "SplitSection" => Some(("layouts/SplitSection", false)), // uses leftContent/rightContent props
        "SectionWithImage" => Some(("layouts/SectionWithImage", true)),
        "DynamicSectionRow" => Some(("layouts/DynamicSectionRow", true)),
        "ScrollableContainer" => Some(("layouts/ScrollableContainer", true)),

        // Content (content/)
        "Banner" => Some(("content/Banner", true)),
        "BannerHeader" => Some(("content/BannerHeader", false)),
        "SectionHeader" => Some(("content/SectionHeader", false)),
        "ImageCarousel" => Some(("content/ImageCarousel", false)),
        "NumberDisplay" => Some(("content/NumberDisplay", false)),

        // Text (ui/)
        "TextParagraph" => Some(("ui/TextParagraph", false)),
        "LargeText" => Some(("ui/LargeText", false)),
        "CopyCodeBox" => Some(("ui/CopyCodeBox", false)),

        // Media (content/)
        "SectionImage" => Some(("content/SectionImage", false)),
        "VideoEmbed" => Some(("content/VideoEmbed", false)),

        // Interactive (ui/)
        "LinkButton" => Some(("ui/LinkButton", false)),
        "CustomButton" => Some(("ui/CustomButton", false)),

        // Data (ui/)
        "Table" => Some(("ui/Table", false)),
        "DecoratedList" => Some(("ui/DecoratedList", false)),
        "Collapsible" => Some(("ui/Collapsible", true)),

        // Utility (utils/)
        "SizedBox" => Some(("utils/SizedBox", false)),
        "FlexRow" => Some(("utils/FlexRow", true)),

        // Design (design/)
        "GridBackground" => Some(("design/GridBackground", false)),

        _ => None,
    }
}
