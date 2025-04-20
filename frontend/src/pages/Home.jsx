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
          stats
        </div>
      </div>
      
    </div>
  );
}
export default Home;