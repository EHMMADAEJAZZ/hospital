import { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import pic  from "../assets/upload_area.svg";
import {assets } from "../assets/assets";
import { useApp } from '../context/AppContext';
import { currencyFormater } from '../utils/helper';
import { months } from '../utils/constanst';
const Appointment = () => {
const {appointments,allAppointments,aToken,handleCancelAppointment}=  useAdmin()
const {calculateAge}=useApp()
 
 
  
  const formatSlotDate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1] - 1)] + ' ' + dateArray[2]
    );
  };
  useEffect(()=>{
    if(aToken){
      allAppointments();
    }
  },[])
  return (
    <div className='w-full max-w-6xl text-xs'>
      <p className='py-3 sm:text-start text-center text-xl font-medium text-gray-700 tracking-[2px]'>
        Appointments
      </p>
      <div className='bg-white border min-h-[60vh] max-h-[80vh] overflow-hidden overflow-y-auto'>

      <div className='hidden sm:grid  grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-row py-3 px-6 border-b'>
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Actions</p>
      </div>
      {
        appointments?.map((appointment,index)=>(
          <div key={index} className='flex flex-wrap max-sm:gap-2 sm:grid  sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex gap-2 items-center '>
              <img className='w-8 rounded-full bg-gray-200' src={appointment?.patient?.image ||pic} alt="" />
              <p className='capitalize'>{appointment?.patient?.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(appointment?.patient?.dob)}</p>
            <p>{formatSlotDate(appointment?.appointmentDate)} | {appointment?.appointmentTime}</p>
            <div className='flex gap-2 items-center'>
            <img className='w-8 rounded-full bg-gray-200' src={appointment?.doctor?.image || pic} alt="" />
            <p className='capitalize'>{appointment?.doctor?.name}</p>
            </div>
            <p>{currencyFormater(appointment?.amount,"INR")}</p>
            {
              appointment?.status ==="Cancelled"? <p className='text-red-400 font-medium'>Cancelled</p>:appointment?.isCompleted?<p className='text-green-600 font-medium'>Completed</p>:
            <img onClick={()=>handleCancelAppointment(appointment?._id)} className='w-10 cursor-pointer' src={assets?.cancel_icon}/>
            }
          </div>
        ))
      }
      </div>

    </div>
     
      
  );
};

export default Appointment;
