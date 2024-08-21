import React, { useState } from "react"

function Slideshow({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log("in slideshow" + images.length + images);
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };
  
    if(images.length === 0){
        return (
        <div className="Error">
            <h1> No images </h1>
        </div>);
    }
    
    if(images.length === 1){
        const image = images[0];
        return(
            <div className="singleSlide">
                <img src={image} alt="Slide Center" className="slide slide-center" />
            </div>
        )
    }
    // Ensure there are at least 3 images
    if (images.length === 2) {
        const slideCenter = images[currentIndex];
        const slideAfter = images[(currentIndex + 1) % images.length];
        const slideBefore = images[(currentIndex - 1 + images.length) % images.length];
        return(
            <div className="slideshow">
                <div className="slideshow-container">
                    <img src={slideBefore} alt="Slide Before" className="slide slide-before" />
                    <img src={slideCenter} alt="Slide Center" className="slide slide-center" />
                    <img src={slideAfter} alt="Slide After" className="slide slide-after" />
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
                </div>
                
            </div> 
        );
    }
  
    // Calculate indices for the slides
    const slideCenter = images[currentIndex];
    const slideAfter = images[(currentIndex + 1) % images.length];
    const slideBefore = images[(currentIndex - 1 + images.length) % images.length];
  
    return (
      <div className="slideshow">
        <div className="slideshow-container">
          <img src={slideBefore} alt="Slide Before" className="slide slide-before" />
          <img src={slideCenter} alt="Slide Center" className="slide slide-center" />
          <img src={slideAfter} alt="Slide After" className="slide slide-after" />
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
        </div>
        
      </div>
    );
  }
  
  export default Slideshow;