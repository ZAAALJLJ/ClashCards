import '../css/StudySetCard.css'
import { MdDelete } from "react-icons/md";

function StudySetCard({props}) {

    function onEditClick() {
        alert("Edit Clicked");
    }

    return (
        <div className="study-set-card">
            <div className="card-overlay">
                <button className="card-btn" onClick={onEditClick}>
                    <MdDelete className='btn-delete'/>
                </button>
            </div>
            <div className='card-title'>
                <h3>{props.title}</h3>
            </div>
            <div className='card-description'>
                <p>{props.description}</p>
            </div>
        </div>
    );
}
export default StudySetCard;