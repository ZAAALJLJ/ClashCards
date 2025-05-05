import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/SignUp.css'; 
import api from '../api';
import { useNavigate } from 'react-router-dom';

function SignUp (){
    const navigate = useNavigate();
    const [allUser, setAllUser] = useState([]);
    const [error, setError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({
        lowercase: false,
        uppercase: false,
        number: false,
        special: false
    });
    const [user, setUser] = useState({username: '', password: ''});
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFormFilled, setIsFormFilled] = useState(false);

    const validatePassword = (password) => {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordErrors({
            lowercase: !hasLower,
            uppercase: !hasUpper,
            number: !hasNumber,
            special: !hasSpecial
        });

        return hasLower && hasUpper && hasNumber && hasSpecial;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newUser = { ...user, [name]: value};
        setUser(newUser);
        if (error) {
            setError('');
        }
        if (name === 'password') {
            setConfirmPassword('');
            validatePassword(value);
        }
        checkFormFilled(newUser, confirmPassword);
    }

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        checkFormFilled(user, newConfirmPassword);
    };

    const checkFormFilled = (currentUser, currentConfirmPassword) => {
        const isPasswordValid = validatePassword(currentUser.password);
        setIsFormFilled(
            currentUser.username.trim() !== '' && 
            currentUser.password.trim() !== '' && 
            currentConfirmPassword.trim() !== '' &&
            currentUser.password === currentConfirmPassword &&
            isPasswordValid
        );
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
                                <label htmlFor="username">Username</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username"
                                    value={user.username}
                                    onChange={handleInputChange} 
                                    required 
                                    minLength="3"
                                    maxLength="50"
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
                                    <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
                                <div className="password-requirements">
                                    <p className={passwordErrors.lowercase ? "requirement-error" : "requirement-met"}>
                                        ✓ Lowercase letter
                                    </p>
                                    <p className={passwordErrors.uppercase ? "requirement-error" : "requirement-met"}>
                                        ✓ Uppercase letter
                                    </p>
                                    <p className={passwordErrors.number ? "requirement-error" : "requirement-met"}>
                                        ✓ Number
                                    </p>
                                    <p className={passwordErrors.special ? "requirement-error" : "requirement-met"}>
                                        ✓ Special character
                                    </p>
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

                            <button 
                                type="submit" 
                                className={isFormFilled ? 'button-filled' : ''}
                            >
                                Sign up
                            </button>
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
