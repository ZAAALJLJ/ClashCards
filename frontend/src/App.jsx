import { Route, Routes, useLocation } from 'react-router-dom'
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
  const hideSidebarRoutes = ['/login', '/signup', '/livebattle', '/battleresult', '/soloreview', '/test'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname.toLowerCase());
  return (
    <div>
      {!shouldHideSidebar && <Sidebar/>} 
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/studyset/:id' element={<StudySet/>}/>
          <Route path='/soloreview/:studyset_id' element={<SoloReview/>}/>
          <Route path='/livebattle/:battle_id/:livebattle_id' element={<LiveBattle/>}/>
          <Route path='/battleresult' element={<BattleResult/>}/>
          <Route path='/createflashcard/:studyset_id' element={<CreateFlashcard/>}/>
          <Route path='/test' element={<Test/>}/>
        </Routes>
      </main>
    </div>

  )
}

export default App
