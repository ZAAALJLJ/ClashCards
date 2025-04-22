import '../css/CreateFlashcard.css'

function CreateFlashcard () {
    return (
        <div className="create-page">
            <div className="create-nav-bar">
                <div className="create-title">
                    Mathematics
                </div>
            </div>
            <div className="create-content">
                <div className="create-flashcard-content">
                    <div className='create-qa-container'>
                        <div className='create-question'>
                            <div className='question-title'>
                                Question
                            </div>
                            <input className='question' type='text' placeholder='Type question here'/>
                        </div>
                        <div className='create-answer'>
                            <div className='answer-title'>
                                Answer
                            </div>
                            <input className='answer' type='text' placeholder='Type answer here'/>
                        </div>
                        <div className='save-flashcard-btn'>
                            <button className='btn-save'>Save</button>
                            <button className='btn-save'>Delete</button>
                        </div>
                    </div>
                </div>
                <div className="created-flashcards">
                    <button className="btn-create">
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateFlashcard;