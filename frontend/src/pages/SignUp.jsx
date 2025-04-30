import React, { useState } from 'react';
import '../css/SignUp.css'; 
import api from '../api';

function SignUp (){
    const [allUser, setAllUser] = useState([]);
    const [user, setUser] = useState({username: '', password: ''});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value});
    }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        await api.post('/signup/', user);
        setAllUser([...allUser, user]);
        setUser({username: '', password: ''})
    } catch (error) {
        console.error('Error adding user:', error);
    }
    console.log('Sign up submitted', { user });
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
                                    type="text" 
                                    id="password"
                                    name="password" 
                                    value={user.password}
                                    onChange={handleInputChange} 
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
