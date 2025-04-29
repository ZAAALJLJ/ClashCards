import React, { useState } from 'react';
import '../css/SignUp.css'; 

function SignUp (){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up submitted', { username, password });
  };



  return (
    <div className='signup-page'>
        <div className='signup-container'>
            <div className='signup-content'>
                <div className='signup-header'>
                    <h2>Sign Up</h2>
                    <p>Battles await you challenger</p>
                </div>
                <div className="signup-form-container">
                    <div className='signup-form'>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">User Name</label>
                                <input 
                                    type="username" 
                                    id="username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>

                            <button type="submit">Sign up</button>
                        </form>
                    </div>

                    <div className="login-link">
                        <p>Already have an account? <a href="/login">Log in</a></p>
                    </div>
                </div>
            </div>
            <div className='signup-image-container'>

            </div>
        </div>
        
    </div>
  )
};

export default SignUp;
