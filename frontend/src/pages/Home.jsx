import StudySetCard from "../components/StudySetCard";
import { useState, useEffect } from "react";
import'../css/Home.css';
import api from '../api'

function Home () {
  const cards = [
    { id: 1, title: 'Card 1', description: '99 flashcards' },
    { id: 2, title: 'Card 2', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
  ]

  const [studysets, setSets] = useState([]);

  // GET studysets
  const fetchSets = async () => {
    try {
      const response = await api.get('/studysets/');
      console.log('Fetched cards:', response.data);
      setSets(response.data);
    } catch(error) {
      console.error('Error fetching cards:', error);
    }
  }

  // SET cards
  useEffect(() => {
    fetchSets();
  }, []);

  return (
    <div className = "home-page">
      <div className="nav-bar">
        <div className = "page-title">
          Library
        </div>
        <div className="home-buttons">
          <button className="btn-home">Battle</button>
          <button className="btn-home">+ Flashcard Set</button>
        </div>
      </div>
      <div className="content-container">
        <div className="study-card-container">
          {studysets.map(studysets => (
            <StudySetCard props={studysets} key={studysets.id}/>
          ))}
        </div>
        <div className="stats-container">
          <div className="chart-container">
            chart
          </div>
          <div className="chart-legend-container">
            <div className="legend-details-container">
                <div className="legend-colour">-</div>
                <div className="legend-label">Good</div>
                <div className="legend-percentage">99%</div>
            </div>
            <div className="legend-details-container">
                <div className="legend-colour">-</div>
                <div className="legend-label">Neutral</div>
                <div className="legend-percentage">9%</div>
            </div>
            <div className="legend-details-container">
                <div className="legend-colour">-</div>
                <div className="legend-label">Bad</div>
                <div className="legend-percentage">99%</div>
            </div>
            <div className="legend-details-container">
                <div className="legend-colour">-</div>
                <div className="legend-label">Not Learned</div>
                <div className="legend-percentage">32%</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
export default Home;