import React, { useState } from 'react';
import '../css/Login.css'; 
import api from '../api';
import { useNavigate } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google'; 

function Login (){
  const navigate = useNavigate();
  const [user, setUser] = useState({username: '', password: ''});

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/login/', user);
        console.log("Login successful", user);
        console.log("Loglog id:", response.data);
        navigate(`/${response.data._id}`);
    } catch (error){
        console.error("Login error: ", error);
    }
    console.log('Login submitted', { username, password });
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
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    value={user.password}
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>

                            <button type="submit">Login</button>
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
