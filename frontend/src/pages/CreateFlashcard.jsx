import { useEffect, useState } from 'react';
import '../css/CreateFlashcard.css'
import api from '../api'
import CreatedFlashcard from '../components/CreatedFlashcard';
import { useParams } from 'react-router-dom';


function CreateFlashcard () {
    const { studyset_id } = useParams();
    const [flashcards, setCards] = useState([]);
    const [flashcard, setCard] = useState({studyset_id: studyset_id, question: '', answer: ''});
    const [isUpdating, setUpdate] = useState(false);
    const [currentKey, setKey] = useState({id: ''});
    const [title, setTitle] = useState('');

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
    }

    
    // ADD cards to db
    const handleAddCard = async () => {
        try {
            await api.post('/flashcards/', flashcard);
            setCards([...flashcards, flashcard]);
            setCard({studyset_id: studyset_id, question: '', answer: ''});
        } catch (error) {
            console.error('Error adding cards:', error);
        }
    };

    // UPDATE cards in db
    const updateCard = async (id, updatedData) => {
        try {
            await api.put(`/flashcards/${id}/`, updatedData);
            
            console.log("Flashcard updated");
            fetchCards();

        } catch (error) {
            console.error('Error adding cards:', error);
        }
    };

    // GET clicked created card
    const createdCLicked = (cardData) => {
        console.log("Received from child:", cardData);
        setCard({studyset_id: studyset_id, question: cardData.question, answer: cardData.answer});
        setKey({id: cardData.id});
        setUpdate(true);
      };

    // DELETE card
    const deleteCard = async (id) => {
        try {
            await api.delete(`/flashcards/${id}/`);
            console.log("Flashcard deleted");
            fetchCards();
            setKey({id: ''});
            setCard({ question: '', answer: ''});

        } catch (error) {
            console.error('Error deleting cards:', error);
        }
    }

    // CREATE button caller
    const createCard = async () => {
        try {
            setKey({id: ''});
            setCard({studyset_id: studyset_id, question: '', answer: ''});
            setUpdate(false);
        } catch (error) {
            console.error('Error create button:', error);
        }
    }

    return (
        <div className="create-page">
            <div className='create-page-container'>
                <div className="create-nav-bar">
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
                                    className='question' 
                                    type='text' 
                                    id='question'
                                    name='question'
                                    placeholder='Type question here'
                                    value={flashcard.question}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <hr className='horizontal-line'/>
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
                            <div className='sd-flashcard-btn'>
                                <button type='button' className='btn-sd' onClick={() => isUpdating ? updateCard(currentKey.id, flashcard): handleAddCard()}>Save</button>
                                <button type='button' className='btn-sd' onClick={() => deleteCard(currentKey.id)}>Delete</button>
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
        </div>
    )
}

export default CreateFlashcard;