import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import '../css/LiveBattle.css';
import Modal from '../components/Modal.jsx';
import Leaderboard from '../components/LeaderboardCard';
import BattleTimer from '../components/BattleTimer'; 
import Confetti from 'react-confetti';
import getStudysetTitle from '../services/getStudysetTitle';
import getCards from '../services/getCards.js';
import { updateRanking } from '../services/updateRanking.js';
import { getUpdatedScoreList } from '../services/getUpdatedScoreList.js';
import { getVisibleIndices } from '../utils/progressHelpers';
import api from '../api.js';
import getUsername from '../services/getUsername';


function LiveBattle (){
    
    const { user_id, livebattle_id } = useParams('');
    const client_id = user_id;
    const { battle_id } = useParams('');

    const title = getStudysetTitle(livebattle_id);
    const flashcards = getCards(livebattle_id);
    const [rankItems, setRankItems] = useState([]);
    const [message, setMessage] = useState('');
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180);
    const totalTime = 20;
    const totalflashcards = flashcards.length;
    const progressTrackerRef = useRef(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [hasGameStarted, setHasGameStarted] = useState(false);
    const [showStartModal, setShowStartModal] = useState(true);
    const [playerCount, setPlayerCount] = useState(1); 
    const [beststreak, setbeststreak] = useState(0); 
    const [currentstreak, setcurrentstreak] = useState(0); 
    const [rankOne, setRankOne] = useState();
    const [currentUser, setCurrentUser] = useState('');


    const navigate = useNavigate();

    // websocket
    const [ws, setWs] = useState(null);

    //start modal 
    useEffect(() => {
        setShowStartModal(true);
    }, []);
    
    //Fetch the current user
    useEffect(() => {
        const fetchUsername = async () => {
          const username = await getUsername(client_id);
          setCurrentUser(username);
        };
      
        fetchUsername();
      }, [client_id]);
      

    

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

    // TO BATTLERESULT
    const goBattleResult = async () => {
        console.log("Console Log in GBR:", rankOne);
        updateConsistency((beststreak / flashcards.length) * 100);
        navigate("/battleresult", { state: {
            score: 85,
            totalQuestions: 10,
            client_id: user_id,
            players: rankItems.map(({ name, score }) => ({ name, score })),
            studyset_id: livebattle_id,
            rank1: rankOne
          }
        });
    }

    useEffect(() => {
        if (isTimeUp) {
            setTimeout(() => {
                if (!livebattle_id) {
                console.warn('livebattle_id is undefined!');
                return; // or fallback/handle error
                }
                goBattleResult();
            }, 2000);
        }
    }, [isTimeUp, navigate]);
    
    //form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!hasGameStarted || isTimeUp || isQuizFinished) {
            return; 
        }
        setMessage('');

        // IF THE ANSWER IS CORRECT
        if (flashcards[currentQuestionIndex]?.answer === message.trim()) {
        const newScore = score + 10;
        console.log(newScore)
        setScore(newScore);
        sendToServer(newScore);
        updateRight();
        setcurrentstreak(prevStreak => {
            const newStreak = prevStreak + 1;
            console.log("Current Streak", newStreak);
    
            if (newStreak > beststreak) {
                setbeststreak(newStreak);
                console.log("Best Streak PERFECT", newStreak);
            }
            return newStreak;
        });
        } else {
            updateWrong();
            if (currentstreak > beststreak) {
                setbeststreak(currentstreak);
                console.log("Best Streak NOT PERFECT:", currentstreak);
            }
            setcurrentstreak(0);
        }
    

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= flashcards.length) {
        setIsQuizFinished(true);
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
        }, 5000);
        updateTime(((totalTime - timeLeft) / totalTime) * 100)
        updateFinished();

        } else {
        setCurrentQuestionIndex(nextIndex);
        }
        
      };
      

    const sendToServer = (scoreToSend) => {
        if (ws && scoreToSend !== null) {
            console.log("Sending to server:", scoreToSend);
            ws.send(JSON.stringify({ score: scoreToSend }));
        }
    };

    // websocket set button READY
    const sendReady = (event) => {
        if (ws) {
            ws.send("ready");
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey  && !isTimeUp) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const getUsername = async (user) => {
        try {
            const response = await api.get(`/users/${user}/username`);
            console.log("username:", response.data.username);
            return response.data.username;
        } catch (error) {
            console.error('Faied to get username:', error);
        }
    }

    const fetchAndSetRankItems = async (clients_ready) => {
        const formattedRankItems = await Promise.all(
          clients_ready.map(async (clientId, index) => {
            const username = await getUsername(clientId);
            return {
              clientId,
              rank: index + 1,
              name: username,
              score: 0
            };
          })
        );
      
        setRankItems(formattedRankItems);
        setRankOne(formattedRankItems[0].clientId);
    };

    // websocket connection
    useEffect(() => {

        const socket = new WebSocket(`ws://localhost:8002/ws/${battle_id}/${client_id}`); // creates the socket for this specific client

        // socketRef.current = socket;
        
        socket.onmessage = (event) => {


            try {
                const data = JSON.parse(event.data);

                if (data.message === "All players ready") {
                    console.log("ONMESSAGE WORKED");
                    setHasGameStarted(true);
                    setShowStartModal(false);
                    setTimeLeft(totalTime); 
                    return;
                }

                if ('updated_score' in data) {
                    console.log("SCORE IS UPDATINGGGG")
                    console.log(data)

                    const handleScoreUpdate = async () => {
                        const username = await getUsername(data.name);
                        updateScore(username, data.updated_score);
                        updatePlayerRanks();
                    };
                
                    handleScoreUpdate();
                }

                if ('ready_clients' in data) {
                    const clients_ready = data.ready_clients;
                    fetchAndSetRankItems(clients_ready);
                }

                

            } catch (error) {

                
            if (event.data === "All players ready") {
                console.log("ONMESSAGE WORKED");
                setHasGameStarted(true);
                setShowStartModal(false);
                setTimeLeft(totalTime); 
                return;
            }else{
                console.error('Error:', error);  
            }
                   
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

    const updateScore = (nameToUpdate, newScore) => {
        setRankItems(prevPlayers => 
            getUpdatedScoreList(prevPlayers, nameToUpdate, newScore)
        );    
    }

    const updatePlayerRanks = () => {
        setRankItems(prevPlayers => updateRanking(prevPlayers));
    };

const handleLeaveBattle = () => {
  console.log('User is leaving the battle...');
  setShowLeaveModal(false); 
};
    
    //confetti effect when quiz is finished
    useEffect(() => {
        if ((currentQuestionIndex >= totalflashcards) && (totalflashcards > 0)) {
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
            updateUnfinished();
            updateTime(100);
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


    const getVisibleTrackers = () => getVisibleIndices(flashcards.length, currentQuestionIndex, 6);

    
    useEffect(() => {
        const handleEsc = (e) => {
          if (e.key === "Escape") setShowLeaveModal(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
      }, []);

    if (flashcards.length === 0) {
        return <div>Loading flashcards...</div>;
    }

    const updateRight = async () => {
        try {
            await api.put(`/users/${client_id}/right`);
        } catch (error) {
            console.error('Error adding right:', error);
        }
    }

    const updateWrong = async () => {
        try {
            await api.put(`/users/${client_id}/wrong`);
        } catch (error) {
            console.error('Error adding wrong:', error);
        }
    }

    const updateFinished = async () => {
        try {
            await api.put(`/users/${client_id}/finished_battle`);
        } catch (error) {
            console.error('Error adding finished_battle:', error);
        }
    }

    const updateUnfinished = async () => {
        try {
            await api.put(`/users/${client_id}/unfinished_battle`);
        } catch (error) {
            console.error('Error adding unfinished_battle:', error);
        }
    }

    const updateTime = async (time) => {
        try {
            await api.put(`/users/${client_id}/average_time`, null, {
                params: { time: time }
            });
        } catch (error) {
            console.error('Error adding unfinished_battle:', error);
        }
    }

    const updateConsistency = async (best) => {
        try {
            console.log(`/users/${client_id}/consistentcy/best`)
            await api.put(`/users/${client_id}/consistency`, null, {
                params: { correct: best }
            });
        } catch (error) {
            console.error('Error adding consistency:', error);
        }
    }

    // const sampleData = {
    //     score: 85, 
    //     totalQuestions: 10, 
    //     client_id: 'You', 
    //     players: [
    //       { name: 'Just Donatello', score: 100 },
    //       { name: 'Idunno Mann', score: 90 },
    //       { name: 'Jackie Butter', score: 80 },
    //       { name: 'You', score: 85 },
    //       { name: 'Mister X', score: 60 },
    //     ]
    //   };

    // useEffect(() => {
    //     if ((isQuizFinished || isTimeUp) && hasGameStarted) {
    //       const timeout = setTimeout(() => {
    //         navigate(`/battleresult`, {
    //           state: {
    //             score,
    //             totalQuestions: flashcards.length, 
    //             client_id: client_id, 
    //             players: rankItems
    //           }
    //         });
    //       }, 5000);
      
    //       return () => clearTimeout(timeout);
    //     }
    //   }, [isQuizFinished, isTimeUp, hasGameStarted, navigate, battle_id, score, flashcards.length]);
      
    
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
                            highlightName={currentUser}
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
                                    : flashcards[currentQuestionIndex]?.question || ""}
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

                                        {!(isTimeUp || isQuizFinished) && (
                                            <svg viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg" className="paper-plane-icon-sm">
                                            <path d="M2.61258 9L0.05132 1.31623C-0.22718 0.48074 0.63218 -0.28074 1.42809 0.09626L20.4281 9.0963C21.1906 9.4575 21.1906 10.5425 20.4281 10.9037L1.42809 19.9037C0.63218 20.2807 -0.22718 19.5193 0.05132 18.6838L2.61258 11H8.9873C9.5396 11 9.9873 10.5523 9.9873 10C9.9873 9.4477 9.5396 9 8.9873 9H2.61258z" fill="currentColor"/>
                                            </svg>
                                        )}
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
                    // wait until all players are ready
                    sendReady();
                }}
                title="Waiting for Players..."
                bodyText={`${playerCount} player${playerCount !== 1 ? 's' : ''} in lobby.\n You will have limited time to answer all flashcards.  Ready to start?`}
                cancelText="Cancel"
                submitText="Ready"
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
                    client_id={client_id} 
                />
            </div>
        </div>
    )
}

export default LiveBattle;