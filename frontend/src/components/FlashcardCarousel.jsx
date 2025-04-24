import React, { useState } from 'react';
import Flashcard from './Flashcard';
import '../css/FlashcardCarousel.css';

function FlashcardCarousel({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flashcard-carousel-container">
      <div className="flashcard-carousel">
        <button className="nav-arrow left-arrow" onClick={goToPrev}>
            <svg viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        </button>
        
        <div className="flashcard-viewport">
          <Flashcard 
            front={cards[currentIndex].front} 
            back={cards[currentIndex].back} 
          />
        </div>
        
        <button className="nav-arrow right-arrow" onClick={goToNext}>
            <svg  viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        </button>
      </div>
      
      <div className="progress-indicators">
        {cards.map((_, index) => (
          <div 
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FlashcardCarousel;