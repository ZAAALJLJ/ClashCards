import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/SignUp.css'; 
import api from '../api';
import { useNavigate } from 'react-router-dom';

function SignUp (){
    const navigate = useNavigate();
    const [allUser, setAllUser] = useState([]);
    const [user, setUser] = useState({username: '', password: ''});
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value});
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (user.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    
      
      if (user.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

    try {
        await api.post('/signup/', user);
        setAllUser([...allUser, user]);
        setUser({username: '', password: ''})
        navigate(`/login`);
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
                                <div className='input-with-icon'>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password" 
                                        value={user.password}
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                        >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmpassword">Confirm Password</label>
                                <div className="input-with-icon">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmpassword"
                                        name="confirmpassword"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        required
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
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
