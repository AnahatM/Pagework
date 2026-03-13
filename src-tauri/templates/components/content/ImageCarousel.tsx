// filepath: c:\Dev\RobotomiesWebsite\src\components\content\ImageCarousel.tsx
import { analyzeImageBrightness } from "@/utils/ImageUtils";
import assetPath, { ASSET_PATHS } from "@routes/AssetPathHandler";
import { useEffect, useRef, useState, type JSX } from "react";
import "./ImageCarousel.css";

/**
 * Properties for each image in the carousel
 */
interface CarouselImage {
  /** Path to the image file */
  path: string;
  /** Optional caption to display with the image */
  caption?: string;
  /** Optional alt text for accessibility */
  alt?: string;
}

/**
 * Props for the ImageCarousel component
 */
interface ImageCarouselProps {
  /** Array of image objects to display in the carousel */
  images: CarouselImage[];
  /** Whether to enable autoscrolling through images */
  autoScroll?: boolean;
  /**
   * Time in milliseconds between automatic image transitions
   * Only used when autoScroll is true
   */
  autoScrollTimeMS?: number;
  /** Optional CSS class to apply to the carousel container */
  className?: string;
}

/**
 * ImageCarousel component to display a carousel of images with navigation controls.
 * It supports autoscrolling, manual navigation, and displaying captions.
 *
 * @param props - The properties for the ImageCarousel component.
 * @returns JSX.Element - The rendered image carousel.
 */
export default function ImageCarousel(props: ImageCarouselProps): JSX.Element {
  const {
    images,
    autoScroll = false,
    autoScrollTimeMS: autoScrollTime = 3000,
    className = ""
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const [arrowColor, setArrowColor] = useState("white");
  const intervalRef = useRef<number | null>(null);

  // Analyze current image when index changes
  useEffect(() => {
    if (images.length > 0) {
      const currentImage = images[currentIndex];
      analyzeImageBrightness(assetPath(currentImage.path), (color) => {
        setArrowColor(color);
      });
    }
  }, [currentIndex, images]);

  // Clear any existing interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Set up or clear autoscrolling based on isAutoScrolling state
  useEffect(() => {
    if (isAutoScrolling && images.length > 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoScrollTime);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoScrolling, autoScrollTime, images.length]);

  // Navigation functions
  const goToPrevious = (): void => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = (): void => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number): void => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
    setCurrentIndex(index);
  };

  const openImageInNewTab = (imagePath: string): void => {
    window.open(assetPath(imagePath), "_blank", "noopener,noreferrer");
  };

  // Don't render if no images
  if (!images.length) {
    return <></>;
  }

  // Render the carousel
  return (
    <div className={`image-carousel ${className}`}>
      <div className="carousel-container">
        {/* Counter display */}
        <div className="carousel-counter">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Previous button */}
        <button className="carousel-arrow carousel-arrow-prev" onClick={goToPrevious}>
          <img
            src={`${ASSET_PATHS.GRAPHICS}expand.png`}
            alt="Previous"
            className="carousel-arrow-icon"
            style={{
              transform: "rotate(90deg)",
              filter: arrowColor === "black" ? "brightness(0)" : "brightness(1)"
            }}
          />
        </button>

        {/* Image slides */}
        {images.map((image, index) => (
          <div
            key={`slide-${index}`}
            className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
          >
            <img
              src={assetPath(image.path)}
              alt={image.alt || `Slide ${index + 1}`}
              className="carousel-image"
            />
            {image.caption && (
              <div className="carousel-caption">
                <div className="carousel-caption-text">{image.caption}</div>
              </div>
            )}
          </div>
        ))}

        {/* Next button */}
        <button className="carousel-arrow carousel-arrow-next" onClick={goToNext}>
          <img
            src={`${ASSET_PATHS.GRAPHICS}expand.png`}
            alt="Next"
            className="carousel-arrow-icon"
            style={{
              transform: "rotate(-90deg)",
              filter: arrowColor === "black" ? "brightness(0)" : "brightness(1)"
            }}
          />
        </button>
      </div>

      {/* Indicator dots */}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={`indicator-${index}`}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
        <button
          className="carousel-link-button"
          onClick={() => openImageInNewTab(images[currentIndex].path)}
          aria-label="Open image in new tab"
        >
          <img
            src={`${ASSET_PATHS.GRAPHICS}link.png`}
            alt="Open in new tab"
            className="carousel-link-icon"
          />
        </button>
      </div>
    </div>
  );
}
