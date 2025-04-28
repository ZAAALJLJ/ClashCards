import React, { useState } from 'react';
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
  type
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
        <div className="modal-overlay" onClick={() => onClose()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                {bodyText && <p>{bodyText}</p>}
                {inputField && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter study set name"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
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
                            <button className="modal-leave" onClick={onClose}>
                                Leave Battle
                            </button>
                        </>
                    ) : (
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

// const [showLeaveModal, setShowLeaveModal] = useState(false);

// const handleLeaveBattle = () => {
//   console.log('User is leaving the battle...');
//   setShowLeaveModal(false); 
// };

// return (
//     <div>
//       <button onClick={() => setShowLeaveModal(true)}>Leave Battle</button>

            // <Modal
            //     show={showLeaveModal}
            //     onClose={() => setShowLeaveModal(false)}
            //     onSubmit={handleLeaveBattle}
            //     title="Leave the Battle?"
            //     bodyText="Your progress will be lost if you leave now. Are you sure?"
            //     cancelText="Continue Battle"
            //     submitText="Leave Battle"
            //     type="leave" 
            // />

//     </div>
//   );
// }

//livebattle modal 

export default Modal;
