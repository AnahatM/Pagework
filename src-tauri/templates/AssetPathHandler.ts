/**
 * Formats a given path string into a standardized asset path.
 *
 * - If the path is empty, it returns an empty string.
 * - If the path is a URL (starts with "http"), it returns the URL as is.
 * - If the path does not start with a slash, it adds one.
 * - It removes any leading or trailing slashes from the path.
 * - Finally, it returns the formatted path with a leading slash.
 *
 * @param {string} path - The input path string to format.
 *
 * @returns {string} The formatted asset path.
 */
export default function assetPath(path: string): string {
  // If the path is empty, return an empty string
  if (!path) {
    return "";
  }

  // If the path is a URL, return it as is
  // This allows for external URLs to be used directly without modification
  if (path.startsWith("http")) {
    return path;
  }

  // Ensure the path starts with a slash
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  // Remove any leading or trailing slashes
  path = path.replace(/^\/+|\/+$/g, "");

  // Return the asset path with a leading slash
  return `/${path}`;
}

/**
 * Common asset path constants for frequently used asset directories
 */
export const ASSET_PATHS = {
  ICONS: "/assets/icons/",
  GRAPHICS: "/assets/graphics/",
  IMAGES: "/assets/images/",
  SOCIALS: "/assets/socials/",
  BANNERS: "/assets/banners/",
  TOOLS: "/assets/tools/"
} as const;
