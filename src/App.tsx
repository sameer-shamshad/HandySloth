import HomePage from './pages/Home';
import Footer from './components/Footer/Footer';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import MobileSidebar from './components/Sidebar/MobileSidebar';

const App = () => {
  return (
    <div>
      <MobileSidebar />
      <Sidebar />

      <main className='w-full h-[calc(100vh-260px)] bg-group-bg 2xl:p-14 flex flex-col'>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App;