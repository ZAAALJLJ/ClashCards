import React, { useState, useEffect, useRef } from 'react';
import '../css/LiveBattle.css';
import Leaderboard from '../components/LeaderboardCard';
import BattleTimer from '../components/BattleTimer'; 

function LiveBattle (){
    const [rankItems, setRankItems] = useState([]);
    const [message, setMessage] = useState('');
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [questions] = useState([
        "What's 9 + 10",
        "What's 15 + 5",
        "What's 12 * 2",
        "What's 25 / 5",
        "What's 8 * 3",
        "What's 18 - 9",
        "What's 7 * 7",
        "What's 10 * 10",
        "What's 20 + 25",
        "What's 50 / 5"
    ]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const totalTime = 180;
    const totalQuestions = questions.length;
    const progressTrackerRef = useRef(null);

    const handleTimeUp = () => {
        setIsTimeUp(true);
        console.log('Time is up!');
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!isTimeUp) {
          console.log('Message sent:', message);
          setMessage('');
          setCurrentQuestionIndex(prevIndex => prevIndex + 1); 
        }
      }; 

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey  && !isTimeUp) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        return () => {
          setIsTimeUp(false);
        };
      }, []);  


    useEffect(() => {
        setTimeout(() => {
            setRankItems([
            { rank: 1, name: 'Just Donatello', score: 100 },
            { rank: 2, name: 'Idunno Mann', score: 90 },
            { rank: 3, name: 'Jackie Butter', score: 80 },
            ]);
        }, 1000); // data fetching simulation
    }, []);
    
    useEffect(() => {
        if (currentQuestionIndex >= totalQuestions) {
            setIsQuizFinished(true);
        }
    }, [currentQuestionIndex]);

    const getVisibleTrackers = () => {
        const totalDots = questions.length;
        const visibleDots = 6;
        const halfVisible = Math.floor(visibleDots / 2);
    
        let start = 0;
    
        if (currentQuestionIndex >= halfVisible && currentQuestionIndex < totalDots - halfVisible) {
            start = currentQuestionIndex - halfVisible;
        } else if (currentQuestionIndex >= totalDots - halfVisible) {
            start = totalDots - visibleDots;
        }
    
        start = Math.max(0, start);
        const end = Math.min(start + visibleDots, totalDots);
    
        return Array.from({ length: end - start }, (_, i) => i + start);
    };
    
      

    return(
        <div className='live-battle-page'>
            <div className='live-nav-bar'>
                <div className='live-title'>
                    <div className='card-set-title'>
                        <div className='back-arrow-container'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" className="back-arrow">
                                <path d="M16 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H16v-1z" data-name="Left"/>
                            </svg>
                        </div>
                        <span className='subject-title'>Mathematics</span>
                    </div>
                    <div className='battle-timer'>
                        <BattleTimer totalTime={totalTime} onTimeUp={handleTimeUp} />
                    </div>
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
                            <span className={isQuizFinished ? 'done' : (isTimeUp ? 'time-up' : '')}>
                                {isQuizFinished ? "Done" : (isTimeUp ? "Time is up!" : questions[currentQuestionIndex])}
                            </span>
                        </div>
                        <div className='answer-container'>
                            <form onSubmit={handleSubmit} className="message-form">
                                <div className="input-group">
                                    <textarea
                                        value={message}
                                        onChange={(e) => !isTimeUp && !isQuizFinished && setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={isTimeUp || isQuizFinished ? 'Quiz Over!' : 'Type your answer here...'}
                                        className="message-input"
                                        rows={1}
                                        disabled={isTimeUp || isQuizFinished}
                                    />
                                    <button 
                                        type="submit" 
                                        className={`send-button ${isTimeUp || isQuizFinished ? 'disabled' : ''}`}  
                                        disabled={isTimeUp || isQuizFinished} 
                                        aria-disabled={isTimeUp || isQuizFinished}
                                        aria-label={isTimeUp || isQuizFinished ? "Quiz Over" : "Send answer"}
                                    >
                                        <svg viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg" className="paper-plane-icon-sm">
                                            <path d="M2.61258 9L0.05132 1.31623C-0.22718 0.48074 0.63218 -0.28074 1.42809 0.09626L20.4281 9.0963C21.1906 9.4575 21.1906 10.5425 20.4281 10.9037L1.42809 19.9037C0.63218 20.2807 -0.22718 19.5193 0.05132 18.6838L2.61258 11H8.9873C9.5396 11 9.9873 10.5523 9.9873 10C9.9873 9.4477 9.5396 9 8.9873 9H2.61258z"  fill={isTimeUp ? "#cccccc" : "currentColor"}/>
                                        </svg> 
                                        {isTimeUp || isQuizFinished ? "Quiz Over" : "Send"}
                                        {/* <a href="https://iconscout.com/icons/send" class="text-underline font-size-sm" target="_blank">Send</a> by <a href="https://iconscout.com/contributors/google-inc" class="text-underline font-size-sm">Google Inc.</a> on <a href="https://iconscout.com" class="text-underline font-size-sm">IconScout</a> */}
                                    </button>
                                </div>
                                {!isTimeUp && !isQuizFinished && (
                                    <div className="new-line-hint">
                                        Shift + Enter to start a new line
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className='progress-tracker-container'>
                        <div className='progress-tracker'  ref={progressTrackerRef}>
                            {getVisibleTrackers().map((index) => (
                                <div
                                    key={index}
                                    className={`trackers ${index < currentQuestionIndex ? 'answered' : ''} ${index === currentQuestionIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveBattle;