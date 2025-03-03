import { useEffect } from "react";
import { useDoctor } from "../../context/DoctorContext"
import { currencyFormater, dateFormat, dateTimeFormat } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

const DoctorProfile = () => {
 const {dToken,getDoctorProfile,
    doctorProfile,isLoading}= useDoctor();
    const navigate = useNavigate()
    useEffect(() => {
      if(dToken){
        getDoctorProfile();
      }
    }, [dToken]);
    if(isLoading) return <Spinner/>;
  return doctorProfile && (
    <div className="py-3 w-full min-h-[85vh] max-h-[85vh] overflow-hidden overflow-y-auto">
      <div className="flex flex-col gap-4 mb-3">
        <div>
          <img className="bg-blue-500/80 w-full sm:max-w-64 rounded-lg" src={doctorProfile?.image} alt="" />
        </div>
      </div>
      <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">

      {/* Doctor info --name,degree,speciality---- */}
      <p className="flex items-center  gap-2 text-lg font-medium text-gray-700">{doctorProfile?.name}</p>
       <div className="flex max-[400px]:flex-col max-[400px]:items-start flex-row max-[400px]:gap-0 gap-2 py-2 items-center">
        <p className="text-neutral-700">Email:</p>
        <p className="text-gray-500 text-sm">{doctorProfile?.email}</p>
      </div>
      <div className="flex  gap-2 py-2  items-center">
        <p className="text-neutral-700">Mobile:</p>
        <p className="text-sm text-gray-500 capitalize">{doctorProfile?.phone}</p>
      </div>
      <div className="flex items-center gap-2 mt-1 text-gray-600">
        <p ><span className="uppercase">{doctorProfile?.degree}</span> - {doctorProfile?.speciality}</p>
        <button className="py-0.5 px-2  border border-blue-500 text-xs rounded-full">{doctorProfile?.experience}</button>
      </div>
     
      {/* About */}
      <div>
        <p className="flex items-center gap-1 text-sm font-medium text-neutral-700 mt-3">About:</p>
        <p className="text-sm text-gray-600 max-w-[700px] mt-1">
          {doctorProfile?.about}
        </p>
      </div>
      <p className="text-gray-600 font-medium mt-4">Appointment fee: <span className="text-gray-800">{currencyFormater(doctorProfile?.fees,"INR")}</span></p>
      <div className="flex gap-2 py-2 items-start">
        <p className="text-neutral-700">Address:</p>
        <div className="text-gray-500 capitalize">
              <p className='text-sm'>
                {doctorProfile?.address?.line1}, {doctorProfile?.address?.line2},
                {doctorProfile?.address?.city}, {doctorProfile?.address?.pinCode}
              </p>
              <p className='text-sm'>{doctorProfile?.address?.state}</p>
            </div>
      </div>
      <div className="flex  gap-2   items-center">
        <p className="text-neutral-700">Gender:</p>
        <p className="text-sm text-gray-500 capitalize">{doctorProfile?.gender}</p>
      </div>
      <div className="flex  gap-2   items-center">
        <p className="text-neutral-700">Blood group:</p>
        <p className="text-sm text-gray-500 capitalize">{doctorProfile?.bloodType}</p>
      </div>
      <div className="flex  gap-2   items-center">
        <p className="text-neutral-700">DOB:</p>
        <p className="text-sm text-gray-500 capitalize">{doctorProfile?.dob && dateFormat(doctorProfile?.dob)}</p>
      </div>
      <div className="flex  gap-2  items-center">
        <p className="text-neutral-700">Last-login:</p>
        <p className="text-sm text-gray-500 capitalize">{doctorProfile?.lastLogin && dateTimeFormat(doctorProfile?.lastLogin)}</p>
      </div>
      
      <div className="flex gap-1 pt-2">
        <input className="accent-pink-700" readOnly={true} type="checkbox" checked={doctorProfile?.available} />
        <label className="text-neutral-700" htmlFor="">Available</label>
      </div>
      <button onClick={()=>navigate("/doctor/edit-profile")} className="px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all">Edit</button>
      </div>
    </div>
  )
}

export default DoctorProfile