import StudySetCard from "../components/StudySetCard";
import { useState, useEffect, use } from "react";
import'../css/Home.css';
import api from '../api'
import Modal from '../components/Modal.jsx';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useParams } from "react-router-dom";

Chart.register(ArcElement, Tooltip, Legend);

function Home () {
  const { user_id } = useParams('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [studyset_to_add, setStudyset] = useState({owner_ids: [user_id], title: '', winners: []});
  const [chartWinrate, setChartData] = useState();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [userStats, setUserStats] = useState({
    wins: 0,
    lose: 0,
  });

  const [realStats, setRealStats] = useState({
    wins: 0,
    lose: 0,
  });

  const fetchWinrate = async () => {
    try {
      const response = await api.get(`/users/${user_id}`);
      setChartData({
        wins: response.data.wins,
        lose: response.data.lose
      });
      console.log('Fetched WINRATE: ', response.data);
    } catch (error) {
      console.error('Error fetching WINRATE: ', error);
    }
  };

    // SET cards
    useEffect(() => {
      fetchSets();
    }, []);

  //fetch data for doughnut chart
  useEffect(() => {
    fetchWinrate();

    if (!chartWinrate) return;
    
    //doughnut chart percentage
    const total = Object.values(chartWinrate).reduce((acc, value) => acc + value, 0);
  
    if (total > 0) {
      const normalizedStats = Object.fromEntries(
        Object.entries(chartWinrate).map(([key, value]) => [key, (value / total) * 100])
      );
      setRealStats(chartWinrate);
      setUserStats(normalizedStats);
    } else {
      setUserStats({wins:50, lose:50})
    }
  }, [chartWinrate]);
  
  // percentage validation
  useEffect(() => {
    if (userStats) {
      const total = Object.values(userStats).reduce((acc, value) => acc + value, 0);
      if (total !== 100) {
        console.warn('User stats do not add up to 100%. Current total:', total);
      }
    }
  }, [userStats]);  

  const [showModal, setShowModal] = useState(false);
  const [studysets, setSets] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [owner_add, setAddOwner] = useState('');

  // GET studysets
  const fetchSets = async () => {
    try {
      const response = await api.get(`/all_studysets/${user_id}`);
      console.log('Fetched sets:', response.data);

      // flashcardCount: ..... { id: 2, title: "Study Set 2", flashcardCount: 35 }

      setSets(response.data);
    } catch(error) {
      console.error('Error fetching cards:', error);
    }
  }

  // SET
  const handleInputChange = (value) => {
    setStudyset(prevState => ({
      ...prevState,
      title: value, // Update the title property of studyset_to_add
    }));
  }

  const handleInputChangeAdd = (value) => {
    setAddOwner(value);
  }

  // CREATE studysets
  const createStudySet = async () => {
    try {
        console.log('This the problem: ', studyset_to_add);
        await api.post('/studysets/', studyset_to_add);
        setStudyset({owner_ids: [user_id], title: '', winners: []});
    } catch (error) {
        console.error('Error adding studyset:', error);
    }
  };

  // CREATE studysets
  const addStudySet = async (id) => {
    try {
        await api.put(`/studysets/${owner_add}?user_id=${user_id}`);
        setStudyset({owner_ids: [user_id], title: '', winners: []});
        fetchSets();
    } catch (error) {
        console.error('Error adding studyset:', error);
    }
  };



  useEffect(() => {
    if (chartWinrate) {
      console.log('Fetched WINRATE in effect: ', chartWinrate);
    }
  }, [chartWinrate]);

  const handleAddStudySet = async () => {
    addStudySet();
    setShowModalAdd(false);
  }

  //api call for study set creation
  const handleCreateStudySet = async (name) => {
    createStudySet();
    fetchSets();
    setTimeout(() => {
      console.log("Study set created successfully: ", { name });
      console.log("Creating study set with name:", studyset_to_add.title); 
      setShowModal(false);
    }, 1000); 
  };

  //doughnut chart labels
  const chartData = {
    labels: ['Wins', 'Lose'],
    datasets: [
      {
        data: [
          userStats.wins,
          userStats.lose,
        ],
        // , '#41b8d5', '#6ce5e8'
        backgroundColor: ['#0077b6', '#0096c7'],
        borderWidth: 0, 
        borderRadius: 25,
        spacing: -50,
      }
    ]
  };

  const chartOptions = {
    cutout: '80%',  
    maintainAspectRatio: false, 
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
          backgroundColor: function(context) {
            return context.dataset.backgroundColor[context.dataIndex];
          }
        }
      }
    }
  };
  

  return (
    <div className = "home-page">
      <div className="nav-bar">
        <div className = "page-title">
          Library
        </div>
        <div className={`home-buttons ${isMenuOpen ? "show" : ""}`}>
          <button className="btn-home" onClick={() => setShowModalAdd(true)}>+ Add Existing</button>
          <button className="btn-home" onClick={() => setShowModal(true)}>
            + Flashcard Set
          </button>
        </div>

        <div className="hamburger-icon" onClick={toggleMenu}>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </div>
      </div>
      <div className="content-container">
        <div className="study-card-container">
          {studysets.map(studysets => (
            <StudySetCard key={studysets.id} userID={user_id} props={studysets}/>
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
                <div className="legend-label"> {stat.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                <div className="legend-percentage">{realStats[stat]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateStudySet}
          title="Create a New Study Set"
          bodyText="Please enter the name for your new study set."
          inputField={true}
          cancelText="Cancel"
          submitText="Create"
          placeholder="Enter Study Set Name"
          onChange={handleInputChange}
      />
      <Modal
          show={showModalAdd}
          onClose={() => setShowModalAdd(false)}
          onSubmit={handleAddStudySet}
          title="Create a New Study Set"
          bodyText="Please enter the name for your new study set."
          inputField={true}
          cancelText="Cancel"
          submitText="Add"
          placeholder="Enter Study Set Name"
          onChange={handleInputChangeAdd}
      />
    </div>
  );
}
export default Home;