import Footer from './components/Footer/Footer';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import MobileSidebar from './components/Sidebar/MobileSidebar';

import { HomePage, ContactPage, PopularPage, TrendingPage, SubmitToolPage, NotFoundPage } from './pages';

const App = () => {
  return (
    <div className='flex flex-col md:flex-row 2xl:flex-col h-screen'>
      <MobileSidebar />
      <Sidebar />

    <div className='flex flex-col h-full w-full bg-primary-bg overflow-auto'>
      <main className='w-full md:w-[calc(100%-30px)] lg:w-[calc(100%-60px)] 2xl:w-[calc(100%-90px)] h-ful bg-group-bg p-2 md:p-5 lg:p-7
        md:m-[15px] lg:m-[30px] 2xl:m-[45px] md:rounded-3xl flex flex-col py-8'
      >
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/trending' element={<TrendingPage />} />
          <Route path='/popular' element={<PopularPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/submit' element={<SubmitToolPage />} />
          
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
    </div>
  )
}

export default App;