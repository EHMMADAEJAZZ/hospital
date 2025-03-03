import { useEffect } from "react";
import { useDoctor } from "../../context/DoctorContext"
import pic  from "../../assets/upload_area.svg";
import {assets } from "../../assets/assets";
import { useApp } from '../../context/AppContext';
import { currencyFormater } from '../../utils/helper';
import { months } from '../../utils/constanst';

const DoctorAppointments = () => {
   const {dToken,
     getAppointments,
     appointments,
     isLoading,  completeAppointment,
     cancelAppointment}= useDoctor();
     const {calculateAge}=useApp()
       const formatSlotDate = (slotDate) => {
         const dateArray = slotDate.split('_');
         return (
           dateArray[0] + ' ' + months[Number(dateArray[1] - 1)] + ' ' + dateArray[2]
         );
       };
     useEffect(() => {
      if (dToken) {
        getAppointments();
      }
     }, [dToken]);
     if(isLoading){
        return <p>Loading...</p>
     }
  return (
     <div className='w-full max-w-6xl text-xs'>
          <p className='py-3 sm:text-start text-center text-xl font-medium text-gray-700 tracking-[2px]'>
            Appointments
          </p>
          <div className='bg-white border min-h-[60vh] max-h-[80vh] overflow-hidden overflow-y-auto'>
    
          <div className='hidden sm:grid  grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-row py-3 px-6 border-b'>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Actions</p>
          </div>
          {
            appointments?.map((appointment,index)=>(
              <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid  sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
                <p className='max-sm:hidden'>{index+1}</p>
                <div className='flex gap-2 items-center '>
                  <img className='w-8 rounded-full bg-gray-200' src={appointment?.patient?.image ||pic} alt="" />
                  <p className='capitalize'>{appointment?.patient?.name}</p>
                </div>
                <div>
                   <p className="text-xs inline border border-blue-700 rounded-full px-2">
                    {appointment?.payment?"Online":"CASH"}
                    </p> 
                </div>
                <p className='max-sm:hidden'>{calculateAge(appointment?.patient?.dob)}</p>
                <p>{formatSlotDate(appointment?.appointmentDate)} | {appointment?.appointmentTime}</p>
                
                <p>{currencyFormater(appointment?.amount,"INR")}</p>
                {
                    appointment?.status==="Cancelled"? <p className="text-xs font-medium text-red-500">Cancelled</p>:appointment?.isCompleted? <p className="text-xs text-green-600 font-medium">Completed</p>:(
                         <div className="flex items-center">
                <img onClick={()=>cancelAppointment(appointment?._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="" />
                <img onClick={()=>completeAppointment(appointment._id)}  className="w-10 cursor-pointer" src={assets.tick_icon} alt="" /></div>
                    )
                }
            
              </div>
            ))
          }
          </div>
    
        </div>
  )
}

export default DoctorAppointments