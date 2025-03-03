import { useEffect, useState } from 'react';
import { UseApp } from '../context/AppContext';
import { appointmentEndPoints } from '../common/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { currencyFormater } from '../utils/helper';
import Spinner from '../components/Spinner';

const MyAppointments = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const { patientAppointments, appointments, userToken, getAllDoctors ,isLoading} =
    UseApp();
  const navigate = useNavigate();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const formatSlotDate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1] - 1)] + ' ' + dateArray[2]
    );
  };
  const handleCancelAppointment = async (appointmentId) => {
    // Cancel appointment here
    setIsDeleting(true);
    try {
      const res = await appointmentEndPoints.cancelAppointment(
        appointmentId,
        userToken
      );
      console.log(res);
      if (res.success) {
        toast.success(res?.message);
        patientAppointments();
        getAllDoctors();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    } finally {
      setIsDeleting(false);
    }
  };
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order?.amount,
      currency: order?.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order?.id,
      receipt: order?.receipt,
      handler: async (response) => {
        try {
          const res = await appointmentEndPoints.verifyRazorpayPayment(
            response,
            userToken
          );
          if (res.success) {
            patientAppointments();
            toast.success(res?.message);
            navigate('/my-appointments');
          }
        } catch (error) {
          toast.error(error?.message);
        }
      },
    };
    new window.Razorpay(options).open();
  };
  const handlePayment = async (appointmentId) => {
    // Pay for appointment here
    setIsPaying(true);
    try {
      const res = await appointmentEndPoints.createPayment(
        appointmentId,
        userToken
      );
      if (res.success) {
        initPay(res?.data);
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    } finally {
      setIsPaying(false);
    }
  };
  useEffect(() => {
    patientAppointments();
  }, []);
if(isLoading){
  return <Spinner/>
}
  return (
    <div className='w-full'>
      <div className='my-6 w-full'>
        <h1 className='text-start text-xl text-gray-600 font-medium'>
          My Appointments
        </h1>
      </div>
      <hr className=' bg-gray-400' />
      <div className='w-full grid grid-cols-1 max-md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mx-auto'>
        {appointments?.length > 0 ?
          appointments?.map((app, index) => (
            <div
              key={index}
              className='w-full flex flex-col md:flex-row gap-5 border-b border-gray-400 md:py-2 mx-auto max-md:border'
            >
              <div className=''>
                <img
                  className='w-full md:w-36 bg-indigo-50'
                  src={app?.doctor?.image}
                  alt={app?.doctor?.name}
                />
              </div>
              <div className='flex-1 px-3  '>
                <h2 className='text-lg font-medium leading-6 text-gray-700'>
                  {app?.doctor?.name}
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  {app?.doctor?.speciality}
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                 <span>Fees: </span> <span className='text-red-600 font-medium'>{currencyFormater( app?.amount,"INR")}</span>
                </p>
                <div className='flex flex-col mt-2 gap-1 text-sm text-gray-500'>
                  <p className='text-gray-700 font-medium'>Address:</p>
                  <p>{app?.doctor?.address?.line1}</p>
                  <p>{app?.doctor?.address?.line2}</p>
                  <div className=''>
                    <p className='text-gray-700 font-medium'>
                      Date & Time:
                      <span className='text-gray-500 ml-1'>
                        {formatSlotDate(app?.appointmentDate)} |{' '}
                        {app?.appointmentTime}
                      </span>{' '}
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-between'>
                {/* <div className='w-full px-3'>
                  <span
                    className={`text-sm ${
                      app?.status === 'Cancelled' && 'text-red-600'
                    } ${app?.status === 'Pending' && 'text-yellow-600'} ${
                      app?.status === 'Confirmed' && 'text-green-600'
                    }`}
                  >
                    {app?.status}
                  </span>
                </div> */}

                <div className='flex gap-4  flex-col px-3'>
                {!app?.payment && app?.status !=='Cancelled' && !app?.isCompleted &&  <button
                    onClick={() => handlePayment(app?._id)}
                    disabled={isDeleting}
                    className='w-44 md:w-48 border text-center border-gray-400 rounded-md md:px-3 md:py-3 md:text-sm capitalize text-xs py-2 px-2 hover:bg-primary hover:text-white transition-all duration-300'
                  >
                    {isPaying ? 'paying...' : 'Pay online'}
                  </button>}

                { app?.status!=='Cancelled' && !app?.payment && !app?.isCompleted &&  <button
                    onClick={() => handleCancelAppointment(app?._id)}
                    disabled={isDeleting}
                    className='w-44 md:w-48 border text-center border-gray-400 rounded-md md:px-3 md:py-3 md:text-sm capitalize text-xs py-2 px-2 hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    {isDeleting ? 'cancelling...' : 'cancel appointment'}
                  </button>}
                  {app?.status==='Cancelled' && <button
                    className='w-44 md:w-48 border text-center border-gray-400 rounded-md md:px-3 md:py-3 md:text-sm capitalize text-xs py-2 px-2 text-red-700'
                    disabled={true}
                  >
                    Appointment Cancelled 
                  </button>
                  }
                  {app?.payment && app?.status!=="Cancelled" && !app?.isCompleted && <button
                    className='w-44 md:w-48 border text-center border-gray-400 rounded-md md:px-3 md:py-3 md:text-sm capitalize text-xs py-2 px-2 text-red-700'
                    disabled={true}
                  >
                    Appointment Paid {app?.isCompleted}
                  </button>
                  }
                  {app?.payment && app?.status!=="Cancelled" && app?.isCompleted && <button
                    className='w-44 md:w-48 border text-center border-gray-400 rounded-md md:px-3 md:py-3 md:text-sm capitalize text-xs py-2 px-2 text-green-700'
                    disabled={true}
                  >
                     Completed 
                  </button>
                  }
                </div>
              </div>
              <hr />
            </div>
          )):<p className='flex items-center justify-center mt-5 text-white tracking-widest uppercase font-bold bg-black p-5 h-24'>No Appointment Found</p>}
      </div>
    </div>
  );
};

export default MyAppointments;
