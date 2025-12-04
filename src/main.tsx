import './index.css';
import App from './App.tsx';
import { StrictMode } from 'react';
import Provider from './Provider.tsx';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <App /> 
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);