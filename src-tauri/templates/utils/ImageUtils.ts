/**
 * ImageUtils.ts
 * Utility functions for image processing and analysis
 */

/**
 * Analyzes the brightness of an image to determine optimal contrast colors
 * @param imageSrc - The source URL of the image to analyze
 * @param callback - Callback function that receives the recommended color ("black" or "white")
 * @param options - Optional configuration for the analysis
 */
export function analyzeImageBrightness(
  imageSrc: string,
  callback: (color: "black" | "white") => void,
  options: {
    /** Areas to sample for analysis (default: both edges) */
    sampleAreas?: "left" | "right" | "both" | "center";
    /** Brightness threshold for color decision (default: 128) */
    threshold?: number;
  } = {}
): void {
  const { sampleAreas = "both", threshold = 128 } = options;

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    // Create temporary canvas for analysis
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      callback("white"); // Fallback
      return;
    }

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0);

    const samples: number[] = [];

    try {
      // Sample different areas based on configuration
      if (sampleAreas === "left" || sampleAreas === "both") {
        // Sample left edge area (where left arrow appears)
        for (let y = img.height * 0.4; y < img.height * 0.6; y += 4) {
          for (let x = 0; x < Math.min(img.width * 0.15, 100); x += 4) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              const brightness = pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114;
              samples.push(brightness);
            } catch {
              // Ignore errors from sampling
            }
          }
        }
      }

      if (sampleAreas === "right" || sampleAreas === "both") {
        // Sample right edge area (where right arrow appears)
        for (let y = img.height * 0.4; y < img.height * 0.6; y += 4) {
          for (let x = Math.max(img.width * 0.85, img.width - 100); x < img.width; x += 4) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              const brightness = pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114;
              samples.push(brightness);
            } catch {
              // Ignore errors from sampling
            }
          }
        }
      }

      if (sampleAreas === "center") {
        // Sample center area
        const centerX = img.width * 0.5;
        const centerY = img.height * 0.5;
        const sampleRadius = Math.min(img.width, img.height) * 0.1;

        for (let y = centerY - sampleRadius; y < centerY + sampleRadius; y += 4) {
          for (let x = centerX - sampleRadius; x < centerX + sampleRadius; x += 4) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              const brightness = pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114;
              samples.push(brightness);
            } catch {
              // Ignore errors from sampling
            }
          }
        }
      }

      // Calculate average brightness
      if (samples.length === 0) {
        callback("white"); // Fallback if no samples
        return;
      }

      const avgBrightness = samples.reduce((a, b) => a + b, 0) / samples.length;

      // Determine optimal contrast color based on brightness
      callback(avgBrightness > threshold ? "black" : "white");
    } catch (error) {
      console.warn("Error analyzing image brightness:", error);
      callback("white"); // Fallback
    }
  };

  img.onerror = () => {
    console.warn("Failed to load image for brightness analysis:", imageSrc);
    callback("white"); // Fallback
  };

  img.src = imageSrc;
}

/**
 * Get the dominant color from an image
 * @param imageSrc - The source URL of the image to analyze
 * @param callback - Callback function that receives the dominant color as hex string
 */
export function getDominantColor(imageSrc: string, callback: (color: string) => void): void {
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      callback("#ffffff");
      return;
    }

    // Use smaller canvas for performance
    const size = 50;
    canvas.width = size;
    canvas.height = size;

    // Draw scaled down image
    ctx.drawImage(img, 0, 0, size, size);

    try {
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      const colorCounts: { [key: string]: number } = {};

      // Count color occurrences (simplified to reduce computation)
      for (let i = 0; i < data.length; i += 16) {
        // Sample every 4th pixel
        const r = Math.round(data[i] / 10) * 10;
        const g = Math.round(data[i + 1] / 10) * 10;
        const b = Math.round(data[i + 2] / 10) * 10;
        const color = `${r},${g},${b}`;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }

      // Find most frequent color
      let dominantColor = "255,255,255";
      let maxCount = 0;
      for (const [color, count] of Object.entries(colorCounts)) {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = color;
        }
      }

      // Convert to hex
      const [r, g, b] = dominantColor.split(",").map(Number);
      const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}`;
      callback(hex);
    } catch (error) {
      console.warn("Error getting dominant color:", error);
      callback("#ffffff");
    }
  };

  img.onerror = () => {
    console.warn("Failed to load image for color analysis:", imageSrc);
    callback("#ffffff");
  };

  img.src = imageSrc;
}
