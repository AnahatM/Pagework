/**
 * Window event hooks
 * Reusable hooks for handling window-level events like scroll and resize
 * Provides optimized event handling with proper cleanup and performance considerations
 */

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook for tracking window scroll position
 * Returns current scroll position and provides optimized scroll event handling
 */
export function useScrollPosition(): {
  scrollY: number;
  scrollX: number;
  isScrollingDown: boolean;
  isScrolled: boolean;
} {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Scroll threshold for determining if page is "scrolled"
  const scrollThreshold = 50;

  const handleScroll = useCallback((): void => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    const currentScrollX = window.scrollX || document.documentElement.scrollLeft;

    // Update scroll direction
    setIsScrollingDown(currentScrollY > lastScrollY.current);
    lastScrollY.current = currentScrollY;

    // Update scroll position
    setScrollY(currentScrollY);
    setScrollX(currentScrollX);

    // Update scrolled state based on threshold
    setIsScrolled(currentScrollY > scrollThreshold);
  }, [scrollThreshold]);

  useEffect(() => {
    // Set initial values
    handleScroll();

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return {
    scrollY,
    scrollX,
    isScrollingDown,
    isScrolled
  };
}

/**
 * Hook for tracking window resize events
 * Returns current window dimensions and provides optimized resize event handling
 */
export function useWindowResize(): {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });

  // Breakpoints for responsive design
  const mobileBreakpoint = 768;
  const tabletBreakpoint = 1024;

  const handleResize = useCallback((): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    // Set initial size
    handleResize();

    // Debounce resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = (): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < mobileBreakpoint,
    isTablet: windowSize.width >= mobileBreakpoint && windowSize.width < tabletBreakpoint,
    isDesktop: windowSize.width >= tabletBreakpoint
  };
}

/**
 * Hook for detecting mobile vs desktop viewport
 * Specifically optimized for navigation component needs
 */
export function useNavigationViewport(): {
  isMobile: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
} {
  // Custom breakpoint for navigation (matches Navbar component)
  const navMobileBreakpoint = 820;

  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: typeof window !== "undefined" ? window.innerWidth <= navMobileBreakpoint : false
  });

  const handleResize = useCallback((): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setViewport({
      width,
      height,
      isMobile: width <= navMobileBreakpoint
    });
  }, [navMobileBreakpoint]);

  useEffect(() => {
    // Set initial values
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return {
    isMobile: viewport.isMobile,
    isDesktop: !viewport.isMobile,
    width: viewport.width,
    height: viewport.height
  };
}

/**
 * Hook for optimized scroll detection with throttling
 * Useful for navbar scroll state changes and similar UI updates
 */
export function useOptimizedScroll(threshold = 50): {
  isScrolled: boolean;
  scrollY: number;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
} {
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    scrollY: 0,
    isScrollingUp: false,
    isScrollingDown: false
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollState = useCallback((): void => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    const direction = currentScrollY > lastScrollY.current;

    setScrollState({
      isScrolled: currentScrollY > threshold,
      scrollY: currentScrollY,
      isScrollingUp: !direction && currentScrollY !== lastScrollY.current,
      isScrollingDown: direction
    });

    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, [threshold]);

  const handleScroll = useCallback((): void => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollState);
      ticking.current = true;
    }
  }, [updateScrollState]);

  useEffect(() => {
    // Set initial state
    updateScrollState();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, updateScrollState]);

  return scrollState;
}
