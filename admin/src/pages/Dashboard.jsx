import React, { useEffect, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { FiUsers } from 'react-icons/fi';
import { TfiFiles } from 'react-icons/tfi';
import { assets } from '../assets/assets';
import { useAdmin } from '../context/AdminContext';
import { months } from '../utils/constanst';
import Spinner from '../components/Spinner';
const Dashboard = () => {
 const {dashboardData,
    getDashboardData,
    isLoading, aToken,handleCancelAppointment}= useAdmin();
    const formatSlotDate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1] - 1)] + ' ' + dateArray[2]
    );
  };
    useEffect(() => {
      if(aToken){
        getDashboardData();
      }
    },[])
    if(isLoading){
    return <Spinner/>
  }
  return dashboardData && (
   <div className='py-3 w-full min-h-[85vh] max-h-[85vh] overflow-hidden overflow-y-auto'>
    <div className='flex flex-wrap gap-3'>
      <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.doctor_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>
            {dashboardData?.doctorsCount}
          </p>
          <p className='text-gray-400'>Doctors</p>
        </div>
      </div>
      <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.appointments_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>
            {dashboardData?.appointmentsCount}
          </p>
          <p className='text-gray-400'>Appointments</p>
        </div>
      </div>
      <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.patients_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>
            {dashboardData?.patientsCount}
          </p>
          <p className='text-gray-400' >patients</p>
        </div>
      </div>
      <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.patients_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>
            {dashboardData?.adminsCount}
          </p>
          <p className='text-gray-400'>Admins</p>
        </div>
      </div>
    </div>
    {/* latest appointments */}
    <div className='bg-white'>
      <div className='flex items-center gap-2.5 border rounded-t p-4 mt-10'>
        <img src={assets.list_icon} alt="" />
        <p className='font-semibold'>Latest Bookings</p>
      </div>
      <div className='pt-4 border border-t-0'>
        {
         dashboardData && dashboardData?.upcomingAppointments?.map((appointment,index)=>(
            <div key={index} className='flex items-center px-6 py-1 gap-3 hover:bg-gray-100 border-b'>
              <img className='w-10 rounded-full' src={appointment?.doctor?.image} alt="" />
              <div className='flex-1 text-xs'>
                <p className='text-gray-800 font-medium'>{appointment?.doctor?.name}</p>
                <p className='text-gray-600'>{formatSlotDate(appointment?.appointmentDate)} | {appointment?.appointmentTime}</p>
              </div>
                {
              appointment?.status ==="Cancelled"? <p className='text-red-400 font-medium text-xs'>Cancelled</p>: appointment?.isCompleted?<p className='text-xs text-green-600 font-medium'>Completed</p>:
            <img onClick={()=>handleCancelAppointment(appointment?._id)} className='w-10 cursor-pointer' src={assets?.cancel_icon}/>
            }
            </div>
          ))
        }
      </div>
    </div>
   </div>
  );
};

export default Dashboard;
