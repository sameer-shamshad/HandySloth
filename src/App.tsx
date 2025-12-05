import { Routes, Route } from 'react-router-dom';
import { ModalContainer } from './components/ui';
import DashboardLayout from './layouts/DashboardLayout';
import { 
  HomePage, 
  ContactPage, 
  PopularPage, 
  TrendingPage, 
  SubmitToolPage, 
  NotFoundPage, 
  CategoriesPage, 
  DashboardPage, 
  ToolViewPage, 
  CreateToolPage, 
  MyToolsPage,
  MyBookmarksPage,
} from './pages';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/trending' element={<TrendingPage />} />
          <Route path='/popular' element={<PopularPage />} />
          <Route path='/category' element={<CategoriesPage />} />
          <Route path='/submit' element={<SubmitToolPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/tool/:id' element={<ToolViewPage />} />
          <Route path='/submit/create-tool' element={<CreateToolPage />} />
          <Route path='/my-tools' element={<MyToolsPage />} />
          <Route path='/my-bookmarks' element={<MyBookmarksPage />} />
        </Route>

        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
      <ModalContainer />
    </>
  );
};

export default App;