import { useEffect, useState } from 'react'
import '../css/SoloReview.css'
import getStudysetTitle from '../services/getStudysetTitle';
import { useParams } from 'react-router-dom';

function SoloReview (){
    const { studyset_id } = useParams();
    const title = getStudysetTitle(studyset_id);

    return(
        <div className='solo-review-page'>
            <div className='solo-nav-bar'>
                <div className='solo-title'>
                    {title}
                </div>
            </div>
            <div className='solo-content-container'>
                <div className='solo-flashcard'>
                    What's 9 + 10
                </div>
                <div className='button-container'>

                </div>
            </div>
        </div>

    )
}

export default SoloReview