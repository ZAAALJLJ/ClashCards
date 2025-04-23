import { useEffect, useState } from 'react';
import '../css/CreateFlashcard.css'
import api from '../api'

function CreateFlashcard () {
    const [flashcards, setCards] = useState([]);
    const [flashcard, setCard] = useState({question: '', answer: ''});

    // GET all cards
    const fetchCards = async () => {
        try {
            const response = await api.get('/flashcards/');
            console.log('Fetched cards:', response.data);
            setCards(response.data);
        } catch(error) {
            console.error('Error fetching cards:', error);
        }
    };

    // SET cards
    useEffect(() => {
        fetchCards();
    }, []);

    // SET single card
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCard({ ...flashcard, [name]: value});
    }

    // ADD cards to db
    const handleAddCard = async () => {
        try {
            await api.post('/flashcards/', flashcard);
            setCards([...flashcards, flashcard]);
            setCard({ question: '', answer: ''});
        } catch (error) {
            console.error('Error adding cards:', error);
        }
    };

    return (
        <div className="create-page">
            <div className="create-nav-bar">
                <div className="create-title">
                    Mathematics
                </div>
            </div>
            <div className="create-content">
                <div className="create-flashcard-content">
                    <form className='create-qa-container' onSubmit={handleAddCard}>
                        <div className='create-question'>
                            <label htmlFor='question' className='question-title'>
                                Question
                            </label>
                            <input 
                                className='question' 
                                type='text' 
                                id='question'
                                name='question'
                                placeholder='Type question here'
                                value={flashcard.question}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='create-answer'>
                            <label htmlFor='answer' className='answer-title'>
                                Answer
                            </label>
                            <input 
                                className='answer' 
                                type='text' 
                                id='answer'
                                name='answer'
                                placeholder='Type answer here'
                                value={flashcard.answer}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='save-flashcard-btn'>
                            <button type='button' className='btn-save' onClick={handleAddCard}>Save</button>
                            <button type='button' className='btn-save'>Delete</button>
                        </div>
                    </form>                

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