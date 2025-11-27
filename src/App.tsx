import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import { HomePage, ContactPage, PopularPage, TrendingPage, SubmitToolPage, NotFoundPage } from './pages';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<DashboardLayout />}>
        <Route index path='/' element={<HomePage />} />
        <Route path='/trending' element={<TrendingPage />} />
        <Route path='/popular' element={<PopularPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/submit' element={<SubmitToolPage />} />
      </Route>
      
      <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;