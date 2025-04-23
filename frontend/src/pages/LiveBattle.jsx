import React, { useState, useEffect } from 'react';
import '../css/LiveBattle.css';
import Leaderboard from '../components/LeaderboardCard';

function LiveBattle (){
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
    
    return(
        <div className='live-battle-page'>
            <div className='live-nav-bar'>
                <div className='live-title'>
                    Matheattics
                </div>
            </div>
            <div className='live-content'>
                <div className='live-ranking'>
                    <Leaderboard 
                            title = "Live Ranking"
                            showCrown = {true} 
                            rankItems = {rankItems}
                            isLoading = {false}
                        />
                    </div>
                <div className='live-flashcard-container'></div>
            </div>
        </div>
    )
}

export default LiveBattle;