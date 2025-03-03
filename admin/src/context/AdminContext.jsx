import { createContext, useContext, useEffect, useState } from 'react';
import { adminApis } from '../common/api';
import { toast } from 'react-toastify';
const AdminContext = createContext();
export const AdminProvider = ({ children }) => {
  const [aToken, setaToken] = useState(
    localStorage.getItem('admin_access_token')
      ? localStorage.getItem('admin_access_token')
      : ''
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  //getAllDoctors
  const allDoctors = async () => {
    setisLoading(true);
    try {
      const response = await adminApis.getAllDoctors(aToken);
      if(response.success){
        // toast.success(response?.message)
        setDoctors(response.data);

      }else{
        toast.error(response?.message)
      }
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.message)
      throw new Error(error?.message);
    } finally {
      setisLoading(false);
    }
  };
  //change doctor Availability
  const changeDoctorAvailability = async (doctorId) => {
    setisLoading(true);
    try {
    const res= await adminApis.changeDoctorAvailability(doctorId,aToken);
    console.log(res.status)
    toast.success(res?.message)
      allDoctors();
    } catch (error) {
      toast.error(error?.message)
      throw new Error(error?.message);
    } finally {
      setisLoading(false);
    }
  };
  const allAppointments=async()=>{
    setisLoading(true);
    try {
      const response = await adminApis.getAllAppointments(aToken);
      if(response.success){
        // toast.success(response?.message)
        setAppointments(response.data);

      } else{
        toast.error(response?.message)
      }
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.message)
      throw new Error(error?.message);
    } finally {
      setisLoading(false);
    }
  }
   const handleCancelAppointment =async(appointmentId)=>{
    setisLoading(true);
    try {
      const response = await adminApis.cancelAppointment(appointmentId,aToken)
      if(response.success){
        toast.success(response?.message);
        allAppointments();
      }else{
        toast.error(response?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    }finally {
      setisLoading(false);
    }
  }
  //bashboard data
  const getDashboardData = async() => {
    setisLoading(true);
    try {
      const response = await adminApis.getAdminDashboardData(aToken);
      if(response.success){
        // toast.success(response?.message)
        setDashboardData(response.data);

      } else{
        toast.error(response?.message)
      }
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.message)
      throw new Error(error?.message);
    } finally {
      setisLoading(false);
    }

  }
  const logoutAdmin = async () => {
      setisLoading(true);
      try {
        const res = await adminApis.logoutAdmin(aToken)
        if (res?.success) {
          toast.success(res?.message);
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          
        } else {
          toast.error(res?.message);
        }
      } catch (error) {
        toast.error(error?.message);
      } finally {
        setisLoading(false);
      }
    };
  //useEffect hook to fetch all doctors on component mounting
  useEffect(() => {
    if(aToken){

      allDoctors();
      allAppointments();
      getDashboardData();
    }
  }, [aToken]);
  const value = {
    aToken,
    setaToken,
    allDoctors,
    doctors,
    isLoading,
    changeDoctorAvailability,
    appointments,
    allAppointments,
    handleCancelAppointment,
    dashboardData,
    getDashboardData,
    logoutAdmin

  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
 
 
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
