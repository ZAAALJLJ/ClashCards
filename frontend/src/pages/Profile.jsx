import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload } from 'react-icons/fa';
import '../css/Profile.css';
import defaultProfilePic from '../assets/fallback-profile-image.jpg';
import ProgressBarStatistics from '../components/ProgressBarStatistics.jsx';
import RadarChart from '../components/RadarChart.jsx';
import { useParams } from 'react-router-dom';
import getUsername from '../services/getUsername.js';
import profilePic from '../assets/profilepic.png'
import api from '../api.js';
import getEmail from '../services/getEmail.js';

function Profile (){
    const {user_id} = useParams();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const labels = ['WIN', 'ACC', 'PER', 'AVG', 'CON'];
    const fullLabels = ['Winrate', 'Accuracy', 'Perseverance', 'Average Time', 'Consistency'];
    const statsRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const [fetchedUsername, fetchedEmail] = await Promise.all([
                getUsername(user_id),
                getEmail(user_id)
            ]);

            setUsername(fetchedUsername || 'Unknown User');
            setEmail(fetchedEmail || 'No Email');
      
            const response = await api.get(`/users/${user_id}`);
            const data = response.data;
      
            
            if (data) {
              setUser({
                title: data.title || "Legendary Sculptor",
                profilePic: data.profilePic || defaultProfilePic,
                username: fetchedUsername,
                email: fetchedEmail,
                progressArr: [data.winRate, data.accuracy, data.perseverance, data.avg, data.consistency]
              });
            } else {
              console.error("User data is null or undefined.");
            }
      
          } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoading(false);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchUserData();
      }, [user_id]);
      

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultProfilePic;
        e.target.className = "profile-pic fallback-pic";
    };

    const downloadPDF = () => {
        const input = statsRef.current;
        const originalBackground = input.style.backgroundColor;

        input.style.backgroundColor = '#11234b';

        html2canvas(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('profile-stats.pdf');

          input.style.backgroundColor = originalBackground;
        });
      };

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
            setwinRate(((response.data.wins / (response.data.wins + response.data.lose)) * 100));
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
          title: "Legendary Sculptor",
          profilePic: profilePic,
          username: username,
          email: email,
          progressArr: [winRate, accuracy, perseverace, avg, consistency]
        };
      
        const timer = setTimeout(() => {
          setUser(user);     
          setIsLoading(false);
        }, 1000);
      
        return () => clearTimeout(timer);
    }, [winRate]);

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
                                    <h2>{user?.title}</h2>

                                )}
                            </div>
                        </div>
                        <div className='user-details-container'>
                            {[
                                { label: 'Name', content: user?.username },
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
                <div className="profile-stats"  ref={statsRef}>
                    <div className='stats-label-container'>
                        <span className='profile-stats-label'>Performance Statistics</span>
                        <button onClick={downloadPDF} className="download-btn" aria-label="Download PDF">
                            <FaDownload size={20} />
                        </button>
                    </div>
                    
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