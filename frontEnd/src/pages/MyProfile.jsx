import { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Input from '../UI/Input';
import { UseApp } from '../context/AppContext';
import { dateFormat } from '../utils/helper';
import Select from '../UI/Select';
import { bloodTypes, genders } from '../utils/constants';
import uploadImage from '../utils/uploadImgToCloudinary';
import { userEndPoints } from '../common/api';
import { toast } from 'react-toastify';
const MyProfile = () => {
  const { userDetails, userProfile, userToken, isLoading: loading } = UseApp();
  const [userData, setUserData] = useState({});
  const [preveiw, setPreveiw] = useState(null);
  const [image, setImage] = useState('');
  const [isErrors, setIsErrors] = useState({});
  const [imgLoading, setImgLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // console.log('user',userData) // Replace with actual user data
  const [edit, setEdit] = useState(false);
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    // setUserData({...userData, image: e.target.files[0] });
    setPreveiw(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };
  const handleEditClick = () => {
    scrollTo(0, 0);
    setEdit(!edit);
  };
  function validateData(values) {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (!values.phone) {
      errors.phone = 'Phone number is required';
    }
    if (!values.address?.line1) {
      errors.line1 = 'Line 1 is required';
    }
    if (!values.address?.line2) {
      errors.line2 = 'Line 2 is required';
    }
    if (!values.address?.city) {
      errors.city = 'City is required';
    }
    if (!values.address?.pinCode) {
      errors.pinCode = 'Pin code is required';
    }
    if (!values.address?.state) {
      errors.state = 'State is required';
    }
    if (!values.dob || values.dob.startsWith('1000')) {
      errors.dob = 'Date of birth is required';
    }
    if (!values.gender || values.gender === 'not selected') {
      errors.gender = 'Gender is required';
    }
    if (!values.bloodType) {
      errors.bloodType = 'Blood type is required';
    }
    return errors;
  }
  const handleSaveClick = async () => {
    const errors = validateData(userData);
    setIsErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    const user = {
      name: userData?.name,
      email: userData?.email,
      phone: userData?.phone,
      address: JSON.stringify(userData?.address),
      dob: userData?.dob,
      gender: userData?.gender,
      bloodType: userData?.bloodType,
      image: userData?.image,
    };
    setIsLoading(true);
    try {
      const res = await userEndPoints.updateUserProfile(user, userToken);
      scrollTo(0, 0);
      if (res.success) {
        setEdit(!edit);
        await userProfile();
        toast.success(res?.message);
      } else {
        console.error('Error updating user profile');
        toast.error(res?.message);
        userProfile();
      }
    } catch (error) {
      console.error('Error updating user profile');
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  const uploadImageToCloudinary = async () => {
    setImgLoading(true);
    const upload = await uploadImage(image);
    setImgLoading(false);
    console.log(upload?.data?.secure_url);
    setUserData({ ...userData, image: upload?.data?.secure_url });
  };
  useEffect(() => {
    userProfile();
    setUserData(userDetails);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className='max-w-[150px]'>
        {preveiw ? (
          <img className='w-full rounded-md' src={preveiw} alt='profile_pic' />
        ) : (
          <img
            className='w-full rounded-md'
            src={userDetails?.image || assets.profile_pic}
            alt='profile_pic'
          />
        )}
      </div>
      <div className='my-2 text-gray-700 text-lg font-medium capitalize'>
        {edit && (
          <div className='flex items-center space-x-3'>
            <label
              htmlFor='image'
              className={`cursor-pointer text-xs border px-3 py-1 ${
                imgLoading ? 'blur-sm' : ''
              }`}
            >
              change profile
            </label>
            <input
              type='file'
              name='image'
              id='image'
              disabled={imgLoading}
              onChange={handleFileChange}
              className='max-w-sm hidden'
            />
            {image && (
              <button
                onClick={uploadImageToCloudinary}
                disabled={imgLoading || isLoading}
                className='cursor-pointer text-xs border px-3 py-1'
              >
                {imgLoading ? 'uploading...' : 'Upload Image'}
              </button>
            )}
          </div>
        )}
      </div>
      <div className='my-2 text-gray-700 text-lg font-medium capitalize'>
        {edit ? (
          <div className='flex flex-col'>
            <Input
              type='text'
              name='name'
              value={userData?.name}
              disabled={isLoading}
              onChange={handleChange}
              className='max-w-sm'
            />
            {isErrors?.name && (
              <p className='text-red-600 text-xs'>{isErrors?.name}</p>
            )}
          </div>
        ) : (
          <p className='text-sm'>{userDetails?.name}</p>
        )}
      </div>
      <hr className='h-0.5 bg-gray-500 ' />
      <div className='my-2 flex flex-col gap-3 w-full'>
        <p className='text-lg underline font-light text-gray-600 uppercase'>
          CONTACT INFORMATION
        </p>
        <div className='flex flex-wrap items-center text-gray-500 w-full'>
          <p className='w-20 text-sm capitalize'>Email id:</p>
          {edit ? (
            <div className='flex flex-col '>
              <Input
                type='text'
                name='email'
                value={userData?.email}
                disabled={isLoading}
                onChange={handleChange}
                className='w-full max-w-sm'
                placeholder='email id'
              />
              {isErrors?.email && (
                <p className='text-red-600 text-xs'>{isErrors?.email}</p>
              )}
            </div>
          ) : (
            <p className=' text-sm text-primary'>
              <a href={`mailto:${userDetails?.email}`}> {userDetails?.email}</a>
            </p>
          )}
        </div>
        <div className='flex flex-wrap items-center text-gray-500 w-full '>
          <p className='w-20 text-sm capitalize'>Phone:</p>
          {edit ? (
            <div className='flex flex-col w-full'>
              <Input
                type='number'
                name='phone'
                value={userData?.phone}
                disabled={isLoading}
                onChange={handleChange}
                className='w-full max-w-sm'
                placeholder='mobile number'
              />
              {isErrors?.phone && (
                <p className='text-red-600 text-xs'>{isErrors?.phone}</p>
              )}
            </div>
          ) : (
            <p className=' text-sm text-primary'>
              <a href={`tel:+${userDetails?.phone}`}> {userDetails?.phone}</a>
            </p>
          )}
        </div>
        <div className='flex flex-wrap  items-start text-gray-500 w-full '>
          <p className='w-20 text-sm capitalize'>Address:</p>
          {edit ? (
            <div>
              <div className='flex flex-col w-full'>
                <Input
                  label='line1'
                  type='text'
                  name='line1'
                  value={userData?.address?.line1}
                  disabled={isLoading}
                  placeholder='address line 1'
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className='w-full max-w-sm'
                />
                {isErrors?.line1 && (
                  <p className='text-red-600 text-xs'>{isErrors?.line1}</p>
                )}
              </div>
              <div className='flex flex-col w-full'>
                <Input
                  label='line2'
                  type='text'
                  name={`${userData?.address?.line2}`}
                  value={userData?.address?.line2}
                  disabled={isLoading}
                  placeholder='address line 2'
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  className='w-full max-w-sm'
                />
                {isErrors?.line2 && (
                  <p className='text-red-600 text-xs'>{isErrors?.line2}</p>
                )}
              </div>
              <div className='flex flex-col w-full '>
                <Input
                  label='city'
                  type='text'
                  name={`${userData?.address?.city}`}
                  value={userData?.address?.city}
                  disabled={isLoading}
                  placeholder='city '
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                  className='w-full max-w-sm'
                />
                {isErrors?.city && (
                  <p className='text-red-600 text-xs'>{isErrors?.city}</p>
                )}
              </div>
              <div className='flex flex-col w-full'>
                <Input
                  label='pincode'
                  type='number'
                  name={`${userData?.address?.pinCode}`}
                  value={userData?.address?.pinCode}
                  disabled={isLoading}
                  placeholder='pin code'
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, pinCode: e.target.value },
                    }))
                  }
                  className='w-full max-w-sm'
                />
                {isErrors?.pinCode && (
                  <p className='text-red-600 text-xs'>{isErrors?.pinCode}</p>
                )}
              </div>
              <div className='flex flex-col w-full'>
                <Input
                  label='state'
                  type='text'
                  name={`${userData?.address?.state}`}
                  value={userData?.address?.state}
                  disabled={isLoading}
                  placeholder='state'
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value },
                    }))
                  }
                  className='w-full max-w-sm'
                />
                {isErrors?.state && (
                  <p className='text-red-600 text-xs'>{isErrors?.state}</p>
                )}
              </div>
            </div>
          ) : (
            <div className='text-gray-500 capitalize'>
              <p className='text-sm'>
                {userDetails?.address?.line1}, {userDetails?.address?.line2},
                {userDetails?.address?.city}, {userDetails?.address?.pinCode}
              </p>
              <p className='text-sm'>{userDetails?.address?.state}</p>
            </div>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-3 mt-10 w-full'>
        <p className='text-lg underline font-light text-gray-600 uppercase'>
          BASIC INFORMATION
        </p>
        <div className='flex  items-center flex-wrap text-gray-500 w-full '>
          <p className='w-20 text-sm capitalize'>gender:</p>
          {edit ? (
            <div className='flex flex-col w-full'>
              {/* <Input
              type='text'
              name='gender'
              value={userData.gender}
              disabled={false}
              onChange={handleChange}
              className='w-full max-w-sm'
              /> */}
              <div>

              <Select
                name='gender'
                value={userData?.gender}
                disabled={isLoading}
                options={genders}
                onChange={handleChange}
                className='w-full max-w-sm'
                />
                  <p className='text-xs w-full max-w-sm text-red-700 capitalize text-right'>{ userData?.gender && userData?.gender}</p>
                </div>
              {isErrors?.gender && (
                <p className='text-red-600 text-xs'>{isErrors?.gender}</p>
              )}
            </div>
          ) : (
            <p className='text-sm'>{userDetails?.gender}</p>
          )}
        </div>
        <div className='flex flex-wrap  items-center text-gray-500 '>
          <p className='w-20 text-sm capitalize'>BirthDay:</p>
          {edit ? (
            <div className='flex flex-col w-full'>
              <div>

              <Input
                type='date'
                name='dob'
                value={userData?.dob}
                disabled={isLoading}
                onChange={handleChange}
                className='w-full max-w-sm'
                />
                 <p className='text-xs w-full max-w-sm text-red-700 capitalize text-right'>{ userData?.dob && dateFormat(userData?.dob)}</p>
                </div>
              {isErrors?.dob && (
                <p className='text-red-600 text-xs'>{isErrors?.dob}</p>
              )}
            </div>
          ) : (
            <p className='text-sm'>{userDetails?.dob && dateFormat(userDetails?.dob)}</p>
          )}
        </div>
        <div className='flex flex-wrap  items-center text-gray-500 '>
          <p className='w-20 text-sm capitalize'>Blood group:</p>
          {edit ? (
            <div className='flex flex-col w-full'>
              <div>

              <Select
                name='bloodType'
                value={userData?.bloodType}
                disabled={isLoading}
                options={bloodTypes}
                onChange={handleChange}
                className='w-full max-w-sm'
                />
                 <p className='text-xs w-full max-w-sm text-red-700 capitalize text-right'>{ userData?.bloodType && userData?.bloodType}</p>
                </div>
              {isErrors?.bloodType && (
                <p className='text-red-600 text-xs'>{isErrors?.bloodType}</p>
              )}
            </div>
          ) : (
            <p className='text-sm'>
              {userDetails?.bloodType ? userDetails?.bloodType : 'not selected'}
            </p>
          )}
        </div>
      </div>
      <div className='flex gap-3 my-20'>
        <button
          onClick={handleEditClick}
          className={`rounded-full border text-xs border-primary  px-4 py-2 w-24 text-gray-500 ${
            edit ? 'blur-sm' : ''
          }`}
          disabled={edit}
        >
          Edit
        </button>
        <button
          onClick={handleSaveClick}
          className={`rounded-full border text-xs text-gray-500 border-primary px-4 py-2 ${
            !edit ? 'blur-sm' : ''
          } `}
          disabled={!edit}
        >
          {isLoading ? 'loading...' : 'Save information'}
        </button>
        <button
          onClick={() => setEdit(false)}
          className={`rounded-full border text-xs text-gray-500 border-red-600 px-4 py-2 ${
            !edit ? 'blur-sm' : ''
          } `}
          disabled={!edit}
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
