import StudySetCard from "../components/StudySetCard";
import { useState, useEffect } from "react";
import'../css/Home.css';
import api from '../api'
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, plugins } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function Home () {
  const cards = [
    { id: 1, title: 'Card 1', description: '99 flashcards' },
    { id: 2, title: 'Card 2', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
    { id: 3, title: 'Card 3', description: '99 flashcards' },
  ]

  const [userStats, setUserStats] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
    notLearned: 0
  });

  useEffect(() => {
    const dummyStats = {
      good: 45,
      neutral: 25,
      bad: 15,
      notLearned: 15
    };
  
    const total = Object.values(dummyStats).reduce((acc, value) => acc + value, 0);
  
    if (total !== 100) {
      const difference = 100 - total;
      dummyStats.good += difference;
    }
  
    setUserStats(dummyStats);
  }, []);
  
  useEffect(() => {
    if (userStats) {
      const total = Object.values(userStats).reduce((acc, value) => acc + value, 0);
      if (total !== 100) {
        console.warn('User stats do not add up to 100%. Current total:', total);
      }
    }
  }, [userStats]);  

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


  const chartData = {
    labels: ['Good', 'Neutral', 'Bad', 'Not Learned'],
    datasets: [
      {
        data: [
          userStats.good,
          userStats.neutral,
          userStats.bad,
          userStats.notLearned
        ],
        backgroundColor: ['#0096c7', '#41b8d5', '#6ce5e8', '#b5f5f0'],
        borderWidth: 0, 
        borderRadius: 25,
        spacing: -50,
      }
    ]
  };

  const overlappingSegments = {
    id: 'overlappingSegments', 
    afterDatasetsDraw(chart, args, plugins){

    }
  }

  const chartOptions = {
    cutout: '80%',  
    maintainAspectRatio: false, 
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
      plugins: [overlappingSegments], 
      tooltip: {
        enabled: true,
      }
    }
  };
  

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
            <StudySetCard key={studysets.id} props={studysets}/>
          ))}
        </div>
        <div className="stats-container">
          <div className="chart-container">
          <Doughnut data={chartData} options={chartOptions} />
            <div className="chart-center">
              {Object.values(userStats).reduce((a, b) => a + b)}%
            </div>
          </div>
          <div className="chart-legend-container">
            {Object.keys(userStats).map((stat, index) => (
              <div className="legend-details-container" key={stat}>
                <div className="legend-colour" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></div>
                <div className="legend-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                <div className="legend-percentage">{userStats[stat]}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
export default Home;