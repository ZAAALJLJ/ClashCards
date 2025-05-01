import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'; 
import '../css/BattleResult.css'
import Leaderboard from '../components/LeaderboardCard';


function BattleResult (){
  const location = useLocation();
  const navigate = useNavigate();
  // const { score, totalQuestions, client_id, players } = location.state || {};
  const [rankItems, setRankItems] = useState([]);

  const { score, totalQuestions, client_id, players } = location.state || {
    score: 0, 
    totalQuestions: 0, 
    client_id: '', 
    players: []
  };

  useEffect(() => {
    if (!score || !client_id) return;

    const initialLeaderboard = players || [
      { name: 'Just Donatello', score: 100 },
      { name: 'Idunno Mann', score: 90 },
      { name: 'Jackie Butter', score: 80 },
    ];

    const updatedList = initialLeaderboard
      .sort((a, b) => b.score - a.score) 
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        highlight: item.name === client_id, 
      }));

    setTimeout(() => {
      setRankItems(updatedList);
    }, 1000);
  }, [score, client_id, players]);

  if (score === undefined || totalQuestions === undefined) {
    return (
      <div className="battleresult-page">
        <div className="result-parent-container">
          <h2>Invalid or missing result data.</h2>
          <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    );
  }

  return(
      <div className='battleresult-page'>
          <div className='result-parent-container'>
              <Leaderboard 
                  title='Battle Results'
                  showCrown = {true}
                  rankItems={rankItems}
                  isLoading = {false}
                  highlightName={client_id}
              />

              <button className='battle-home-btn' onClick={() => navigate('/')}>Return Home</button>

          </div>
      </div>
  )
}

export default BattleResult


