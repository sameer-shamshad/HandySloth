import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import { ToolsProvider } from './context/ToolsProvider';
import { ModalProvider } from './context/ModalProvider';
import { ModalContainer } from './components/ui';
import { HomePage, ContactPage, PopularPage, TrendingPage, SubmitToolPage, NotFoundPage, CategoriesPage, DashboardPage, ToolViewPage, CreateToolPage } from './pages';

const App = () => {
  return (
    <ToolsProvider>
      <ModalProvider>
        <Routes>
          <Route path='/' element={<DashboardLayout />}>
            <Route index path='/' element={<HomePage />} />
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/trending' element={<TrendingPage />} />
            <Route path='/popular' element={<PopularPage />} />
            <Route path='/category' element={<CategoriesPage />} />
            <Route path='/submit' element={<SubmitToolPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/tool/:id' element={<ToolViewPage />} />
            <Route path='/submit/create-tool' element={<CreateToolPage />} />
          </Route>

          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
        <ModalContainer />
      </ModalProvider>
    </ToolsProvider>
  )
}

export default App;