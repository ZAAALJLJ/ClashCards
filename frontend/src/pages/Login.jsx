import React, { useState } from 'react';
import '../css/Login.css'; 
// import { GoogleLogin } from '@react-oauth/google'; 

function Login (){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { email, password });
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
        <div className='login-content'>
            <div className='login-header'>
                <h2>WELCOME!</h2>
                <p>Battles await you challenger</p>
            </div>
            <div className="login-form-container">
                <div className='login-form'>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit">Login</button>
                    </form>
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="google-login-container">
                    {/* <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    /> */}
                </div>

                <div className="signup-link">
                    <p>Don't have an account? <a href="/signup">Sign up here</a></p>
                </div>
            </div>
        </div>
        <div className='login-image-container'>

        </div>
    </div>
  )
};

export default Login;
