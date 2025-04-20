
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Profile from './pages/Profile'
import StudySet from './pages/StudySet'
import Sidebar from './components/Sidebar'
import SoloReview from './pages/SoloReview'
import LiveBattle from './pages/LiveBattle'
import BattleResult from './pages/BattleResult'


function App() {
  const location = useLocation();
  const hideSidebarRoutes = ['/livebattle', '/battleresult', '/soloreview'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname.toLowerCase());
  return (
    <div>
      {!shouldHideSidebar && <Sidebar/>} 
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/studyset' element={<StudySet/>}/>
          <Route path='/soloreview' element={<SoloReview/>}/>
          <Route path='/livebattle' element={<LiveBattle/>}/>
          <Route path='/battleresult' element={<BattleResult/>}/>

        </Routes>
      </main>
    </div>

  )
}

export default App
