import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import '../css/LiveBattle.css';
import Modal from '../components/Modal.jsx';
import Leaderboard from '../components/LeaderboardCard';
import BattleTimer from '../components/BattleTimer'; 
import Confetti from 'react-confetti';
import getStudysetTitle from '../services/getStudysetTitle';
import api from '../api';

function LiveBattle (){
    
    // DELETE once authentication is made
    const client_id = Date.now() + Math.random();

    const { livebattle_id } = useParams('');
    const { battle_id } = useParams('');

    const title = getStudysetTitle(livebattle_id);
    const [rankItems, setRankItems] = useState([]);
    const [message, setMessage] = useState('');
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [questions, setQuestion] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180);
    const totalTime = 20;
    const totalQuestions = questions.length;
    const progressTrackerRef = useRef(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [hasGameStarted, setHasGameStarted] = useState(false);
    const [showStartModal, setShowStartModal] = useState(true);
    const [playerCount, setPlayerCount] = useState(1); 



    // player set score
    const [player_score, setPlayerScore] = useState(0);

    // websocket
    const [ws, setWs] = useState(null);

    //start modal 
    useEffect(() => {
        setShowStartModal(true);
    }, []);
    

    //timer
    useEffect(() => {
        if (isQuizFinished || isTimeUp) return;
    
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1; 
                    } else {
                        clearInterval(timer);
                        setIsTimeUp(true); 
                        return 0; 
                    }
                });
            }, 1000);
    
            return () => clearInterval(timer); 
        }
    
    }, [timeLeft, isQuizFinished, isTimeUp]);
    
    //form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isTimeUp && hasGameStarted) {
          setMessage('');
          if (questions[currentQuestionIndex]?.answer === message.trim()) {
            const newScore = score + 10;
            setScore(newScore);
            sendToServer(newScore);
          }
      
          const nextIndex = currentQuestionIndex + 1;
          if (nextIndex >= questions.length) {
            setIsQuizFinished(true);
            setShowConfetti(true);
            setTimeout(() => {
              setShowConfetti(false);
            }, 5000);
          } else {
            setCurrentQuestionIndex(nextIndex);
          }
        }
      };
      

    const sendToServer = (event) => {
        if (ws && score) {
            ws.send(score);
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey  && !isTimeUp) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Initial setup for rank items
    useEffect(() => {
        setRankItems([
            { rank: 4, name: client_id, score: player_score},
            { rank: 1, name: 'Just Donatello', score: 0},
            { rank: 2, name: 'Idunno Mann', score: 0 },
            { rank: 3, name: 'Jackie Butter', score: 0 },
        ]);
        fetchCards();
    }, []);

    // websocket connection
    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8001/ws/${battle_id}/${client_id}`); // creates the socket for this specific client
        // socketRef.current = socket;
        
        socket.onmessage = (event) => {
            try {
                console.log(`${event.data}`)
                setRankItems(prevItems => {
                    // Update the score randomly for each user
                    const updatedItems = prevItems.map(item => ({
                        ...item,
                        score: item.score + Math.floor(Math.random() * 10) // Random score change
                    }));
        
                    //
        
                    // Sort the leaderboard based on updated score
                    updatedItems.sort((a, b) => b.score - a.score); // Sort by score
        
                    // Recalculate ranks based on the new sorted order
                    return updatedItems.map((item, index) => ({
                        ...item,
                        rank: index + 1 // Update the rank based on position
                    }));
                });
            } catch (error) {
                console.error('Error fetching cards:', error);     
            }
            
        };

        socket.onopen = () => {
        console.log("WebSocket Connected!");
        };

        socket.onerror = (err) => {
        console.error("WebSocket Error", err);
        };

        socket.onclose = () => {
        console.log("WebSocket Disconnected!");
        };

        setWs(socket); 

        return () => {
            socket.close();
        };
    }, []);


const handleLeaveBattle = () => {
  console.log('User is leaving the battle...');
  setShowLeaveModal(false); 
};
    
    //confetti effect when quiz is finished
    useEffect(() => {
        if ((currentQuestionIndex >= totalQuestions) && (totalQuestions > 0)) {
            setIsQuizFinished(true);
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 5000);
        }
    }, [currentQuestionIndex]);

    //confetti when time runs out
    useEffect(() => {
        if (isTimeUp && !isQuizFinished) {
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 5000);
        }
    }, [isTimeUp, isQuizFinished]); 
    

    //score fetching
    useEffect(() => {
        setTimeout(() => {
        }, 1500);
    }, []); 

    // progress trackers (questions)
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
    
    useEffect(() => {
        const handleEsc = (e) => {
          if (e.key === "Escape") setShowLeaveModal(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
      }, []);
      
    // GET all cards
    const fetchCards = async () => {
        try {
            const response = await api.get(`/flashcards/${livebattle_id}`);
            console.log('Fetched cards:', response.data);
            setQuestion(response.data);
            console.log("total question", questions.length);
        } catch(error) {
            console.error('Error fetching cards:', error);            
        }
    };

    if (questions.length === 0) {
        return <div>Loading questions...</div>;
    }

    return(
        <div className='live-battle-page'>
             {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={300}
                    gravity={0.2}
                    recycle={false} 
                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999 }}
                />
            )}

            <div className='live-nav-bar'>
                <div className='live-title'>
                    <div className='card-set-title'>
                        <div 
                            className='back-arrow-container' 
                            onClick={() => setShowLeaveModal(true)} 
                            role="button" 
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setShowLeaveModal(true)}
                            aria-label="Open leave battle confirmation"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" className="back-arrow">
                                <path d="M16 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H16v-1z" data-name="Left"/>
                            </svg>
                        </div>
                        <span className='subject-title'>{title}</span>
                    </div>
                    {hasGameStarted && (
                        <div className='battle-timer'>
                            <BattleTimer totalTime={totalTime} onTimeUp={() => setIsTimeUp(true)} />
                        </div>
                    )}
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
                            {!hasGameStarted
                                ? "Waiting to start..."
                                : isQuizFinished
                                ? "Done"
                                : isTimeUp
                                    ? "Time is up!"
                                    : questions[currentQuestionIndex]?.question || ""}
                            {(isTimeUp || isQuizFinished) && (
                                <div className="final-score">
                                Score: {score}
                                </div>
                            )}
                        </span>
                        </div>
                        <div className='answer-container'>
                            <form onSubmit={handleSubmit} className="message-form">
                                <div className="input-group">
                                    
                                    <textarea
                                        value={message}
                                        onChange={(e) => !isTimeUp && !isQuizFinished && hasGameStarted && setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={
                                            !hasGameStarted
                                              ? 'Waiting to start...'
                                              : isTimeUp || isQuizFinished
                                                ? 'Quiz Over!'
                                                : 'Type your answer here...'
                                          }
                                        className="message-input"
                                        rows={1}
                                        disabled={!hasGameStarted || isTimeUp || isQuizFinished}
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
            
            <div>
            <Modal
                show={showStartModal}
                onClose={() => {}} 
                onSubmit={() => {
                    setHasGameStarted(true);
                    setShowStartModal(false);
                    setTimeLeft(totalTime); 
                }}
                title="Waiting for Players..."
                bodyText={`${playerCount} player${playerCount !== 1 ? 's' : ''} in lobby.\n You will have limited time to answer all questions.  Ready to start?`}
                cancelText="Cancel"
                submitText="Start Battle"
                type="confirm"
            />

                <Modal
                    show={showLeaveModal}
                    onClose={() => setShowLeaveModal(false)}
                    onSubmit={handleLeaveBattle}
                    title="Leave the Battle?"
                    bodyText="Your progress will be lost if you leave now. Are you sure?"
                    cancelText="Continue Battle"
                    submitText="Leave Battle"
                    type="leave" 
                />
            </div>
        </div>
    )
}

export default LiveBattle;