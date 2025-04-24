import React from 'react';
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import crownlogo from '../assets/crown.png';
import '../css/LeaderboardCard.css';

const Leaderboard = ({ 
    title = "Leaderboard", 
    showCrown = true,   
    rankItems = [], 
    isLoading = false 
  }) => {
    return (
        // <div className="result-parent-container">
            <div className="result-container">
                <div className='result-title'>
                {showCrown && <img src={crownlogo} alt="Crown" className='crown-icon'/>}
                <span>{title}</span>
                </div>
                <div className='rank-list'>
                    {isLoading || rankItems.length === 0 ? (
                        [1, 2, 3].map((index) => (
                            <div className="rank-item-container" key={index}>
                                <div className="rank-number">
                                    <Skeleton className="skeleton-shimmer" width={30} height={25} />
                                </div>
                                <div className="user-name">
                                    <Skeleton className="skeleton-shimmer" width={120} height={15}/>
                                </div>
                                <div className="battle-score">
                                    <Skeleton className="skeleton-shimmer" width={30} height={15}/>
                                </div>
                            </div>
                        ))
                    ) : (
                        rankItems.map((item) => (
                        <div className="rank-item-container" key={item.rank}>
                            <div className="rank-number">{item.rank}</div>
                            <div className="user-name">{item.name}</div>
                            <div className="battle-score">{item.score}</div>
                        </div>
                        ))
                    )}
                </div>
            </div>
        // </div>
      
    );
  };
  
  export default Leaderboard;
