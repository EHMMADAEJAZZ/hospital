import { useState } from 'react';
import apiEndPoints from '../api';
import { toast } from 'react-toastify';

const UsePost = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [message, setmessage] = useState(null);
  const handlePostData = async ( data,token) => {
    setIsLoading(true);
    try {
      const response = await apiEndPoints.createApi(url, data,token);
      setmessage(response?.message);
      toast.success(response?.message);
      setIsError(null)
    } catch (error) {
      setIsError(error?.message);
      toast.error(error?.message);
      setmessage(null)
    } finally {
      setIsLoading(false);
    }
  };
  return {
    handlePostData,
    isLoading,
    isError,
    message,
  };
};

export default UsePost;
