import React, { useState, useEffect, useMemo } from "react";

function Slideshow({ images = [], onIndexChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize images: always an array
  const slides = useMemo(() => (Array.isArray(images) ? images : [images]), [images]);

  const total = slides.length;


  // Notify parent on index change
  useEffect(() => {
    if (onIndexChange) onIndexChange(currentIndex);
  }, [currentIndex, onIndexChange]);

  if (total === 0) {
    return (
      <div className="Error">
        <h2>No images found</h2>
      </div>
    );
  }
  
  // Calculate previous and next indices
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

    // Handlers using functional setState
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + total) % total);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % total);

  

  // Render the slides
  return (
    <div className="slideshow">
      <div className="slideshow-container">
        {total > 1 && <img src={slides[prevIndex]} alt="Previous slide" className="slide slide-before" />}
        <img src={slides[currentIndex]} alt="Current slide" className="slide slide-center" />
        {total > 1 && <img src={slides[nextIndex]} alt="Next slide" className="slide slide-after" />}
        
        {total > 1 && (
          <>
            <button className="arrow left-arrow" onClick={handlePrev}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="arrow right-arrow" onClick={handleNext}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
