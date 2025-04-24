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
                <div className="profile-stats">
                    stats
                </div>
            </div>
            
        </div>
    );
}

export default Profile;