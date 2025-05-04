import { useEffect, useState } from 'react';
import '../css/CreateFlashcard.css'
import api from '../api'
import 'font-awesome/css/font-awesome.min.css';
import CreatedFlashcard from '../components/CreatedFlashcard';
import { useParams, useNavigate } from 'react-router-dom';


function CreateFlashcard () {
    const { studyset_id, userID } = useParams();
    const [flashcards, setCards] = useState([]);
    const [flashcard, setCard] = useState({studyset_id: studyset_id, question: '', answer: ''});
    const [questionCount, setQuestionCount] = useState(0);
    const [answerCount, setAnswerCount] = useState(0);
    const [isUpdating, setUpdate] = useState(false);
    const [currentKey, setKey] = useState({id: ''});
    const [title, setTitle] = useState('');
    const [errors, setErrors] = useState({ question: '', answer: '' });
    const [messageType, setMessageType] = useState(''); 
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // GET all cards
    const fetchCards = async () => {
        try {
            const response = await api.get(`/flashcards/${studyset_id}`);
            console.log('Fetched cards:', response.data);
            setCards(response.data);
        } catch(error) {
            console.error('Error fetching cards:', error);
        }
    };

    // GET title
    const fetchTitle = async () => {
        try { 
            const response = await api.get(`/studysets/${studyset_id}`);
            setTitle(response.data.title);
            console.log(response.data);
        } catch (error){
            console.error('Error title studyset:', error);            
        }
    };

    // SET after rendering
    useEffect(() => {
        fetchCards();
        fetchTitle();
    }, []);

    // SET single card
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCard({ ...flashcard, [name]: value});

        if (name === 'question') {
            setQuestionCount(value.length);
        } else if (name === 'answer') {
            setAnswerCount(value.length);
        }
    }

    // Handle Clear action
    const handleClear = () => {
        setCard({ studyset_id: studyset_id, question: '', answer: '' }); 
        setKey({ id: '' });  
        setUpdate(false);  
        setQuestionCount(0);
        setAnswerCount(0);
        setErrors({ question: '', answer: '' });
    };


    //input validation
    const validate = () => {
        const newErrors = {};
        if (!flashcard.question.trim()) newErrors.question = 'Question is required.';
        if (!flashcard.answer.trim()) newErrors.answer = 'Answer is required.';
        if (flashcard.question.length > 500) newErrors.question = 'Question cannot be longer than 500 characters.';
        if (flashcard.answer.length > 500) newErrors.answer = 'Answer cannot be longer than 500 characters.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // ADD cards to db
    const handleAddCard = async () => {
        if (!validate()) return; 

        const trimmedQuestion = flashcard.question.trim();
        const trimmedAnswer = flashcard.answer.trim();

        if (!trimmedQuestion || !trimmedAnswer) {
            alert("Both question and answer fields are required.");
            return;
        }

        try {
            await api.post('/flashcards/', flashcard);
            setCards([...flashcards, flashcard]);
            setCard({studyset_id: studyset_id, question: '', answer: ''});
            setQuestionCount(0);
            setAnswerCount(0);
            setMessage('Flashcard added successfully!');
            setMessageType('success');
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
        } catch (error) {
            setMessage('Error adding flashcard. Please try again.'); 
            setMessageType('error');
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
            console.error('Error adding cards:', error);
        }
    };

    // UPDATE cards in db
    const updateCard = async (id, updatedData) => {
        if (!validate()) return;

        try {
            await api.put(`/flashcards/${id}/`, updatedData);
            
            console.log("Flashcard updated");
            fetchCards();
            setCard({ studyset_id: studyset_id, question: '', answer: '' }); 
            setQuestionCount(0);
            setAnswerCount(0);
            setUpdate(false);
            setMessage('Flashcard updated successfully!');
            setMessageType('success');
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
        } catch (error) {
            setMessage('Error updating flashcard. Please try again.');
            setMessageType('error');

            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
            console.error('Error adding cards:', error);
        }
    };

    // GET clicked created card
    const createdCLicked = (cardData) => {
        console.log("Received from child:", cardData);
        setCard({studyset_id: studyset_id, question: cardData.question, answer: cardData.answer});
        setKey({id: cardData.id});
        setUpdate(true);
        setQuestionCount(cardData.question.length);
        setAnswerCount(cardData.answer.length);
      };

    // DELETE card
    const deleteCard = async (id) => {
        try {
            await api.delete(`/flashcards/${id}/`);
            console.log("Flashcard deleted");
            fetchCards();
            setKey({id: ''});
            setCard({studyset_id: studyset_id, question: '', answer: ''});
            setQuestionCount(0); 
            setAnswerCount(0);
            setMessage('Flashcard deleted successfully!'); 
            setMessageType('success');
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
        } catch (error) {
            setMessage('Error deleting flashcard. Please try again.'); 
            setMessageType('error');
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
            console.error('Error deleting cards:', error);
        }
    }

    // CREATE button caller
    const createCard = async () => {
        try {
            setKey({id: ''});
            setCard({studyset_id: studyset_id, question: '', answer: ''});
            setUpdate(false);
            setQuestionCount(0);
            setAnswerCount(0);
            setErrors({ question: '', answer: '' });
        } catch (error) {
            console.error('Error create button:', error);
        }
    }


    const goBackToStudyset = () => {
        navigate(`/studyset/${userID}/${studyset_id}`);
    };

    return (
        <div className="create-page">
            <div className='create-page-container'>
                <div className="create-nav-bar">
                    <button className="btn-back" onClick={goBackToStudyset}>
                        <i className="fa fa-arrow-left"></i>
                    </button>
                    <div className="create-title">
                        {title}
                    </div>
                </div>
                <div className="create-content">
                    <div className="create-flashcard-content">
                        <form className='create-qa-container' >
                            <div className='create-question'>
                                <label htmlFor='question' className='question-title'>
                                    Question
                                </label>
                                <input 
                                     className={`question ${errors.question || questionCount > 500 ? 'input-error' : ''}`}  
                                    type='text' 
                                    id='question'
                                    name='question'
                                    placeholder='Type question here'
                                    value={flashcard.question}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className='error-container'>
                                    <div className={`char-counter ${questionCount > 500 ? 'error-counter' : ''}`}>
                                        {questionCount}/500
                                    </div>
                                    {errors.question && 
                                        <div className="error-text">
                                            {errors.question}
                                        </div>}
                                </div>
                                
                            </div>
                            <hr className='horizontal-line'/>
                            <div className='create-answer'>
                                <label htmlFor='answer' className='answer-title'>
                                    Answer
                                </label>
                                <input 
                                     className={`answer ${errors.answer || answerCount > 500 ? 'input-error' : ''}`} 
                                    type='text' 
                                    id='answer'
                                    name='answer'
                                    placeholder='Type answer here'
                                    value={flashcard.answer}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className='error-container'>
                                    <div className={`char-counter ${answerCount > 500 ? 'error-counter' : ''}`}>
                                        {answerCount}/500
                                    </div>
                                    {errors.answer && 
                                        <div className="error-text">
                                            {errors.answer}
                                        </div>}
                                </div>
                                 
                            </div>
                            <div className='sd-flashcard-btn'>
                                <button type='button' className='btn-sd' onClick={() => isUpdating ? updateCard(currentKey.id, flashcard): handleAddCard()}>Save</button>
                                {isUpdating && currentKey.id && (
                                    <button type='button' className='btn-sd' onClick={() => deleteCard(currentKey.id)}>
                                        Delete
                                    </button>
                                )}
                                <button type='button' className='btn-sd' onClick={handleClear}>Clear</button>
                            </div>
                        </form>                

                    </div>
                    <div className="created-flashcards">
                        <button className="btn-create" onClick={createCard}>
                            + Create Flashcard
                        </button>
                        
                        {flashcards.map(card => (
                            // LOOP through all flashcards and display it
                            <CreatedFlashcard card={card} key={card.id} sendDataToParent={createdCLicked}/>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`message-container ${message ? 'message-show' : ''}`}>
                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateFlashcard;