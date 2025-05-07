import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../css/Modal.css';

const Modal = ({ 
  show, 
  onClose, 
  onSubmit, 
  title, 
  bodyText, 
  inputField, 
  cancelText, 
  submitText, 
  placeholder, 
  type,
  onChange, 
  client_id, 
  errorText
}) => {
    if (!show) return null;
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputField && !inputValue.trim()) {
            
            setInputError(true);
        } else {
            
            setInputError(false);
            if (inputField) {
                onSubmit(inputValue);
                setInputValue('');
            } else {
                onSubmit();
            }
        }
    };

    const handleReadyClick = () => {
        setIsReady(true); 
        onSubmit(); 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() === '') {
            e.preventDefault();
        }
    };

    if (!show) return null;

    return (
        <div 
            className="modal-overlay" 
            onClick={(e) => {
                if (type !== 'confirm' && !e.target.closest('.modal-leave')) {
                    onClose();
                }
            }} 
        >

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                {bodyText && bodyText.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                ))}
                {inputField && (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder={placeholder || "Enter study set name"} 
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                if (onChange) onChange(e.target.value); // Notify parent
                            }}     
                            onKeyDown={handleKeyDown}                   
                            required
                        />
                    </form>
                )}

                {errorText && (<div className="modal-error-text">{errorText}</div>)}

                <div className="modal-buttons">
                    {type === 'leave' ? (
                        <>
                            <button className="modal-continue" onClick={onSubmit}>
                                Continue Battle
                            </button>
                            <Link to={`/${client_id}`} className="modal-leave">
                                Leave Battle
                            </Link>
                        </>
                    ) : type === 'delete' ? (
                        <>
                           <button className="modal-continue" onClick={onClose}>
                                {cancelText || 'Cancel'}
                            </button>
                            <button className="modal-delete" onClick={onSubmit}>
                                {submitText || 'Delete'}
                            </button>
                        </>
                    ) : type === 'confirm' ? (
                        <>
                            <Link to={`/${client_id}`} className="modal-leave">
                                Leave
                            </Link>
                            <button 
                                className={`modal-submit ${isReady ? 'ready' : ''}`} 
                                onClick={handleReadyClick} 
                                disabled={isReady}
                            >
                                {isReady ? 'Ready' : submitText || 'Start'}
                            </button>

                        </>
                    ) :  (
                        <>
                            <button className="modal-cancel" onClick={onClose}>
                                {cancelText || 'Cancel'}
                            </button>
                            <button 
                              className="modal-submit" 
                              onClick={() => onSubmit(inputValue)} 
                            >
                                {submitText || 'Submit'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
