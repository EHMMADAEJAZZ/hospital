import { createContext, useContext, useEffect, useState } from 'react';
import { doctorApis } from '../common/api';
import { toast } from 'react-toastify';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [dToken, setdToken] = useState(
    localStorage.getItem('doctor_access_token')
      ? localStorage.getItem('doctor_access_token')
      : ''
  );
  // const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  //getAppointments
  const getAppointments = async () => {
    setisLoading(true);
    try {
      const response = await doctorApis.getDoctorAppointments(dToken);
      if (response?.success) {
        // toast.success(response?.message)
        setAppointments(response.data.reverse());
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setisLoading(false);
    }
  };
  //complete appointment
  const completeAppointment = async (appointmentId) => {
    setisLoading(true);
    try {
      const response = await doctorApis.completeAppointment(
        appointmentId,
        dToken
      );
      if (response?.success) {
        toast.success(response?.message);
        getAppointments();
        getDashboardData();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setisLoading(false);
    }
  };
  //cancel appointment
  const cancelAppointment = async (appointmentId) => {
    setisLoading(true);
    try {
      const response = await doctorApis.cancelAppointment(
        appointmentId,
        dToken
      );
      if (response?.success) {
        toast.success(response?.message);
        getAppointments();
        getDashboardData();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setisLoading(false);
    }
  };
  //logout
  const logoutDoctor = async () => {
    setisLoading(true);
    try {
      const res = await doctorApis.logoutDoctor(dToken);
      if (res?.success) {
        toast.success(res?.message);
        localStorage.removeItem('doctor_access_token');
        localStorage.removeItem('doctor_refresh_token');  
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setisLoading(false);
    }
  };

  const getDashboardData = async()=>{
      setisLoading(true);
      try {
          const response = await doctorApis.getDoctorDashboardData(dToken);
          if(response?.success){
              // toast.success(response?.message)
              setDashboardData(response.data);
          } else{
              toast.error(response?.message)
          }
      } catch (error) {
          toast.error(error?.message)

      }finally{
          setisLoading(false);
      }
  }
 //get doctor profile
  const getDoctorProfile = async()=>{
      setisLoading(true);
      try {
          const response = await doctorApis.getDoctorProfile(dToken);
          if(response?.success){
              // toast.success(response?.message)
              setDoctorProfile(response.data)
          } else{
              toast.error(response?.message)
          }
      } catch (error) {
          toast.error(error?.message)

      }finally{
          setisLoading(false);
      }
  }

  // update doctor profile

  useEffect(() => {
    if(dToken){
      getAppointments();
      getDashboardData();
      getDoctorProfile()
    }
  }, [dToken]);
  const value = {
    dToken,
    setdToken,
    getAppointments,
    appointments,
    isLoading,
    completeAppointment,
    cancelAppointment,
    logoutDoctor,
    getDashboardData,
    dashboardData,
    getDoctorProfile,
    doctorProfile,
    

  };
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
