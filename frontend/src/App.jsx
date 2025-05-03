import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import StudySet from './pages/StudySet'
import Sidebar from './components/Sidebar'
import SoloReview from './pages/SoloReview'
import LiveBattle from './pages/LiveBattle'
import BattleResult from './pages/BattleResult'
import CreateFlashcard from './pages/CreateFlashcard'
import Test from './pages/Test'


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const hideSidebarRoutes = ['/login', '/signup', '/livebattle', '/battleresult', '/soloreview', '/test'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname.toLowerCase());
  const extractUserId = (pathname) => {
    const match = pathname.match(/\/(?:profile|studyset|createflashcard|livebattle)\/([^/]+)/) 
                || pathname.match(/^\/([^/]+)$/); // fallback for /:user_id route
  
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      navigate('/login', { replace: true });
    } else {
      setShowContent(true);
    }
  }, [location]);

  if (!showContent) return null; 

  {console.log("From APP:", location.pathname)}
  return (
    <div>
      {!shouldHideSidebar && <Sidebar user_id={extractUserId(location.pathname)}/>} 
      <main className='main-content'>
        <Routes>
          <Route path='/:user_id' element={<Home/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/profile/:user_id' element={<Profile/>}/>
          <Route path='/studyset/:user_id/:id' element={<StudySet/>}/>
          {/* <Route path='/soloreview/:studyset_id' element={<SoloReview/>}/> */}
          <Route path='/livebattle/:user_id/:battle_id/:livebattle_id' element={<LiveBattle/>}/>
          <Route path='/battleresult' element={<BattleResult/>}/>
          <Route path='/createflashcard/:user_id/:studyset_id' element={<CreateFlashcard/>}/>
        </Routes>
      </main>
    </div>

  )
}

export default App
