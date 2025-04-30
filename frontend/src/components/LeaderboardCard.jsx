import React from 'react';
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion'; 
import crownlogo from '../assets/crown.png';
import '../css/LeaderboardCard.css';

const Leaderboard = ({ 
    title = "Leaderboard", 
    showCrown = true,   
    rankItems = [], 
    isLoading = false, 
    highlightName = "You",
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
                    ) : rankItems.length === 0 ? (
                        <div className="empty-message">No leaderboard data available</div>
                    ) : (
                        rankItems.map((item) => {
                            const isHighlighted = item.name.toLowerCase() === highlightName.toLowerCase();
                            console.log("Rank Item:", item.name, "Highlight Name:", highlightName, "Is Highlighted:", isHighlighted);
                            return (
                                <motion.div
                                    key={item.rank}
                                    className={`rank-item-container ${isHighlighted ? 'highlight' : ''}`}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="rank-number">{item.rank}</div>
                                    <div className={`user-name ${isHighlighted ? 'highlight' : ''}`}>
                                        {item.name}
                                    </div>
                                    <div className="battle-score">{item.score}</div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        // </div>
      
    );
  };
  
  export default Leaderboard;
