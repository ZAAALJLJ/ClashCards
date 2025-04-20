import '../css/StudySet.css';
import Flashcard from '../components/Flashcard';

function StudySet (){
    return (
        <div className="study-set">
            <div className="study-set-nav-bar">
                <div className="studyset-title">
                    Mathematics
                </div>
                <div className="home-buttons">
                    <button className="btn-home">+ Create Flashcard</button>
                    <button className="btn-home">Battle</button>
                    <button className="btn-home">Solo Review Mode</button>
                </div>
            </div>
            <div className="study-content-container">
                <div className="flashcard-container">
                    <Flashcard front={"fro"} back={"ba"}/>
                </div>
                <div className="leaderboard"></div>
            </div>
        </div>
    );
}

export default StudySet;