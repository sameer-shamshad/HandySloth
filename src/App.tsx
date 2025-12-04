import { Routes, Route } from 'react-router-dom';
import { ModalContainer } from './components/ui';
import { AuthProvider } from './context/AuthProvider';
import DashboardLayout from './layouts/DashboardLayout';
import { ToolsProvider } from './context/ToolsProvider';
import { ModalProvider } from './context/ModalProvider';
import { MyToolsProvider } from './context/MyToolsProvider';
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
} from './pages';

const App = () => {
  return (
    <ToolsProvider>
      <AuthProvider>
        <MyToolsProvider>
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
                <Route path='/my-tools' element={<MyToolsPage />} />
              </Route>

              <Route path='/*' element={<NotFoundPage />} />
            </Routes>
            <ModalContainer />
          </ModalProvider>
        </MyToolsProvider>
      </AuthProvider>
    </ToolsProvider>
  );
};

export default App;