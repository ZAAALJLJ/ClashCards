import { useEffect, useState } from "react";
import api from "../api";

const getCards = (studyset_id) => {
    const [flashcards, setFlashcards] = useState([])

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await api.get(`/flashcards/${studyset_id}`);
                console.log('Fetched cards from getCards:', response.data);
                setFlashcards(response.data);
                console.log("total question", flashcards.length);
            } catch(error) {
                console.error('Error fetching cards:', error);            
            }
        };

        if (studyset_id) fetchCards();
    }, [studyset_id]);

    return flashcards;

}


export default getCards;