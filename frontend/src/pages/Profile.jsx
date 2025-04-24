import '../css/Profile.css';
import defaultProfilePic from '../assets/fallback-profile-image.jpg';

function Profile (){

    const user = {
        username: "Legendary Sculptor",
        profilePic: "../assets/fallback-profile-image.jpg"
    };

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
                                <img 
                                    src={user.profilePic} 
                                    alt={`${user.username}'s profile`}
                                    className="profile-pic"
                                    onError={handleImageError}
                                />
                            </div>
                            <div className='username-display'>
                                <h2>{user.username}</h2>
                            </div>
                        </div>
                        <div className='user-details-container'>
                            <div className='user-info-container'>
                                <span className='user-details-label'>Name</span>
                                <span className='user-detail-content'>Dragons A. Bool</span>
                            </div>
                            <div className='user-info-container'>
                                <span className='user-details-label'>Email</span>
                                <span className='user-detail-content'>jun@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-stats">
                    <span className='profile-stats-label'>Performance Statistics</span>
                    <div className='user-chart-container'>
                        chart
                    </div>
                    <div className='user-statistics-progress'>
                        <div className='statistics-container'>
                            <div className='progress-bar-label'>Wins: </div>
                            <div className='progress-bar-container'><div>---</div></div>
                        </div>
                        <div className='statistics-container'>
                            <div className='progress-bar-label'>Accuracy: </div>
                            <div className='progress-bar-container'><div>---</div></div>
                        </div> 
                        <div className='statistics-container'>
                            <div className='progress-bar-label'>Correct First Guess: </div>
                            <div className='progress-bar-container'><div>---</div></div>
                        </div> 
                        <div className='statistics-container'>
                            <div className='progress-bar-label'>Learned: </div>
                            <div className='progress-bar-container'><div>---</div></div>
                        </div> 
                        <div className='statistics-container'>
                            <div className='progress-bar-label'>Consistency: </div>
                            <div className='progress-bar-container'><div>---</div></div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Profile;