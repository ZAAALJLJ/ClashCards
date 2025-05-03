import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/StudySet.css';
import FlashcardCarousel from '../components/FlashcardCarousel';
import Leaderboard from '../components/LeaderboardCard';
import crownLogo from '../assets/crown.png';
import api from '../api';
import Modal from '../components/Modal';



function StudySet (){
    const { user_id, id } = useParams();
    const [flashcards, setCards] = useState([]);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); 
    const [leaderboardError, setLeaderboardError] = useState(false);

    // get user for leaderboard highlight
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
              const response = await api.get(`/users/${user_id}/username`); 
              setCurrentUser(response.data.username); 
            } catch (error) {
              console.error('Failed to fetch user data:', error);
            }
          };
      
          if (user_id) {
            fetchCurrentUser();
          }
        }, [user_id]);

    //nav bar toggle
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // MODAL stuff
    const [showModal, setShowModal] = useState(false);
    
    // GET all cards
    const fetchCards = async () => {
        try {
            const response = await api.get(`/flashcards/${id}`);
            console.log('Fetched cards:', response.data);
            setCards(response.data);
        } catch(error) {
            console.error('Error fetching cards:', error);            
        }
    };

    // GET title
    const fetchTitle = async () => {
        try { 
            const response = await api.get(`/studysets/${id}`);
            setTitle(response.data.title);
            console.log(response.data);
        } catch (error){
            console.error('Error title studyset:', error);            
        }
    };

    // SET cards
    useEffect(() => {
        fetchCards();
        fetchTitle();
    }, []);

    // Go to CREATEFLASHCARD
    const goCreateFC = async () => {
        navigate(`/createflashcard/${user_id}/${id}`);
    }

    // Go to SOLOREVIEW
    const goSoloReview = async () => {
        navigate(`/soloreview/${id}`);
    }

    // Go to LIVEBATTLE
    const goBattle = async (battle_id) => {
        navigate(`/livebattle/${user_id}/${battle_id}/${id}`);
    }


     const [rankItems, setRankItems] = useState([]);
     const [showLeaderboard, setShowLeaderboard] = useState(false);
     const leaderboardRef = useRef(null);

        useEffect(() => {
            const fetchStudyset = async () => {
                try {
                    const response = await api.get(`/studysets/${id}`);
                    const studyset = response.data

                    if (studyset.winners && studyset.winners.length > 0) {
                        const ranked = await Promise.all(
                            [...studyset.winners].map(async (item, index) => ({
                                rank: index + 1,
                                name: await getUsername(item.name), 
                                score: item.wins,
                            }))
                        );
                        setRankItems(ranked);
                    } else {
                        setLeaderboardError(true); 
                    }

                    getUsername(user_id);
                } catch (error) {
                    console.error('Failed to fetch studyset:', error);
                    setLeaderboardError(true);
                }
            }

            if (id) {
                fetchStudyset();
              }
        }, [id]);
    
    const getUsername = async (user) => {
        try {
            const response = await api.get(`/users/${user}/username`);
            console.log("username:", response.data.username);
            return response.data.username;
        } catch (error) {
            console.error('Faied to get username:', error);
        }
    }
          useEffect(() => {
            const handleClickOutside = (event) => {
                if (
                    leaderboardRef.current &&
                    !leaderboardRef.current.contains(event.target)
                ) {
                    setShowLeaderboard(false);
                }
            };
    
            if (showLeaderboard) {
                document.addEventListener("click", handleClickOutside);
            }

            return () => document.removeEventListener("click", handleClickOutside);
        }, [showLeaderboard]);


    return (
        <div className="study-set">
            <div className="study-set-nav-bar">
                <div className="studyset-title">
                    {title}
                </div>
                <div className={`home-buttons ${isMenuOpen ? "show" : ""}`}>
                    <button className="btn-home" onClick={goCreateFC}>+ Create Flashcard</button>
                    <button className="btn-home" onClick={() => setShowModal(true)}>Battle</button>
                    {/* <button className="btn-home" onClick={goSoloReview}>Solo Review Mode</button> */}
                </div>
                <div className="hamburger-icon" onClick={toggleMenu}>
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                </div>
            </div>
            <div className="study-content-container">
                <div className="flashcard-container">
                    {flashcards.length > 0 ? (
                        <FlashcardCarousel cards={flashcards} />
                    ) : (
                        <p className='unavailable-message'>No flashcards available yet. Please create some!</p>
                    )}
                </div>
                <div className='leaderboard large-screen-only'>
                    {leaderboardError ? (
                        <p className='unavailable-message'>Leaderboard unavailable. Please try again later.</p>
                    ) : (
                        <Leaderboard 
                            title="Leaderboard"
                            showCrown={true}
                            rankItems={rankItems}
                            isLoading={false}
                            highlightName={currentUser}
                        />
                    )}
                </div>
                <div className="floating-leaderboard-toggle small-screen-only">
                    <button
                        className="crown-button"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            setShowLeaderboard((prev) => !prev);
                        }}
                    >
                         <img src={crownLogo} alt="Crown" className="crown-icon" />
                    </button>

                    {showLeaderboard && (
                        <div className="floating-leaderboard" ref={leaderboardRef}>
                            <Leaderboard 
                                title="Leaderboard" 
                                showCrown={false} 
                                rankItems={rankItems} 
                                isLoading={false} 
                                highlightName={currentUser}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={goBattle}
                title="Lobby Code"
                bodyText="Enter a Lobby Code to create or join a lobby"
                inputField={true}
                cancelText="Cancel"
                submitText="Enter"
                placeholder="Enter Lobby code"
            />
        </div>
    );
}

export default StudySet;