import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import '../css/BattleResult.css'
import crownlogo from '../assets/crown.png';


function BattleResult (){

    const [rankItems, setRankItems] = useState([]);
    useEffect(() => {
        setTimeout(() => {
          setRankItems([
            { rank: 1, name: 'Just Donatello', score: 100 },
            { rank: 2, name: 'Idunno Mann', score: 90 },
            { rank: 3, name: 'Jackie Butter', score: 80 },
          ]);
        }, 2000); // data fetching simulation
      }, []);

    return(
        <div className='battleresult-page'>
            <div className='result-parent-container'>
                <div className='result-container'>
                    <div className='result-title'>
                        <img src={crownlogo} alt="Crown" className='crown'/>
                        <span>Battle Results</span>
                    </div>
                    <div className='rank-list'>
                        {rankItems.length === 0 ? (
                        // Skeleton loaders (placeholder)
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
                        {/* <div className='rank-item-container'>
                            <div className='rank-number'>1</div>
                            <div className='user-name'>Just Donatello</div>
                            <div className='battle-score'>100</div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BattleResult