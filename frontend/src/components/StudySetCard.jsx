import { useNavigate } from 'react-router-dom';
import '../css/StudySetCard.css'
import { MdDelete } from "react-icons/md";

function StudySetCard({props}) {
    const navigate = useNavigate();

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
                <h3>{props.title}</h3>
            </div>
        </div>
    );
}
export default StudySetCard;