import { createContext, useContext, useEffect, useState } from 'react';
import {
  appointmentEndPoints,
  doctorEndPoints,
  userEndPoints,
} from '../common/api';
import { toast } from 'react-toastify';
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [doctors, setdoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(
    localStorage.getItem('user_access_token')
      ? localStorage.getItem('user_access_token')
      : ''
  );
  const getAllDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await doctorEndPoints.getAllDoctors();
      if (response.success) {
        setdoctors(response?.data);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  //getUser-profile
  const userProfile = async () => {
    setIsLoading(true);
    try {
      const response = await userEndPoints.getUserProfile(userToken);
      if (response.success) {
        // setUserProfile(response?.data);
        setUserDetails(response?.data);
        setIsAuthenticated(true);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  const patientAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await appointmentEndPoints.getPatientsAppointments(
        userToken
      );
      if (response.success) {
        // setUserProfile(response?.data);
        setAppointments(response?.data?.reverse());
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  //logout
  const logout = async () => {
    setIsLoading(true);
    try {
      const res = await userEndPoints.logoutUser(userToken);
      if (res.success) {
        localStorage.removeItem('user_access_token');
        setUserToken('');
        setIsAuthenticated(false);
        toast.success('Logged Out Successfully');
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //register
  const values = {
    doctors,
    isLoading,
    userToken,
    userDetails,
    setUserDetails,
    isAuthenticated,
    setIsAuthenticated,
    setUserToken,
    getAllDoctors,
    userProfile,
    patientAppointments,
    appointments,
    logout,
  };
  useEffect(() => {
     
      getAllDoctors();
    
  }, []);
  useEffect(() => {
     if(userToken){

       userProfile();
     }
    
  }, [userToken]);
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const UseApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
