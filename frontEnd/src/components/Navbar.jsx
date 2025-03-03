import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Button from '../UI/Button';
import { useState } from 'react';
import { UseApp } from '../context/AppContext';
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
 const{userToken,userDetails,logout} =UseApp()
  const handleLogout = () => {
    logout()
    navigate('/');
  };
  return (
    <div className='flex items-center justify-between border-b border-gray-500 py-4 text-sm mb-5 px-2'>
      <div className='w-32 sm:w-44'>
        <img
          src={assets.logo}
          className='w-full  cursor-pointer'
          alt='logo_img'
          onClick={() => navigate('/')}
        />
      </div>
      <ul className='hidden md:flex items-center gap-4 font-medium '>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary m-auto w-3/5 hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary m-auto w-3/5 hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary m-auto w-3/5 hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary m-auto w-3/5 hidden' />
        </NavLink>
      </ul>
      <div>
        {userToken && userDetails ? (
          <div className='flex items-center gap-2.5 group relative'>
            <img
              src={userDetails?.image||assets.profile_pic}
              alt='user_profile'
              className='w-8 rounded-full '
            />
            <img
              src={assets.dropdown_icon}
              alt='gropdown_icon'
              className='w-2.5 cursor-pointer'
            />
            <div className='absolute top-0 right-0 pt-14 text-gray-600 text-base font-medium z-20 hidden group-hover:block'>
              <div className='min-w-48 flex flex-col p-4 gap-4 bg-stone-200'>
                <p
                  onClick={() => navigate('my-profile')}
                  className='hover:text-gray-700 capitalize cursor-pointer'
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate('my-appointments')}
                  className='hover:text-gray-700 capitalize cursor-pointer'
                >
                  My Appointments
                </p>
                <p
                  onClick={handleLogout}
                  className='hover:text-gray-700 capitalize cursor-pointer'
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Button
            label='CREATE ACCOUNT'
            onClick={() => navigate('/login')}
            className='bg-primary'
          />
        )}
      </div>
      <img
        onClick={() => setShowMenu(true)}
        src={assets.menu_icon}
        className='w-6 cursor-pointer  md:hidden'
        alt='menu_img'
      />
      <div
        className={`${
          showMenu ? 'w-full fixed' : 'w-0 h-0'
        } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}
      >
        <div className='flex justify-between items-center py-4 px-4'>
          <img src={assets.logo} alt='logo_img' className='w-24' />
          <img
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt=''
            className='w-8 h-8 rounded-full bg-primary hover:bg-red-600 transition-all duration-300 p-2 '
          />
        </div>
        <ul className='flex flex-col gap-3 px-6 py-2 mt-4 text-sm font-medium'>
          <NavLink to='/' onClick={() => setShowMenu(false)}>
            Home
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about'>
            About
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/doctors'>
            All Doctors
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'>
            Contact Us
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
