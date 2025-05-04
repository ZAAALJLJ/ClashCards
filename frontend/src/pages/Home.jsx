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
    } catch (error) {
      console.error('Error fetching WINRATE: ', error);
    }
  };

  //ui demo dummy data delete
  // useEffect(() => {
  //   const dummyData = { wins: 8, lose: 4 };
  //   setUserStats(dummyData);
  //   setRealStats(dummyData);

  // }, []); 

  //fetch data for doughnut chart
  useEffect(() => {
    fetchWinrate();

    if (!chartWinrate) return;
    
    //doughnut chart percentage
    const total = chartWinrate.wins + chartWinrate.lose;

    if (total > 0) {
      const winsPercentage = (chartWinrate.wins / total) * 100;
      const losePercentage = (chartWinrate.lose / total) * 100;
      setUserStats({ wins: winsPercentage, lose: losePercentage });
      setRealStats(chartWinrate);
    } else {
      setUserStats({wins:50, lose:50})
    }
  }, [chartWinrate]);

    // SET cards
    useEffect(() => {
      fetchSets();
    }, []);

  const [showModal, setShowModal] = useState(false);
  const [studysets, setSets] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [owner_add, setAddOwner] = useState('');
  const [addStudySetError, setAddStudySetError] = useState('');
  const [errorText, setErrorText] = useState('');


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
        fetchSets();
    } catch (error) {
        console.error('Error adding studyset:', error);
    }
  };

  // CREATE studysets
  const addStudySet = async (id) => {
    try {
        console.log("MAY ID SA STUDSET:", id);
        const response = await api.get(`/studysets/${id}`);
        if (!response.data) {
          alert("Study set doesn't exist.");
          console.log("Studyset doesn't exist");
          return;
        }

        await api.put(`/studysets/${owner_add}?user_id=${user_id}`);
        setStudyset({owner_ids: [user_id], title: '', winners: []});
        fetchSets();
        setShowModalAdd(false);
    } catch (error) {
        console.error('Error adding studyset:', error);
        setAddStudySetError("This study set doesn't exist.");
    }
  };

  const handleAddStudySet = async () => {
    setAddStudySetError('');
    await addStudySet(owner_add);
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
  

  // doughnut chart labels
  const chartData = {
    labels: ['Wins', 'Lose'],
    datasets: [
      {
        data: [
          userStats.wins,
          userStats.lose,
        ],
        // , '#0096c7', '#41b8d5'
        backgroundColor: ['#6ce5e8', '#0077b6'],
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
  
  const winRate = (realStats.wins + realStats.lose > 0) 
  ? Math.round((realStats.wins / (realStats.wins + realStats.lose)) * 100)
  : 50; // Default to 50% if no data

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
            {realStats.wins === 0 && realStats.lose === 0 ? (
              <div className="no-data-message">
                <p>No data available.</p>
                <p>Complete a battle to view your stats!</p>
              </div>
            ) : (
              <>
                <Doughnut data={chartData} options={chartOptions} />
                <div className="chart-center">
                  {winRate}%
                </div>
              </>
            )}
        </div>
        {realStats.wins !== 0 || realStats.lose !== 0 ? (
          <div className="chart-legend-container">
            {Object.keys(userStats).map((stat, index) => (
              <div className="legend-details-container" key={stat}>
                <div className="legend-colour" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></div>
                <div className="legend-label"> {stat.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                <div className="legend-percentage">{realStats[stat]}</div>
              </div>
            ))}
          </div>
        ) : null}
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
          onClose={() => {
            setShowModalAdd(false);
            setAddStudySetError('');
          }}
          onSubmit={handleAddStudySet}
          title="Add Existing Study Set"
          bodyText="Please enter the study set ID."
          inputField={true}
          cancelText="Cancel"
          submitText="Add"
          placeholder="Enter Study Set ID"
          onChange={handleInputChangeAdd}
          errorText={addStudySetError}
      />
    </div>
  );
}
export default Home;