import React, { useState, useEffect } from 'react';
import '../css/StudySet.css';
import Flashcard from '../components/Flashcard';
import Leaderboard from '../components/LeaderboardCard';

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
                    <Flashcard front={"fro"} back={"ba"}/>
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