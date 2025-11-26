import HomePage from './pages/Home';
import Footer from './components/Footer/Footer';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import MobileSidebar from './components/Sidebar/MobileSidebar';

const App = () => {
  return (
    <div className='flex flex-col md:flex-row 2xl:flex-col h-screen'>
      <MobileSidebar />
      <Sidebar />

    <div className='flex flex-col h-full w-full bg-primary-bg'>
      <main className='w-full md:w-[calc(100%-30px)] lg:w-[calc(100%-60px)] 2xl:w-[calc(100%-90px)] h-full bg-group-bg 
        md:m-[15px] lg:m-[30px] 2xl:m-[45px] rounded-3xl flex flex-col'>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>

      </main>

      <Footer />
    </div>

    </div>
  )
}

export default App;