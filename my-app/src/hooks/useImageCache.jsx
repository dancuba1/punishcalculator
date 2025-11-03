import { useEffect, useRef } from "react";

/**
 * Custom hook to cache current, previous, and next images
 * @param {string[]} images - Array of image URLs
 * @param {number} currentIndex - Current active index
 * @returns {React.MutableRefObject<HTMLImageElement[]>} - Ref containing preloaded images
 */
export function useImageCache(images = [], currentIndex = 0) {
  const cacheRef = useRef([]);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const total = images.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    const indicesToCache = [prevIndex, currentIndex, nextIndex];

    cacheRef.current = indicesToCache.map((i) => {
      const img = new Image();
      img.src = images[i];
      return img;
    });
  }, [images, currentIndex]);

  return cacheRef;
}
