import React, { useState, useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css'; 
import '../css/BattleResult.css'
import Leaderboard from '../components/LeaderboardCard';


function BattleResult (){

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
        <div className='battleresult-page'>
            <div className='result-parent-container'>
                <Leaderboard 
                    title='Battle Results'
                    showCrown = {true}
                    rankItems={rankItems}
                    isLoading = {false}
                />
            </div>
        </div>
    )
}

export default BattleResult


