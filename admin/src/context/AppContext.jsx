import { createContext, useContext, useEffect, useState } from 'react';
import { useDoctor } from './DoctorContext';
import { useAdmin } from './AdminContext';
import { adminApis, doctorApis } from '../common/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dToken } = useDoctor();
  const { aToken } = useAdmin();
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  //check-admin auth
  const checkDoctor = async () => {
    setLoading(true)
    try {
      const response = await doctorApis.checkAuth(dToken);
      if (response?.statusCode === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error?.message);
    }finally {
      setLoading(false)
    }
  };
  const checkAdmin = async () => {
    setLoading(true)
    try {
      const response = await adminApis.checkAuth(aToken);
      if (response?.statusCode === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error?.message);
      
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    if (dToken) {
      checkDoctor();
    }
  }, []);

  useEffect(() => {
    if (aToken) {
      checkAdmin();
    }
  }, []);

  const value = { calculateAge, isAuthenticated, setIsAuthenticated,loading };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
