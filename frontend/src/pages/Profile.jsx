import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload } from 'react-icons/fa';
import '../css/Profile.css';
import defaultProfilePic from '../assets/fallback-profile-image.jpg';
import ProgressBarStatistics from '../components/ProgressBarStatistics.jsx';
import RadarChart from '../components/RadarChart.jsx';

function Profile (){
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const labels = ['WIN', 'ACC', 'CFG', 'LRN', 'CON'];
    const fullLabels = ['Wins', 'Accuracy', 'Correct First Guess', 'Learned', 'Consistency'];
    const statsRef = useRef(null);

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

    useEffect(() => {
        const user = {
          username: "Legendary Sculptor",
          profilePic: "../assets/fallback-profile-image.jpg",
          name: "Dragons A. Bool",
          email: "jun@gmail.com",
          progressArr: [75, 90, 80, 30, 60]
        };
      
        const timer = setTimeout(() => {
          setUser(user);     
          setIsLoading(false);
        }, 1000);
      
        return () => clearTimeout(timer);
      }, []);
      

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