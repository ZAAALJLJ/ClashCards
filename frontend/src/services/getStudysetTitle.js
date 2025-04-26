import { useEffect, useState } from "react"
import api from "../api";

const getStudysetTitle = (studyset_id) => {
    const [title, setTitle] = useState('')

    useEffect(() => {
        const fetchTitle = async () => {
            try {
                const response = await api.get(`/studysets/${studyset_id}`);
                setTitle(response.data.title);
            } catch (error) {
                console.error('Error fetching studyset title:', error);
            }
        };
        
        if (studyset_id) fetchTitle();
    }, [studyset_id]);

    return title;
}

export default getStudysetTitle;