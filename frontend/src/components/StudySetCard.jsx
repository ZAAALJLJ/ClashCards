import { useNavigate } from 'react-router-dom';
import '../css/StudySetCard.css'
import { MdDelete } from "react-icons/md";

function StudySetCard({props}) {
    const navigate = useNavigate();
    const { title, flashcardCount } = props; 

    function onEditClick() {
        alert("Edit Clicked");
    }
    console.log("studyset", props.id);
    // GO to STUDYSET
    const goStudySet = async () => {
        navigate(`/studyset/${props.id}`);
    }

    return (
        <div className="study-set-card" onClick={goStudySet}>
            <div className="card-overlay">
                <button className="card-btn" onClick={onEditClick}>
                    <MdDelete className='btn-delete'/>
                </button>
            </div>
            <div className='card-title'>
                <h3>{title}</h3>
                <div className="title-line"></div>
                <p className="flashcard-count">{flashcardCount} Flashcards</p>
            </div>
        </div>
    );
}
export default StudySetCard;