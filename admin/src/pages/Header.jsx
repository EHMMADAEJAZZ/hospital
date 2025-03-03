import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAdmin } from '../context/AdminContext';
import { useDoctor } from '../context/DoctorContext';
import { useApp } from '../context/AppContext';

const Header = () => {
  const navigate = useNavigate();
  const {aToken,setaToken,logoutAdmin }=useAdmin();
 const {dToken,setdToken,logoutDoctor}= useDoctor();
 const {isAuthenticated,setIsAuthenticated}= useApp();
 const handleLogout=()=>{
   if(aToken){
     setaToken('');
      logoutAdmin();
      setIsAuthenticated(false)
      navigate('/login');
   }else if(dToken){
     setdToken('');
      logoutDoctor()
      setIsAuthenticated(false)
      navigate('/login');
   }
 }
  return  (
    <div className='py-6 px-5 bg-gray-100 col-span-full border-b border-gray-400 flex justify-between items-center max-h-[10vh]'>
      <div className='flex items-center gap-1'>
        <img  onClick={()=>navigate('/')}  src={assets.admin_logo} alt='admin_logo' className='w-28 sm:w-32 cursor-pointer' />
        <p className='border border-gray-400 px-2 rounded-full text-gray-600 text-xs sm:text-sm'>
          {
            aToken ? 'Admin': 'Doctor'
          }
        </p>
      </div>
      {!aToken && !dToken ? (
        <button onClick={() => {
            navigate('/login');
          }} className='bg-primary px-3 py-1 w-fit text-white text-sm font-medium capitalize rounded-lg'>
          login
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className='bg-primary px-3 py-1 w-fit text-white text-sm font-medium capitalize rounded-lg'
        >
          logout
        </button>
      )}
    </div>
  );
};

export default Header;
