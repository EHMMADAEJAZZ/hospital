import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Dashboard from '../pages/Dashboard';
import Main from '../pages/Main';
import LoginPage from '../pages/LoginPage';
import AppLayout from '../pages/AppLayout';
import Doctors from '../pages/Doctors';
import Appointments from '../pages/Appointments';
import AddDoctorPage from '../pages/AddDoctorPage';
import AddAdminPage from '../pages/AddAdminPage';
import Home from '../pages/Home';
import PatientsPage from '../pages/PatientsPage';
import Patients from '../components/Doctor/Patients';
import DoctorDashboard from '../pages/Doctor/DoctorDashboard';
import DoctorAppointments from '../pages/Doctor/DoctorAppointments';
import DoctorProfile from '../pages/Doctor/DoctorProfile';
import EditDoctorProfile from '../pages/Doctor/EditDoctorProfile';
import ProtectedRoutes from '../components/ProtectedRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <AppLayout />,
        children: [
          {
            element: <Main />,
            children: [
              {
                path: '',
                element: <Home />,
              },
             {
              element:<ProtectedRoutes/>,
              children:[
                 {
                path: '/admin/dashboard',
                element: <Dashboard />,
              },
              {
                path: '/admin/doctors',
                element: <Doctors />,
              },
              {
                path: '/admin/appointments',
                element: <Appointments />,
              },
              {
                path: '/admin/add-doctor',
                element: <AddDoctorPage />,
              },
              {
                path: '/admin/add-admin',
                element: <AddAdminPage />,
              },
              {
                path: '/admin/patients',
                element: <PatientsPage />,
              },
              {
                path: '/doctor/dashboard',
                element: <DoctorDashboard />,
              },
              {
                path: '/doctor/patients',
                element: <Patients />,
              },
              {
                path: '/doctor/appointments',
                element: <DoctorAppointments />,
              },
              {
                path: '/doctor/profile',
                element: <DoctorProfile />,
              },
              {
                path: '/doctor/edit-profile',
                element: <EditDoctorProfile />,
              },
              ]
             }
            ],
          },
        ],
      },

      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;
