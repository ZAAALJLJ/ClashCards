import StudySetCard from "../components/StudySetCard";
import { useState } from "react";
import'../css/Home.css';

function Home () {
const cards = [
  { id: 1, title: 'Card 1', description: '99 flashcards' },
  { id: 2, title: 'Card 2', description: '99 flashcards' },
  { id: 3, title: 'Card 3', description: '99 flashcards' },
  { id: 3, title: 'Card 3', description: '99 flashcards' },
  { id: 3, title: 'Card 3', description: '99 flashcards' },
  { id: 3, title: 'Card 3', description: '99 flashcards' },
]

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
          {cards.map(cards => (
            <StudySetCard props={cards} key={cards.id}/>
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