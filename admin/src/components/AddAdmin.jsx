import React, { useState } from 'react';
import CenterElements from '../UI/CenterElements';
import Input from '../UI/Input';
import { MdSupervisedUserCircle } from 'react-icons/md';
import TextArea from '../UI/TextArea';
import Select from '../UI/Select';
import { bloodTypes, options } from '../utils/constanst';
import { genders } from '../utils/constanst';
import { assets } from '../assets/assets';
import imageToBase64 from '../utils/ImageTobase64';
import UsePost from '../common/hoooks/UsePost';
import uploadImage from '../utils/uploadImgToCloudinary';
import { useAdmin } from '../context/AdminContext';
const initialState = {
  name: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  pinCode: '',
  city: '',
  state: '',
  gender: '',
  dob: '',
  bloodType: '',
  password: '',
  image: '',
};
const AddAdmin = () => {
  const [admin, setAdmin] = React.useState(initialState);
  const [preview, setPreview] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [error, setError] = React.useState({});
  const [image, setImage] = useState('');
  const { isLoading, message, handlePostData, isError } = UsePost(
    '/admin/admin-registration'
  );
  const {aToken} = useAdmin();
  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    // submit form
    e.preventDefault();
    // add doctor to database
    const error = validate(admin);
    setError(error);
    if (Object.values(error).length > 0) {
      return;
    }
    const data = {
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      address: JSON.stringify({
        line1: admin.line1,
        line2: admin.line2,
        pinCode: admin.pinCode,
        city: admin.city,
        state: admin.state,
      }),
      gender: admin.gender,
      dob: admin.dob,
      bloodType: admin.bloodType,
      password: admin.password,
      image: admin.image,
    };
    await handlePostData(data,aToken);
    if (message) {
      setAdmin({
        name: '',
        email: '',
        phone: '',
        line1: '',
        line2: '',
        pinCode: '',
        city: '',
        state: '',
        gender: '',
        dob: '',
        bloodType: '',
        password: '',
        image: '',
      });
      setPreview(null);
    }
  };
  const handleFile = async (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setImage(file);
  };
  const validate = (value) => {
    console.log(value);
    const error = {};
    if (!value.name) {
      error.name = 'Name is required';
    }
    if (!value.image) {
      error.image = 'Image is required';
    }
    if (!value.email) {
      error.email = 'Email is required';
    }
    if (!value.phone) {
      error.phone = 'Phone number is required';
    }
    //mobile number regex matches
    if (!/^[0-9]{10}$/.test(value.phone)) {
      error.phone = 'Invalid phone number enter your 10 digits mobile number';
    }
    if (!value.email) {
      error.email = 'Email is required';
    }
    if (!value.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      error.email = 'Invalid email';
    }

    if (!value.gender) {
      error.gender = 'Gender is required';
    }

    if (!value.dob) {
      error.dob = 'Date of birth is required';
    }
    //check if selected dob is greater than current date
    if (value.dob && new Date(value.dob) > new Date()) {
      error.dob = 'Date of birth should be less than current date';
    }
    //age must be 18 or greater till now
    const currentDate = new Date();
    const age = currentDate.getFullYear() - new Date(value.dob).getFullYear();
    if (age < 18) {
      error.dob = 'You must be 18 years old or older';
    }

    // check if blood type is valid

    if (value.dob && new Date(value.dob) > new Date()) {
      error.dob = 'Date of birth should be less than current date';
    }

    // check if password is valid
    if (!value.password) {
      error.password = 'Password is required';
    }
    if (value.password.length < 6) {
      error.password = 'Password should be at least 6 characters long';
    }
    if (!value.bloodType) {
      error.bloodType = 'Blood type is required';
    }
    //address
    if (!value.line1) {
      error.line1 = 'Address line 1 is required';
    }
    if (!value.line2) {
      error.line2 = 'Address line 2 is required';
    }
    if (!value.pinCode) {
      error.pinCode = 'Pin code is required';
    } else if (value.pinCode.length < 6 || value.pinCode.length > 6) {
      error.pinCode = 'Pin code should be 6 digits long';
    }
    if (!value.city) {
      error.city = 'City is required';
    }
    if (!value.state) {
      error.state = 'State is required';
    }

    return error;
  };
  const uploadImageToCloudinary = async () => {
    setImgLoading(true);
    const upload = await uploadImage(image);
    setImgLoading(false);
    console.log(upload?.secure_url);
    setAdmin({ ...admin, image: upload?.secure_url });
  };
  return (
    <div>
      <div className='py-3'>
        <h1 className='tracking-[2px] sm:text-start text-center text-xl font-medium text-gray-700'>
          Add Admin
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className='bg-white w-full max-h-[80vh] overflow-hidden overflow-y-auto px-6 rounded-lg grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 pb-10 '
      >
        {isError && (
          <div className='mt-2'>
            <p className='text-sm text-red-500'>{isError}</p>
          </div>
        )}
        {message && (
          <div className='mt-2'>
            <p className='text-sm text-green-600'>{message}</p>
          </div>
        )}
        <div className='col-span-full flex items-center gap-3 pt-4'>
          <div className='flex gap-3 items-center'>
            <label htmlFor='img' className='flex flex-col items-center'>
              {/* <MdSupervisedUserCircle className='w-20 h-20 text-gray-400 cursor-pointer' /> */}
              <img
                src={preview ? preview : assets.upload_area}
                alt=''
                className='w-16 h-16 rounded-full cursor-pointer'
              />
              <span className='text-xs w-fit text-neutral-400  cursor-pointer'>
                Admin picture
              </span>
            </label>
            {image && (
              <button
                type='button'
                onClick={uploadImageToCloudinary}
                disabled={isLoading || imgLoading}
                className='border hover:bg-blue-700 hover:text-white px-4 py-1 w-fit rounded text-xs'
              >
                {imgLoading ? 'uploading...' : 'Upload Image'}
              </button>
            )}
          </div>
          <input
            type='file'
            name='image'
            id='img'
            className='hidden'
            disabled={isLoading}
            onChange={handleFile}
          />
          {error.image && <p className='text-xs text-red-500'>{error.image}</p>}
        </div>

        <div>
          <Input
            label='Admin name'
            name='name'
            id='name'
            placeholder='admin name'
            disabled={isLoading}
            value={admin.name}
            onChange={handleChange}
            className=''
          />
          {error.name && <p className='text-xs text-red-500'>{error.name}</p>}
        </div>

        <div>
          <Input
            label='admin email'
            id='email'
            name='email'
            type='email'
            disabled={isLoading}
            value={admin.email}
            onChange={handleChange}
          />
          {error.email && <p className='text-xs text-red-500'>{error.email}</p>}
        </div>

        <div>
          <Input
            label='admin password'
            id='password'
            name='password'
            type='password'
            placeholder='password'
            disabled={isLoading}
            value={admin.password}
            onChange={handleChange}
          />
          {error.password && (
            <p className='text-xs text-red-500'>{error.password}</p>
          )}
        </div>

        <div>
          <Input
            label='admin phone'
            name='phone'
            id='phone'
            type='number'
            placeholder='mobile number'
            value={admin.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
          {error.phone && <p className='text-xs text-red-500'>{error.phone}</p>}
        </div>

        <div>
          <Input
            label='date of birth'
            name='dob'
            id='dob'
            type='date'
            value={admin.dob}
            disabled={isLoading}
            onChange={handleChange}
          />
          {error.dob && <p className='text-xs text-red-500'>{error.dob}</p>}
        </div>

        <div>
          <Select
            label='blood type'
            name='bloodType'
            id='bloodType'
            disabled={isLoading}
            options={bloodTypes}
            value={admin.bloodType}
            onChange={handleChange}
          />
          {error.bloodType && (
            <p className='text-xs text-red-500'>{error.bloodType}</p>
          )}
        </div>
        <div className='col-span-full '>
          <p className='mb-2 text-sm capitalize leading-6 font-medium text-gray-500 tracking-[2px]'>
            Admin Address
          </p>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 rounded lg:border-2 p-5'>
            <div>
              <Input
                label='address line 1'
                name='line1'
                id='line1'
                type='text'
                placeholder='address line 1'
                value={admin.line1}
                disabled={isLoading}
                onChange={handleChange}
              />
              {error.line1 && (
                <p className='text-xs text-red-500'>{error.line1}</p>
              )}
            </div>
            <div>
              <Input
                label='address line 2'
                name='line2'
                id='line2'
                type='text'
                placeholder='address line 2'
                value={admin.line2}
                disabled={isLoading}
                onChange={handleChange}
              />
              {error.line2 && (
                <p className='text-xs text-red-500'>{error.line2}</p>
              )}
            </div>
            <div>
              <Input
                label='pincode'
                name='pinCode'
                id='pinCode'
                type='number'
                placeholder='pincode'
                value={admin.pinCode}
                disabled={isLoading}
                onChange={handleChange}
              />
              {error.pinCode && (
                <p className='text-xs text-red-500'>{error.pinCode}</p>
              )}
            </div>
            <div>
              <Input
                label='city'
                name='city'
                id='city'
                type='text'
                placeholder='city'
                value={admin.city}
                disabled={isLoading}
                onChange={handleChange}
              />
              {error.city && (
                <p className='text-xs text-red-500'>{error.city}</p>
              )}
            </div>
            <div>
              <Input
                label='state'
                name='state'
                id='state'
                type='text'
                placeholder='state'
                value={admin.state}
                disabled={isLoading}
                onChange={handleChange}
              />
              {error.state && (
                <p className='text-xs text-red-500'>{error.state}</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <Select
            label='gender'
            options={genders}
            name='gender'
            value={admin.gender}
            disabled={isLoading}
            onChange={handleChange}
          />
          {error.gender && (
            <p className='text-xs text-red-500'>{error.gender}</p>
          )}
        </div>

        <div className='w-full text-center col-span-full'>
          <button
            type='submit'
            className='w-44 text-white text-lg capitalize bg-primary px-3 py-2 rounded-lg'
          >
            {isLoading ? 'Loading...' : 'Add Admin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
