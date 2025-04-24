import React, { useState, useEffect, useRef } from 'react';
import '../css/StudySet.css';
import FlashcardCarousel from '../components/FlashcardCarousel';
import Leaderboard from '../components/LeaderboardCard';
import crownLogo from '../assets/crown.png';

const cards = [
    { front: "Question 1", back: "Answer 1" },
    { front: "Question 2", back: "Answer 2" },
    { front: "Question 3", back: "Answer 3" }
  ];

function StudySet (){
     const [rankItems, setRankItems] = useState([]);
     const [showLeaderboard, setShowLeaderboard] = useState(false);
     const leaderboardRef = useRef(null);

        useEffect(() => {
            setTimeout(() => {
              setRankItems([
                { rank: 1, name: 'Just Donatello', score: 100 },
                { rank: 2, name: 'Idunno Mann', score: 90 },
                { rank: 3, name: 'Jackie Butter', score: 80 },
              ]);
            }, 1000); 
          }, []);
    
    
          useEffect(() => {
            const handleClickOutside = (event) => {
                if (
                    leaderboardRef.current &&
                    !leaderboardRef.current.contains(event.target)
                ) {
                    setShowLeaderboard(false);
                }
            };
    
            if (showLeaderboard) {
                document.addEventListener("click", handleClickOutside);
            }
    
            return () => document.removeEventListener("click", handleClickOutside);
        }, [showLeaderboard]);


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
                     <FlashcardCarousel cards={cards} />
                </div>
                <div className='leaderboard large-screen-only'>
                    <Leaderboard 
                        title = "Leaderboard"
                        showCrown = {true} 
                        rankItems = {rankItems}
                        isLoading = {false}
                    />
                </div>
                <div className="floating-leaderboard-toggle small-screen-only">
                    <button
                        className="crown-button"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            setShowLeaderboard((prev) => !prev);
                        }}
                    >
                         <img src={crownLogo} alt="Crown" className="crown-icon" />
                    </button>

                    {showLeaderboard && (
                        <div className="floating-leaderboard" ref={leaderboardRef}>
                            <Leaderboard title="Leaderboard" 
                                showCrown={false} 
                                rankItems={rankItems} 
                                isLoading={false} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudySet;