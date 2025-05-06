import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/Login.css'; 
import api from '../api';
import { useNavigate } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google'; 

function Login (){
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({username: '', password: ''});

    const [isFormValid, setIsFormValid] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedUser = { ...user, [name]: value };
        setUser(updatedUser);
        validateForm(updatedUser);
    }

    const validateForm = (currentUser) => {
        const isValid = 
            currentUser.username.length >= 3 &&
            currentUser.username.length <= 50 &&
            currentUser.password.length >= 6;
        setIsFormValid(isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            console.log("USER", {credentials: user});
            const response = await api.post('/login/', user);
            
            if (response.data && response.data.message === "Login successful") {
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify({
                    username: response.data.username,
                    email: response.data.email,
                    userId: response.data.user_id
                }));
                
                // Show success message
                alert('Login successful!');
                
                // Reset form
                setUser({username: '', password: ''});
                
                // Navigate to home page with user_id
                navigate(`/${response.data.user_id}`);
            } else {
                alert('Invalid login response from server');
            }
        } catch (error) {
            console.error("Login error: ", error);

        console.log('Login submitted', { username: user.username, password: user.password });

            if (error.response) {
                alert(error.response.data.detail || 'Invalid username or password');
            } else {
                alert('Error connecting to server. Please try again.');
            }
        }
    };

    const handleGoogleLoginSuccess = (response) => {
        console.log('Google login successful', response);
        // handle token here
    };

    const handleGoogleLoginError = (error) => {
        console.log('Google login failed', error);
    };


  return (
    <div className='login-page'>
        <div className='login-container'>
            <div className='login-content'>
                <div className='login-header'>
                    <h2>WELCOME!</h2>
                    <p>Battles await you challenger</p>
                </div>
                <div className="login-form-container">
                    <div className='login-form'>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">User Name</label>
                                <input 
                                    type="text" 
                                    id="username"
                                    name="username" 
                                    value={user.username}
                                    onChange={handleInputChange} 
                                    className={error ? "error-input" : ""}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className='input-with-icon'>
                                     <input 
                                        type={showPassword ? "text" : "password"}
                                        id="password" 
                                        name="password" 
                                        value={user.password}
                                        onChange={handleInputChange} 
                                        className={error ? "error-input" : ""}
                                        required 
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                {error && <div className="error-message">{error}</div>}

                            </div>

                            <button 
                                type="submit" 
                                disabled={!isFormValid} 
                                style={{ 
                                    opacity: isFormValid ? 1 : 0.5, 
                                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                                    color: isFormValid ? 'white' : '#666666'
                                }}
                            >
                                Login
                            </button>
                        </form>
                    </div>
{/* 
                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="google-login-container">
                        <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                        /> 
                    </div> */}

                    <div className="signup-link">
                        <p>Don't have an account? <a href="/signup">Sign up Here</a></p>
                    </div>
                </div>
            </div>
            <div className='login-image-container'>

            </div>
        </div>
        
    </div>
  )
};

export default Login;
