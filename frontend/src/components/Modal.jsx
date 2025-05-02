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
  client_id
}) => {
    if (!show) return null;
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputField && inputValue.trim()) {
            onSubmit(inputValue);
            setInputValue(''); 
        } else if (!inputField) {
            onSubmit();
        }
    };

    if (!show) return null;

    return (
        <div 
            className="modal-overlay" 
            onClick={() => type !== 'confirm' && onClose()} 
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
                        placeholder="Enter study set name"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            if (onChange) onChange(e.target.value); // Notify parent
                        }}                        
                        required
                    />
                </form>
                )}
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
                            <Link to="/" className="modal-leave">
                                Leave
                            </Link>
                          <button className="modal-submit" onClick={onSubmit}>
                            {submitText || 'Start'}
                          </button>
                        </>
                    ) :  (
                        <>
                            <button className="modal-cancel" onClick={onClose}>
                                {cancelText || 'Cancel'}
                            </button>
                            <button className="modal-submit" onClick={() => onSubmit(inputValue)}>
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
