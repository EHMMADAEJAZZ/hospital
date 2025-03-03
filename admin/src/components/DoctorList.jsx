import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import Spinner from './Spinner';
// import { doctors } from '../assets/assets';
const DoctorList = () => {
  const {doctors,isLoading,changeDoctorAvailability,allDoctors,aToken}= useAdmin();
  useEffect(()=>{
    if(aToken){
      allDoctors();
    }
  },[])
  if(isLoading){
    return <Spinner/>
  }
  return (
    <div className=''>
      <p className='py-3 sm:text-start text-center text-xl font-medium text-gray-700 tracking-[2px]'>
        All Doctors
      </p>
      <div className='bg-white w-full min-h-[80vh] max-h-[80vh] gap-4 p-5 rounded-lg gap-y-6  cursor-pointer overflow-hidden overflow-y-auto grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] '>
        {doctors && doctors?.map((doctor, index) => (
          <div
            key={index}
            className='w-full sm:max-h-[340px]  rounded-xl border border-indigo-200 group '
          >
              <img
                src={doctor?.image}
                alt={doctor?.name}
                className='bg-indigo-50 w-full  group-hover:bg-blue-600 transition-all duration-500 rounded-lg rounded-b-none object-cover'
              />
            <div className='p-4'>
              <p className='text-sm font-medium text-neutral-600 capitalize'>{doctor?.name}</p>
              <p className='text-xs text-zinc-600'>{doctor?.speciality}</p>
            <div className='mt-2 flex items-center gap-1 text-xs cursor-pointer'>
              <input onChange={()=>changeDoctorAvailability(doctor?._id)} type="checkbox" className='accent-purple-700 ' checked={doctor?.available}/>
              <p>Available</p>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
