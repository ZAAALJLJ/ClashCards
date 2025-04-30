import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/StudySet.css';
import FlashcardCarousel from '../components/FlashcardCarousel';
import Leaderboard from '../components/LeaderboardCard';
import crownLogo from '../assets/crown.png';
import api from '../api';
import Modal from '../components/Modal';



function StudySet (){
    const { id } = useParams();
    const [flashcards, setCards] = useState([]);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); 

    // get user for leaderboard highlight
    useEffect(() => {
        setCurrentUser("Jackie Butter"); 
        console.log("Current User:", currentUser); 
    }, [currentUser]);

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
        navigate(`/createflashcard/${id}`);
    }

    // Go to SOLOREVIEW
    const goSoloReview = async () => {
        navigate(`/soloreview/${id}`);
    }

    // Go to LIVEBATTLE
    const goBattle = async (battle_id) => {
        navigate(`/livebattle/${battle_id}/${id}`);
    }


     const [rankItems, setRankItems] = useState([]);
     const [showLeaderboard, setShowLeaderboard] = useState(false);
     const leaderboardRef = useRef(null);

        useEffect(() => {
            setTimeout(() => {
              setRankItems([
                { rank: 1, name: 'Just Donatello', score: 100 },
                { rank: 2, name: 'Idunno Mann', score: 90 },
                { rank: 3, name: 'Jackie Butter', score: 80 },
              ]);
            }, 1000); 
          }, []);
    
    
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
                    <button className="btn-home" onClick={goSoloReview}>Solo Review Mode</button>
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
                        <p>Loading</p>
                    )}
                </div>
                <div className='leaderboard large-screen-only'>
                    <Leaderboard 
                        title = "Leaderboard"
                        showCrown = {true} 
                        rankItems = {rankItems}
                        isLoading = {false}
                    />
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