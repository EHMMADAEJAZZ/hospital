import { useEffect, useState } from 'react';
import CenterElements from '../UI/CenterElements';
import Input from '../UI/Input';
import { FaArrowsSpin } from 'react-icons/fa6';
import { userEndPoints } from '../common/api';
import { toast } from 'react-toastify';
import { UseApp } from '../context/AppContext';
const Login = () => {
  const [isRegister, setisRegister] = useState(true);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const {userToken,setUserToken,isAuthenticated, setIsAuthenticated}=UseApp()
  const handleToggleRegister = () => {
    setisRegister(!isRegister);
    scrollTo(0, 0);
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  function validateInputs(values){
    const errors={};
    if(!values.name){
      errors.name="Name is required";
    }
    if(!values.email){
      errors.email="Email is required";
    }
    if(!values.password){
      errors.password="Password is required";
    }
    return errors;
  }
  function validateInputsLogin(values){
    const errors={};
    
    if(!values.email){
      errors.email="Email is required";
    }
    if(!values.password){
      errors.password="Password is required";
    }
    return errors;
  }
  // Handle form submission for register and login
  const handleRegister = async (e) => {
    e.preventDefault();
    // Perform register logic here
    const errors = validateInputs(user);
    setIsError(errors);
    if(Object.values(errors).length >0){
      return;
    }
    setIsLoading(true);
    try {
      const res = await userEndPoints.registerUser(user);
      if (res.success) {
        toast.success(res?.message);
        setisRegister(false);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
    // console.log(name, email, password);
    
  };
  const handleLogin = async(e) => {
    e.preventDefault();
    const userData ={
      email: user.email,
      password: user.password,
    }
    console.log('hello')
    const errors = validateInputsLogin(userData);
    setIsError(errors);
    if(Object.values(errors).length > 0){
      return;
    }
    setIsLoading(true);
    try {
      const res = await userEndPoints.loginUser(userData);
      if (res.success) {
        toast.success(res?.message);
        setUserToken(localStorage.getItem("user_access_token"));
        setIsAuthenticated(true);
      }else{
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
      
    }finally{
      setIsLoading(false);
    }
    // Perform login logic here
  };
  useEffect(()=>{
    if(userToken && isAuthenticated){
      window.location.href='/'
    }
  },[userToken,isAuthenticated])
  return (
    <CenterElements>
      <form
        onSubmit={isRegister ? handleRegister : handleLogin}
        className='w-full max-w-md rounded-lg border border-gray-400 p-6 mx-auto'
      >
        <div className='flex flex-col items-center text-2xl uppercase gap-3'>
          <h3 className='font-bold text-gray-700'>
            {isRegister ? 'create Account' : 'Login'}
          </h3>
          <p className='text-sm capitalize text-gray-600'>
            {isRegister
              ? 'Please sign up to book appointment'
              : 'Please login to book appointment'}
          </p>
        </div>
        {/* Form inputs */}
        {isRegister && (
          <div className='flex flex-col '>

          <Input
            label='full Name'
            id='name'
            type='text'
            placeholder='enter full name'
            name='name'
            value={user?.name}
            disabled={isLoading}
            onChange={handleChange}
            />
            {
              isError?.name && (
                <p className='text-red-600 text-xs'>{isError?.name}</p>
              )
            }
            </div>
        )}
        <div className='flex flex-col '>

        <Input
          label='email'
          id='email'
          type='email'
          placeholder='enter email address'
          name='email'
          value={user?.email}
          disabled={isLoading}
          onChange={handleChange}
          />
          {
            isError?.email && (
              <p className='text-red-600 text-xs'>{isError?.email}</p>
            )
  
          }
          </div>
          <div className='flex flex-col'>

        <Input
          label='password'
          id='password'
          type='password'
          placeholder='enter your password'
          name='password'
          value={user?.password}
          disabled={isLoading}
          onChange={handleChange}
          />
          {
            isError?.password && (
              <p className='text-red-600 text-xs'>{isError?.password}</p>
            )
          }
          </div>
        {/* Submit button */}
        {/* {message && <p className='my-2 text-green-600 text-sm'>{message}</p>}
        {error && <p className='my-2 text-red-600 text-sm'>{error}</p>} */}
        <div className='flex items-center justify-between mt-4'>
          <button
            type='submit'
            className='w-full h-12 px-4 py-2 text-white bg-primary rounded-md focus:outline-none'
            disabled={isLoading}
          >
            {isRegister ? (
              <p className='flex items-center justify-center '>
                {isLoading ? (
                  <FaArrowsSpin className='animate-spin' />
                ) : (
                  'Create Account'
                )}
              </p>
            ) : (
              <p className='flex items-center justify-center '>
                {isLoading ? (
                  <FaArrowsSpin className='animate-spin' />
                ) : (
                  'Login'
                )}{' '}
              </p>
            )}
          </button>
        </div>
        <div className='flex items-center gap-2 my-4'>
          <p
            onClick={handleToggleRegister}
            className='text-sm text-gray-500 cursor-pointer'
          >
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <span className='text-primary'>Login Here</span>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <span className='text-primary'>Sign Up Here</span>
              </p>
            )}
          </p>
        </div>
      </form>
    </CenterElements>
  );
};

export default Login;
