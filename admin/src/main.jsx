import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import { DoctorProvider } from './context/DoctorContext.jsx';
import { AppProvider } from './context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AdminProvider>
        <DoctorProvider>
          <AppProvider>
    <RouterProvider router={router}>
            <App />
    </RouterProvider>
          </AppProvider>
        </DoctorProvider>
      </AdminProvider>
  </StrictMode>
);
