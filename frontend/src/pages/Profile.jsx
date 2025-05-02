import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
import defaultProfilePic from '../assets/fallback-profile-image.jpg';
import ProgressBarStatistics from '../components/ProgressBarStatistics.jsx';
import RadarChart from '../components/RadarChart.jsx';
import { useParams } from 'react-router-dom';
import api from '../api.js';

function Profile (){
    const {user_id} = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const labels = ['WIN', 'ACC', 'CFG', 'LRN', 'CON'];
    const fullLabels = ['Wins', 'Accuracy', 'Correct First Guess', 'Learned', 'Consistency'];

    // FETCH Wins and Lose
    const [winRate, setwinRate] = useState(null);
    // FETCH Right and Wrong
    const [accuracy, setAccuracy] = useState(null);
    // FETCH Finished and unfinished data
    const [perseverace, setPerseverance] = useState(null);
    // FETCH Average time
    const [avg, setAverage] = useState(null);
    // FETCH Consistency
    const [consistency, setConsistency] = useState(null);

    const fetchWinrate = async () => {
        try {
            const response = await api.get(`/users/${user_id}`);
            setwinRate(((response.data.wins / (response.data.wins + response.data.lose) * 100)));
            setAccuracy(((response.data.right / (response.data.right + response.data.wrong)) * 100));
            setAccuracy(((response.data.right / (response.data.right + response.data.wrong)) * 100));
            setPerseverance(((response.data.finish / (response.data.finish + response.data.unfinish)) * 100));
            setAverage(response.data.avg);
            setConsistency(response.data.cons);
            console.log('Fetched WINRATE: ', response.data.wins / (response.data.wins - response.data.lose) * 100);
        } catch (error) {
            console.error('Error fetching WINRATE: ', error);
        }
    };


    // FETCH useEffect
    useEffect(() => {
        fetchWinrate();
    }, [])

    useEffect(() => {
        const user = {
          username: "Legendary Sculptor",
          profilePic: "../assets/fallback-profile-image.jpg",
          name: "Dragons A. Bool",
          email: "jun@gmail.com",
          progressArr: [winRate, accuracy, perseverace, avg, consistency]
        };
      
        const timer = setTimeout(() => {
          setUser(user);     
          setIsLoading(false);
        }, 1000);
      
        return () => clearTimeout(timer);
    }, [winRate]);
      

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultProfilePic;
        e.target.className = "profile-pic fallback-pic";
    };

    return (
        <div className="profile-page">
            <div className="profile-nav-bar">
                <div className = "profile-title">
                    Profile
                </div>
            </div>
            <div className='profile-content'>
                <div className="profile-info-container">
                    <div className='user-profile-container'>
                        <div className='user-profile'>
                            <div className='profile-pic-container'>
                                {isLoading ? (
                                    <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '50%' }}>
                                        <div className="skeleton-shimmer" />
                                    </div>
                                ) : (
                                    <img 
                                        src={user.profilePic} 
                                        alt={`${user?.username}'s profile`}
                                        className="profile-pic"
                                        onError={handleImageError}
                                    />
                                )}
                            </div>
                            <div className='username-display'>
                                {isLoading ? (
                                    <div className="skeleton" style={{ width: '60%', height: '20px', borderRadius: '4px', marginTop: '1rem' }}>
                                        <div className="skeleton-shimmer" />
                                    </div>
                                ) : (
                                    <h2>{user.username}</h2>
                                )}
                            </div>
                        </div>
                        <div className='user-details-container'>
                            {[
                                { label: 'Name', content: user?.name },
                                { label: 'Email', content: user?.email }
                            ].map(({ label, content }) => (
                                <div className='user-info-container' key={label}>
                                    <span className='user-details-label'>{label}</span>
                                    {isLoading ? (
                                        <div className="skeleton" style={{ width: '80%', height: '16px', marginTop: '0.5rem' }}>
                                            <div className="skeleton-shimmer" />
                                        </div>
                                    ) : (
                                        <span className='user-detail-content'>{content}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="profile-stats">
                    <span className='profile-stats-label'>Performance Statistics</span>
                    <div className='user-chart-container'>
                        {isLoading ? (
                            <div className="skeleton" style={{ height: '200px', width: '200px' }}>
                                <div className="skeleton-shimmer"></div>
                            </div>
                        ) : (
                            <RadarChart
                                userData={user.progressArr}
                                labels={labels}
                                fullLabels={fullLabels}
                            />
                        )}
                    </div>
                    <div className='user-statistics-progress'>
                        {fullLabels.map((label, i) => (
                            <div className='statistics-container' key={label}>
                                <div className='progress-bar-label'>{label}:</div>
                                <div className='progress-bar-container'>
                                {isLoading ? (
                                    <div className="skeleton progress-skeleton">
                                    <div className="skeleton-shimmer"></div>
                                    </div>
                                ) : (
                                    <ProgressBarStatistics progressPercentage={user.progressArr[i]} />
                                )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;