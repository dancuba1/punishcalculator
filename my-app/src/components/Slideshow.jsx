import React, { useState, useEffect, useMemo, useRef } from "react";

function Slideshow({ images = [], onIndexChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slides = useMemo(() => (Array.isArray(images) ? images : [images]), [images]);
  const total = slides.length;
  const cooldownRef = useRef(null);

  // ✅ Preload all images once
  useEffect(() => {
    slides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [slides]);

  // ✅ Preload the next image after index changes
  useEffect(() => {
    if (total > 1) {
      const nextImg = new Image();
      nextImg.src = slides[(currentIndex + 1) % total];
    }
  }, [currentIndex, slides, total]);

  // ✅ Notify parent when index changes
  useEffect(() => {
    if (onIndexChange) onIndexChange(currentIndex);
  }, [currentIndex, onIndexChange]);

  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, []);

  if (total === 0) {
    return (
      <div className="Error">
        <h2>No images found</h2>
      </div>
    );
  }

  // Compute indices for previous and next
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  

  // ✅ Debounced navigation handlers
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => setIsAnimating(false), 250);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => setIsAnimating(false), 250);
  };


  // ✅ Stable render of slides (persistent <img> elements)
  return (
    <div className="slideshow">
      <div className="slideshow-container">
        {total > 1 && (
          <img
            key="prev"
            src={slides[prevIndex]}
            alt="Previous slide"
            className="slide slide-before"
          />
        )}
        <img
          key="current"
          src={slides[currentIndex]}
          alt="Current slide"
          className="slide slide-center"
        />
        {total > 1 && (
          <img
            key="next"
            src={slides[nextIndex]}
            alt="Next slide"
            className="slide slide-after"
          />
        )}

        {total > 1 && (
          <>
            <button className="arrow left-arrow" onClick={handlePrev}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button className="arrow right-arrow" onClick={handleNext}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Slideshow;
