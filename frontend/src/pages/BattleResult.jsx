import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'; 
import '../css/BattleResult.css'
import Leaderboard from '../components/LeaderboardCard';
import api from '../api';
import getUsername from '../services/getUsername';



function BattleResult (){
  const location = useLocation();
  const navigate = useNavigate();
  // const { score, totalQuestions, client_id, players } = location.state || {};
  const [currentUser, setCurrentUser] = useState('');
  const [rankItems, setRankItems] = useState([]);
  const [rankOne, setRankOne] = useState(null);

  const { score, totalQuestions, client_id, players, studyset_id, rank1 } = location.state || {
    score: 0, 
    totalQuestions: 0, 
    client_id: '', 
    players: [],
    studyset_id: '',
    rank1: ''
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await getUsername(client_id);
      setCurrentUser(username);
    };
  
    fetchUsername();
  }, [client_id]);
  

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

      console.log('Rnk1:', updatedList[0].name);
      setRankOne(rank1);

    setTimeout(() => {
      setRankItems(updatedList);
      // setRankOne(updatedList[0].name);
      // console.log('Rnk1:', rankOne);
    }, 1000);
  }, [score, client_id, players]);

  useEffect(() => {
    if (rankOne && client_id && studyset_id) {
      console.log('Rank 1:', rankOne);
      console.log('Client ID:', client_id);
      console.log('Studyset ID:', studyset_id);
      updateWinner();
      updateWins();
    }
  }, [rankOne, client_id, studyset_id]);

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

  // UPDATE WINNER
  const updateWinner = async () => {
    console.log("Rankone", rankOne);
    console.log("Client", client_id);
    if (rankOne === client_id) {
      try {
        const winnerUsername = await getUsername(rankOne);
        await api.put(`/studysets/${studyset_id}/add-winner?name=${winnerUsername}`);
      } catch (error) {
          console.error('Error adding winner:', error);
      }      
    }
  };

  // UPDATE WINS
  const updateWins = async () => {
    console.log('updateWins called - rankOne:', rankOne, 'client_id:', client_id, 'comparison:', rankOne === client_id);
    if (String(rankOne) === String(client_id)) {
      try {
        await api.put(`/users/${client_id}`);
        console.log("Win added successfully");
      } catch (error) {
        console.error('Error adding wins:', error);
      }
    } else {
      try {
        await api.put(`/users/${client_id}/lose`);
        console.log("Lose added successfully");
      } catch (error) {
        console.error('Error adding lose:', error);
      }
    }
  };

  return(
      <div className='battleresult-page'>
          <div className='result-parent-container'>
              <Leaderboard 
                  title='Battle Results'
                  showCrown = {true}
                  rankItems={rankItems}
                  isLoading = {false}
                  highlightName={currentUser}
              />

              <button className='battle-home-btn' onClick={() => navigate(`/${client_id}`)}>Return Home</button>

          </div>
      </div>
  )
}

export default BattleResult


