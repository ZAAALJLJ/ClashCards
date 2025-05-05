import { useNavigate } from 'react-router-dom';
import '../css/StudySetCard.css'
import { MdDelete, MdContentCopy } from "react-icons/md";

import { useState } from 'react';
import Modal from './Modal'; 
import api from '../api';

function StudySetCard({userID, props}) {
    const navigate = useNavigate();
    const { title } = props;
    
    const [showModal, setShowModal] = useState(false);
    const [copyMessage, setCopyMessage] = useState('');

    
    const openModal = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const confirmDelete = () => {
        setShowModal(false);
        deleteStudyset();
        alert(`Deleted study set: ${title}`); 
    };

    const deleteStudyset = async () => {
        try {
            await api.delete(`studysets/${props.id}`)
        } catch (error) {
            console.error('Error deleting studyset:', error);
        }
    };

    // GO to STUDYSET
    const goStudySet = async () => {
        navigate(`/studyset/${userID}/${props.id}`);
    }

    const copyStudySetId = (e) => {
        e.stopPropagation();

        navigator.clipboard.writeText(props.id)
            .then(() => {
                setCopyMessage('Copied!'); 
                setTimeout(() => {
                    setCopyMessage(''); 
                }, 2000);
            })
            .catch((error) => {
                console.error('Error copying text: ', error);
            });
    };
    return (
        <div>
            <div className="study-set-card" onClick={goStudySet}>
                <div className="card-overlay">
                    <button className="card-btn" onClick={openModal}>
                        <MdDelete className='btn-delete'/>
                    </button>
                </div>
                <div className='card-title'>
                    <h3>{title}</h3>
                    <div className="title-line"></div>
                    <div className='detail-container'>
                        <p className="flashcard-count">StudySet ID: {props.id}</p>
                        <button className="copy-btn" onClick={copyStudySetId}>
                            <MdContentCopy className="copy-icon" />
                        </button>
                        {copyMessage && (
                            <span className={`copy-message ${copyMessage ? 'show' : ''}`}>
                                {copyMessage}
                            </span>
                        )}
                    </div>
                    
                </div>
            </div>
            <Modal 
                show={showModal}
                onClose={closeModal}
                onSubmit={confirmDelete}
                title="Delete Study Set?"
                bodyText={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
                cancelText="Cancel"
                submitText="Delete"
                type="delete"
            />
        </div>
    );
}
export default StudySetCard;