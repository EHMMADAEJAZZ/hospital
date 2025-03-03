import { useNavigate, useParams } from 'react-router-dom';
// import { doctors } from '../assets/assets';
import { useEffect, useState } from 'react';
import { currencyFormater } from '../utils/helper';
import { MdVerified } from 'react-icons/md';
import { CiCircleInfo } from 'react-icons/ci';
import Button from '../UI/Button';
import Relateddoctors from '../components/Relateddoctors';
import { UseApp } from '../context/AppContext';
import { toast } from 'react-toastify';
import { appointmentEndPoints } from '../common/api';
import Spinner from '../components/Spinner';

const Appointments = () => {
  const { docId } = useParams();
  const [docInfo, setDocInfo] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setloading] = useState(false);
  const [slotIndex, setSlotIndex] = useState(0);
  const [timeSlots, settimeSlots] = useState('');
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const { doctors, userToken, getAllDoctors,isLoading } = UseApp();
  // console.log(docId);
  const fetchDoctor = () => {
    // fetch doctor data by docId
    const docInfo = doctors.find((doctor) => doctor._id === docId);
    setDocInfo(docInfo);
  };

  const getAvilableSlots = async () => {
    setSlots([]);
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currdate = new Date(today);
      currdate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      if (today.getDate() === currdate.getDate()) {
        currdate.setHours(
          currdate.getHours() > 10 ? currdate.getHours() + 1 : 10
        );
        currdate.setMinutes(currdate.getMinutes() > 30 ? 30 : 0);
      } else {
        currdate.setHours(10);
        currdate.setMinutes(0);
      }
      let timeSlot = [];
      while (currdate < endTime) {
        let formatedTime = currdate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        let day = currdate.getDate();
        let month = currdate.getMonth() + 1;
        let year = currdate.getFullYear();
        const slotbooked = day + '_' + month + '_' + year;
        const slotTime = formatedTime;
        const isSlotAvailable =
          docInfo?.slot_booked[slotbooked] &&
          docInfo?.slot_booked[slotbooked].includes(slotTime)
            ? false
            : true;
        // console.log(formatedTime);
        if (isSlotAvailable) {
          timeSlot.push({
            dateTime: new Date(currdate),
            time: formatedTime,
          });
        }

        currdate.setMinutes(currdate.getMinutes() + 30);
      }
      setSlots((prev) => [...prev, timeSlot]);
    }
  };
  const navigate = useNavigate();
  const bookAppointment = async () => {
    if (!userToken) {
      toast.warning('Please Login to Book Appointment');
      scrollTo(0, 0);
      navigate('/login');
    }
    try {
      const date = slots[slotIndex][0].dateTime;
      const day = date.getDate();
      console.log(date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotbooked = day + '_' + month + '_' + year;
      // console.log(slotbooked,timeSlots)
      const appointmentData = {
        appointmentDate: slotbooked,
        appointmentTime: timeSlots,
      };
      setloading(true);
      const res = await appointmentEndPoints.createAppointment(
        appointmentData,
        docId
      );
      if (res.success) {
        toast.success(res?.message);
        getAllDoctors();
        navigate(`/my-appointments`);
      } else {
        toast.error('Failed to Book Appointment');
      }
    } catch (error) {
      toast.error(error?.message);
    }finally{
      setloading(false);
    }
  };
  useEffect(() => {
    fetchDoctor();
  }, [docId, doctors]);
  // console.log(docInfo);
  useEffect(() => {
    getAvilableSlots();
  }, [docInfo]);
  // useEffect(() => {
  //   console.log(slots);
  // }, [slots]);
  // console.log(relateDoc);
if(isLoading) return <Spinner/>
  return (
    docInfo && (
      <div className=''>
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-start sm:items-start'>
          <div className='w-full sm:max-w-[250px] md:min-h-[250px] md:max-h-[250px]  bg-primary rounded-md '>
            <img src={docInfo.image} className='' alt={docInfo.name} />
          </div>
          <div>
            <div className='border md:min-h-[250px] border-gray-500 rounded-md px-6 py-2'>
              <div className='flex gap-1 items-center'>
                <h1 className='text-xl'>{docInfo.name} </h1>
                <MdVerified className='text-blue-600 text-sm' />
              </div>

              <div className='flex gap-1 text-xs py-2'>
                <p>{docInfo.degree}</p>
                <p>{docInfo.speciality}</p>
                <p className='rounded-full border border-gray-400 px-2 text-gray-600 '>
                  {docInfo.experience}
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='text-sm flex gap-1 items-center'>
                  <p>About</p>
                  <CiCircleInfo color='black' className='bg-white' />
                </div>
                <p className='text-xs text-gray-600 leading-5'>
                  {docInfo.about}
                </p>
              </div>
              <p className='mt-2 text-sm text-gray-900'>
                Appointment fee{' '}
                <span className='font-medium'>
                  {currencyFormater(docInfo.fees, 'USD')}
                </span>
              </p>
            </div>
            {/* -------Booking Slots------------ */}
            <div className='mt-6'>
              <h1 className='text-lg text-gray-600 font-medium capitalize'>
                Booking slots
              </h1>
              <div className='my-6 flex gap-3 flex-wrap'>
                {slots.length &&
                  slots.map((slot, index) => (
                    <div
                      key={index}
                      onClick={() => setSlotIndex(index)}
                      className={`flex flex-col gap-2 items-center border border-gray-400 px-1 py-4 rounded-full w-14 text-xs text-gray-600 cursor-pointer ${
                        slotIndex === index ? 'bg-primary text-white' : ''
                      }`}
                    >
                      <p className=''>
                        {slot[0] && weekDays[slot[0].dateTime.getDay()]}
                      </p>
                      <p>{slot[0] && slot[0].dateTime.getDate()}</p>
                    </div>
                  ))}
              </div>
              {/* ----Timing-------- */}
              <div className='flex gap-3 flex-wrap'>
                {slots.length &&
                  slots[slotIndex].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => settimeSlots(item.time)}
                      className={`flex gap-x-4 items-center text-xs text-gray-600 border border-gray-400 rounded-full px-4 py-2 hover:text-white hover:bg-primary transition-all duration-300 font-light cursor-pointer ${
                        item.time === timeSlots ? 'bg-primary text-white' : ''
                      }`}>
                      
                      <p>
                        {item.time.toLowerCase()}{' '}
                        {item.time.split(':')[0] < 12 ? 'AM' : 'PM'}
                      </p>
                    </div>
                  ))}
              </div>

              <div className='w-44 mt-6 text-sm'>
                <Button
                  label={`${loading?"booking...":"book an appointment"}`}
                  onClick={bookAppointment}
                  className={`text-sm font-light text-white hover:bg-yellow-500 ${loading?"cursor-wait":"cursor-pointer"}`}
                />
              </div>
            </div>
          </div>
        </div>
        {/* ----------RELATED DOCTORS----------- */}
        <Relateddoctors speciality={docInfo.speciality} docId={docId} />
      </div>
    )
  );
};

export default Appointments;
