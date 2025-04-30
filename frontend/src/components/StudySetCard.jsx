import { useNavigate } from 'react-router-dom';
import '../css/StudySetCard.css'
import { MdDelete } from "react-icons/md";

import { useState } from 'react';
import Modal from './Modal'; 

function StudySetCard({props}) {
    const navigate = useNavigate();
    const { title, flashcardCount } = props;
    
    const [showModal, setShowModal] = useState(false);

    console.log("studyset", props.id);

    
    const openModal = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const confirmDelete = () => {
        setShowModal(false);
        alert(`Deleted study set: ${title}`); 
    };

    // GO to STUDYSET
    const goStudySet = async () => {
        navigate(`/studyset/${props.id}`);
    }

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
                    <p className="flashcard-count">{props.id}</p>
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