import React, { useState, useEffect } from 'react';
import '../css/StudySet.css';
import FlashcardCarousel from '../components/FlashcardCarousel';
import Leaderboard from '../components/LeaderboardCard';

const cards = [
    { front: "Question 1", back: "Answer 1" },
    { front: "Question 2", back: "Answer 2" },
    { front: "Question 3", back: "Answer 3" }
  ];

function StudySet (){
     const [rankItems, setRankItems] = useState([]);
        useEffect(() => {
            setTimeout(() => {
              setRankItems([
                { rank: 1, name: 'Just Donatello', score: 100 },
                { rank: 2, name: 'Idunno Mann', score: 90 },
                { rank: 3, name: 'Jackie Butter', score: 80 },
              ]);
            }, 1000); // data fetching simulation
          }, []);
    
    return (
        <div className="study-set">
            <div className="study-set-nav-bar">
                <div className="studyset-title">
                    Mathematics
                </div>
                <div className="home-buttons">
                    <button className="btn-home">+ Create Flashcard</button>
                    <button className="btn-home">Battle</button>
                    <button className="btn-home">Solo Review Mode</button>
                </div>
            </div>
            <div className="study-content-container">
                <div className="flashcard-container">
                    {/* <div className='flashcard-carousel'>
                        <button className="nav-arrow left-arrow" onClick={goToPrev}>&lt;</button>
                        <div className='flashcard-viewport'>
                            <Flashcard front={"fro"} back={"ba"}/>
                            <Flashcard front={"fro2"} back={"ba2"}/>
                        </div>
                        <button className="nav-arrow right-arrow" onClick={goToNext}>&gt;</button>
                    </div>
                    <div className='progress-indicators'>
                    {cards.map((_, index) => (
                        <div 
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                        ))}
                    </div> */}
                     <FlashcardCarousel cards={cards} />
                </div>
                <div className='leaderboard'>
                    <Leaderboard 
                        title = "Leaderboard"
                        showCrown = {true} 
                        rankItems = {rankItems}
                        isLoading = {false}
                    />
                </div>
            </div>
        </div>
    );
}

export default StudySet;