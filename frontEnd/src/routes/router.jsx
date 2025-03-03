import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AboutUs from '../pages/AboutUs';
import ContactUs from '../pages/ContactUs';
import Home from '../pages/Home';
import Doctors from '../pages/Doctors';
import MyProfile from '../pages/MyProfile';
import MyAppointments from '../pages/MyAppointments';
import Login from '../pages/Login';
import Appointments from '../pages/Appointments';
import ProtectedRoutes from '../components/ProtectedRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
     
      {
        path: 'about',
        element: <AboutUs />,
      },
      {
        path: 'contact',
        element: <ContactUs />,
      },
      {
        path: 'doctors',
        element: <Doctors />,
      },
      {
        path: 'doctors/:speciality',
        element: <Doctors />,
      },
     
      {
        path: 'appointments',
        element: <Appointments />,
      },
        {
        path: 'login',
        element: <Login />,
      },
     {
      element:<ProtectedRoutes/>,
      children:[
         {
        path: 'appointments/:docId',
        element: <Appointments />,
      },
      {
        path: 'my-appointments',
        element: <MyAppointments />,
      },
       {
        path: 'my-profile',
        element: <MyProfile />,
      },
    
      ]
     }
    ],
  },
]);

export default router;
