import React, { useState, useEffect } from 'react';
import '../css/LiveBattle.css';
import Leaderboard from '../components/LeaderboardCard';

function LiveBattle (){
    const [rankItems, setRankItems] = useState([]);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle message submission
        console.log('Message sent:', message);
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
        }
    };

    const totalQuestions = 6;
    const currentIndex = 2; 
    const answeredIndexes = [0, 1]

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
                    <div className='card-set-title'>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z" data-name="Left"/></svg>
                        </div>
                        <span>Mathematics</span>
                    </div>
                    <div className='battle-timer'></div>
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
                <div className='live-flashcard-container'>
                    <div className='battle-flashcard-container'>
                        <div className='question-container'>
                            <span>What's 9 + 10</span>
                        </div>
                        <div className='answer-container'>
                            <form onSubmit={handleSubmit} className="message-form">
                                <div className="input-group">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your answer here..."
                                        className="message-input"
                                        rows={1}
                                    />
                                    <button type="submit" className="send-button">
                                    <svg viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg" class="paper-plane-icon-sm">
                                        <path d="M2.61258 9L0.05132 1.31623C-0.22718 0.48074 0.63218 -0.28074 1.42809 0.09626L20.4281 9.0963C21.1906 9.4575 21.1906 10.5425 20.4281 10.9037L1.42809 19.9037C0.63218 20.2807 -0.22718 19.5193 0.05132 18.6838L2.61258 11H8.9873C9.5396 11 9.9873 10.5523 9.9873 10C9.9873 9.4477 9.5396 9 8.9873 9H2.61258z" fill="currentColor"/>
                                    </svg> Send 
                                        {/* <a href="https://iconscout.com/icons/send" class="text-underline font-size-sm" target="_blank">Send</a> by <a href="https://iconscout.com/contributors/google-inc" class="text-underline font-size-sm">Google Inc.</a> on <a href="https://iconscout.com" class="text-underline font-size-sm">IconScout</a> */}
                                    </button>
                                </div>
                                <div className="new-line-hint">
                                    Shift + Enter to start a new line
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='progress-tracker'>
                        {[...Array(totalQuestions)].map((_, i) => (
                            <div
                            key={i}
                            className={`trackers 
                                ${answeredIndexes.includes(i) ? 'answered' : ''} 
                                ${i === currentIndex ? 'active' : ''}
                            `}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveBattle;