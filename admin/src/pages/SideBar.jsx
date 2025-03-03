import { assets } from '../assets/assets';

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useDoctor } from '../context/DoctorContext';
const SideBar = () => {
  const [user, setuser] = useState(true);
  const { aToken, setaToken } = useAdmin();
  const { dToken, setdToken } = useDoctor();
  return (
    <div className='w-full min-h-[90vh] max-h-[90vh] overflow-hidden overflow-y-auto border-r border-white  '>
      {aToken && (
        <div className='w-full flex flex-col '>
          <NavLink
            to='/admin/dashboard'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 md:px-9 border-b  capitalize font-medium  text-gray-600 cursor-pointer ${
                isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
              }`
            }
          >
            <img
              src={assets.home_icon}
              alt='home_icon'
              className='w-4 h-4 sm:w-5 sm:h-5'
            />
            <p className=' text-xs sm:text-sm  text-nowrap max-sm:hidden'>dashboard</p>
          </NavLink>
          <NavLink
            to='/admin/appointments'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 md:px-9 border-b capitalize font-medium  text-gray-600 cursor-pointer ${
                isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
              }`
            }
          >
            <img
              src={assets.appointment_icon}
              alt='appointment_icon'
              className='w-4 h-4 sm:w-5 sm:h-5'
            />
            <p className='text-xs sm:text-sm  text-nowrap max-sm:hidden'>appointments</p>
          </NavLink>
          <NavLink
            to='/admin/add-doctor'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 md:px-9 border-b  capitalize font-medium  text-gray-600 cursor-pointer ${
                isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
              }`
            }
          >
            <img
              src={assets.add_icon}
              alt='add_icon'
              className='w-4 h-4 sm:w-5 sm:h-5'
            />
            <p className='text-xs sm:text-sm  text-nowrap max-sm:hidden'>add doctor</p>
          </NavLink>
          <NavLink
            to='/admin/add-admin'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3  md:px-9 border-b capitalize font-medium  text-gray-600 cursor-pointer ${
                isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
              }`
            }
          >
            <img
              src={assets.add_icon}
              alt=''
              className='w-4 h-4 sm:w-5 sm:h-5'
            />
            <p className=' text-xs sm:text-sm  text-nowrap max-sm:hidden'>add admin</p>
          </NavLink>
          <NavLink
            to='/admin/doctors'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3  md:px-9 border-b capitalize font-medium  text-gray-600 cursor-pointer ${
                isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
              }`
            }
          >
            <img
              src={assets?.people_icon}
              alt=''
              className='w-4 h-4 sm:w-5 sm:h-5'
            />
            <p className='text-xs sm:text-sm  text-nowrap max-sm:hidden'>doctor list</p>
          </NavLink>
          <NavLink
            to='/admin/patients'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 md:px-9 border-b  capitalize font-medium  text-gray-600 cursor-pointer ${
                isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
              }`
            }
          >
            <img
              src={assets?.list_icon}
              alt=''
              className='w-4 h-4 sm:w-5 sm:h-5'
            />
            <p className=' text-xs sm:text-sm  text-nowrap max-sm:hidden'>Patients</p>
          </NavLink>
        </div>
      )}

      <div className='w-full flex flex-col  '>
        {dToken && (
          <div className='w-full flex flex-col  mt-3 '>
            <NavLink
              to='/doctor/dashboard'
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 md:px-9 border-b  capitalize font-medium  text-gray-600 cursor-pointer ${
                  isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
                }`
              }
            >
              <img
                src={assets.home_icon}
                alt='home_icon'
                className='w-4 h-4 sm:w-5 sm:h-5'
              />
              <p className=' text-xs sm:text-sm max-sm:hidden text-nowrap'>
                dashboard
              </p>
            </NavLink>
            <NavLink
              to='/doctor/appointments'
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 md:px-9 border-b  capitalize font-medium  text-gray-600 cursor-pointer ${
                  isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
                }`
              }
            >
              <img
                src={assets.appointment_icon}
                alt='appointment_icon'
                className='w-4 h-4 sm:w-5 sm:h-5'
              />
              <p className='text-xs sm:text-sm  text-nowrap max-sm:hidden'>
                appointments
              </p>
            </NavLink>

            <NavLink
              to='/doctor/profile'
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 md:px-9 border-b  capitalize font-medium  text-gray-600 cursor-pointer ${
                  isActive ? 'bg-[#c8ccfb] border-r-4 border-blue-500' : ''
                }`
              }
            >
              <img
                src={assets?.list_icon}
                alt=''
                className='w-4 h-4 sm:w-5 sm:h-5'
              />
              <p className=' text-xs sm:text-sm  text-nowrap max-sm:hidden'>
                Profile
              </p>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
