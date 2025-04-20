import { useState } from "react";
import '../css/Flashcard.css'

function Flashcard ({front, back}){
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="flashcard-scene" onClick={() => setFlipped(!flipped)}>
            <div className={`flashcard ${flipped ? 'is-flipped' : ''}`}>
                <div className="flashcard-face flashcard-front">
                    {front}
                </div>
                <div className="flashcard-face flashcard-back">
                    {back}
                </div>
            </div>
        </div>
    )
}

export default Flashcard;