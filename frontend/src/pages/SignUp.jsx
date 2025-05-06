import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/SignUp.css'; 
import api from '../api';
import { useNavigate } from 'react-router-dom';

function SignUp (){
    const navigate = useNavigate();
    const [allUser, setAllUser] = useState([]);
    const [user, setUser] = useState({username: '', email: '', password: ''});
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value});
        validateForm({ ...user, [name]: value }, confirmPassword);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validateForm(user, e.target.value);
    };

    const validateForm = (currentUser, currentConfirmPassword) => {
        const hasUpperCase = /[A-Z]/.test(currentUser.password);
        const hasLowerCase = /[a-z]/.test(currentUser.password);
        const hasNumber = /[0-9]/.test(currentUser.password);
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser.email);

        const isValid = 
            currentUser.username.length >= 3 &&
            currentUser.username.length <= 50 &&
            currentUser.password.length >= 6 &&
            currentUser.password === currentConfirmPassword &&
            hasUpperCase && hasLowerCase && hasNumber &&
            validEmail;

        setIsFormValid(isValid);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    if (user.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    try {
        console.log('Sending signup request with:', { ...user, password: '[REDACTED]' });
        const response = await api.post('/signup/', {credentials: user}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Signup response:', response);

        if (response.status === 201 || response.status === 200) {
            // Save user data to localStorage for session management
            localStorage.setItem('user', JSON.stringify(response.data));
            alert('Account created successfully!');
            // Reset form
            setUser({username: '', email: '', password: ''});
            setConfirmPassword('');
            // Navigate to home page with user_id
            navigate(`/${response.data.user_id}`);
        }
    } catch (error) {
        console.error('Error adding user:', error);
        if (error.response) {
            alert(error.response.data.detail || 'Error creating account');
        } else {
            alert('Error connecting to server. Please check if the server is running.');
        }
    }
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
                                <label htmlFor="username">User Name (3-50 characters)</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username"
                                    value={user.username}
                                    onChange={handleInputChange} 
                                    required 
                                    minLength={3}
                                    maxLength={50}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password (min 6 chars, 1 uppercase, 1 lowercase, 1 number)</label>
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

                            <button type="submit" disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed', color: isFormValid ? 'white' : '#666666' }}>Sign up</button>
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
