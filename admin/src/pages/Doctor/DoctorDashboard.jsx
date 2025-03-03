import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useDoctor } from "../../context/DoctorContext"
import { months } from "../../utils/constanst";
import { currencyFormater } from "../../utils/helper";

const DoctorDashboard = () => {
 const { getDashboardData,
    dashboardData,cancelAppointment,completeAppointment,isLoading}= useDoctor();
    
      const formatSlotDate = (slotDate) => {
        const dateArray = slotDate.split('_');
        return (
          dateArray[0] + ' ' + months[Number(dateArray[1] - 1)] + ' ' + dateArray[2]
        );
      };
      useEffect(()=>{
        getDashboardData();
      },[])
      if(isLoading){
        return <p>Loading...</p>
      }
  return dashboardData && (
   <div className='py-3 w-full min-h-[85vh] max-h-[85vh] overflow-hidden overflow-y-auto'>
    <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.appointments_icon} alt="" />
            <div>
              <p className='sm:text-xl font-semibold text-gray-600'>
                {dashboardData?.totalAppointments}
              </p>
              <p className='text-gray-400'>Appointments</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.patients_icon} alt="" />
            <div>
              <p className='sm:text-xl font-semibold text-gray-600'>
                {dashboardData?.totalPatients}
              </p>
              <p className='text-gray-400'>Patients</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.earning_icon} alt="" />
            <div>
              <p className='sm:text-xl font-semibold text-gray-600'>
                {currencyFormater( dashboardData?.totalEarning,"INR")}
              </p>
              <p className='text-gray-400'>Earnings</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.appointments_icon} alt="" />
            <div>
              <p className='sm:text-xl font-semibold text-gray-600'>
                {dashboardData?.upcomingAppointments}
              </p>
              <p className='text-gray-400'>Pending</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white max-[400px]:min-w-full min-w-48 sm:min-w-52 border border-gray-100 p-4 rounded cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.tick_icon} alt="" />
            <div>
              <p className='sm:text-xl font-semibold text-gray-600'>
                {dashboardData?.completedAppointments}
              </p>
              <p className='text-gray-400'>Completed</p>
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
                   dashboardData && dashboardData?.latestAppointments?.map((appointment,index)=>(
                      <div key={index} className='flex items-center px-6 py-1 gap-3 hover:bg-gray-100 border-b'>
                        <img className='w-10 rounded-full' src={appointment?.patient?.image || assets.upload_area} alt="" />
                        <div className='flex-1 text-xs'>
                          <p className='text-gray-800 font-medium'>{appointment?.patient?.name}</p>
                          <p className='text-gray-600'>{formatSlotDate(appointment?.appointmentDate)} | {appointment?.appointmentTime}</p>
                        </div>
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
   </div>
  )
}

export default DoctorDashboard