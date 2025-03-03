import React, { useEffect, useState } from 'react';
import CenterElements from '../UI/CenterElements';
import Input from '../UI/Input';
import { adminApis, doctorApis } from '../common/api';
import { toast } from 'react-toastify';
import { useAdmin } from '../context/AdminContext';
import { useDoctor } from '../context/DoctorContext';
import { useApp } from '../context/AppContext';
import Spinner from './Spinner';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [state, setState] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const {setaToken}= useAdmin();
 const {setdToken}= useDoctor();
const {isAuthenticated,setIsAuthenticated,loading}= useApp();
  function validateUser(user) {
    const errors = {};
    if (!user.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/i.test(user.email)) {
      errors.email = 'Invalid email address';
    }
    if (!user.password) {
      errors.password = 'Password is required';
    }
    return errors;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateUser(user);
    if (Object.values(errors).length > 0) {
      setError(errors);
      return;
    }
    setIsLoading(true);
    try {
      if (state === 'admin') {
        const response = await adminApis.loginAdmin(user);
        toast.success(response?.message);
        setUser({
          email: '',
          password: '',
        });
        setaToken(localStorage.getItem('admin_access_token'));
        setIsAuthenticated(true)
      }
      //doctor login
      else {
        const response = await doctorApis.loginDoctor(user);
        toast.success(response?.message);
        setUser({
          email: '',
          password: '',
        });
        setdToken(localStorage.getItem('doctor_access_token'));
        setIsAuthenticated(true)
        
      }
    } catch (error) {
      toast.error(error?.message);
      setError({});
    } finally {
      setIsLoading(false);
    }
    //admin login
  };
  useEffect(()=>{
    if(isAuthenticated){
      window.location.href="/"
    }
    
  },[isAuthenticated])
  if(loading){
    return <Spinner/>
  }
  return (
    <CenterElements>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-sm min-h-[50vh] shadow-lg shadow-gray-800 p-6 flex flex-col gap-4'
      >
        <div className='w-full text-center capitalize text-2xl'>
          <h1 className='font-bold text-blue-700'>
            {state} <span className='text-gray-700 capitalize'>Login</span>{' '}
          </h1>
          <p></p>
        </div>
        <div>
          <Input
            label='email'
            name='email'
            id='email'
            type='email'
            placeholder='Enter email'
            value={user.email}
            disabled={isLoading}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          {error.email && <p className='text-red-600 text-xs'>{error.email}</p>}
        </div>
        <div>
          <Input
            label='password'
            name='password'
            id='password'
            type='password'
            placeholder='Enter password'
            value={user.password}
            disabled={isLoading}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          {error.password && (
            <p className='text-red-600 text-xs'>{error.password}</p>
          )}
        </div>
        <div className='text-center '>
          <button className='w-full capitalize font-medium text-sm text-white rounded-md bg-primary px-3 py-2'>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </div>
        <div className='mt-4 flex gap-2'>
          <p className='text-sm text-gray-600 capitalize'>
            {state === 'admin' ? 'doctor login' : 'admin login'}
            {state === 'admin' ? (
              <span
                onClick={() => setState('doctor')}
                className='cursor-pointer text-blue-800 ml-1'
              >
                Click here?
              </span>
            ) : (
              <span
                onClick={() => setState('admin')}
                className='cursor-pointer text-blue-800 ml-1'
              >
                Click here?
              </span>
            )}
          </p>
        </div>
      </form>
    </CenterElements>
  );
};

export default Login;
