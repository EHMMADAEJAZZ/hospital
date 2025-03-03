import React, { useState } from 'react';
import CenterElements from '../UI/CenterElements';
import Input from '../UI/Input';
import { MdSupervisedUserCircle } from 'react-icons/md';
import TextArea from '../UI/TextArea';
import Select from '../UI/Select';
import { bloodTypes, experience, options } from '../utils/constanst';
import { genders } from '../utils/constanst';
import { assets } from '../assets/assets';
import uploadImage from '../utils/uploadImgToCloudinary';
import UsePost from '../common/hoooks/UsePost';
import { useAdmin } from '../context/AdminContext';
const initialState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  gender: '',
  speciality: '',
  degree: '',
  experience: '',
  about: '',
  fees: '',
  line1: '',
  line2: '',
  pinCode: '',
  city: '',
  state: '',
  dob: '',
  bloodType: '',
  image: '',
};
const AddDoctor = () => {
  const [doctor, setDoctor] = React.useState(initialState);
  const [error, setError] = React.useState({});
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const { isLoading, message, handlePostData, isError } =
    UsePost('/admin/doctor-registration');
     const {aToken,allDoctors} = useAdmin();
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    // submit form
    e.preventDefault();
    // add doctor to database
    const error = validate(doctor);
    setError(error);
    if (Object.values(error).length > 0) {
      return;
    }
    const doctorData = {
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      password: doctor.password,
      gender: doctor.gender,
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      about: doctor.about,
      fees: doctor.fees,
      address: JSON.stringify({
        line1: doctor.line1,
        line2: doctor.line2,
        pinCode: doctor.pinCode,
        city: doctor.city,
        state: doctor.state,
      }),
      dob: doctor.dob,
      bloodType: doctor.bloodType,
      image: doctor.image,
    };
    await handlePostData(doctorData,aToken);
   await allDoctors();
    if (message) {
      setDoctor({
        name: '',
        email: '',
        phone: '',
        password: '',
        gender: '',
        speciality: '',
        degree: '',
        experience: '',
        about: '',
        fees: '',
        line1: '',
        line2: '',
        pinCode: '',
        city: '',
        state: '',
        dob: '',
        bloodType: '',
        image: '',
      });
      setPreview(null);
    }
  };
  console.log(doctor?.bloodType)
  const handleFile = async (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setImage(file);
  };
  const uploadImageToCloudinary = async () => {
    setImgLoading(true);
    const upload = await uploadImage(image);
    setImgLoading(false);
    console.log(upload?.secure_url);
    setDoctor({ ...doctor, image: upload?.secure_url });
  };
  const validate = (value) => {
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

    if (!value.gender) {
      error.gender = 'Gender is required';
    }
    if (!value.fees) {
      error.fees = 'Fees is required';
    }
    //fee should not be less than 0
    if (value.fees < 0) {
      error.fees = 'Fees should not be less than 0';
    }
    if (!value.experience) {
      error.experience = 'Experience is required';
    }
    if (!value.speciality) {
      error.speciality = 'Speciality is required';
    }
    if (!value.about) {
      error.about = 'About is required';
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

    if (!value.password) {
      error.password = 'Password is required';
    }
    // check if password is valid
    if (value.password.length < 6) {
      error.password = 'Password should be at least 6 characters long';
    }
    if (!value.bloodType) {
      error.bloodType = 'Blood type is required';
    }
    if (!value.degree) {
      error.degree = 'Degree is required';
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
  return (
    <div>
      <div className='py-3'>
        <h1 className=' sm:text-start text-center text-xl font-medium text-gray-700 tracking-[2px]'>
          Add Doctor
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className='bg-white w-full max-h-[80vh] overflow-hidden overflow-y-auto px-6 pb-10 rounded-lg grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 '
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
                Doctor picture
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
{/* inputs */}
        <div>
          <Input
            label='Doctors name'
            name='name'
            id='name'
            placeholder='doctor name'
            disabled={isLoading}
            value={doctor.name}
            onChange={handleChange}
            className=''
          />
          {error.name && <p className='text-xs text-red-500'>{error.name}</p>}
        </div>
        <div>
          <Select
            label='speciality'
            options={options}
            id='speciality'
            name='speciality'
            disabled={isLoading}
            value={doctor.speciality}
            onChange={handleChange}
          />
          {error.speciality && (
            <p className='text-xs text-red-500'>{error.speciality}</p>
          )}
        </div>
        <div>
          <Input
            label='doctor email'
            id='email'
            name='email'
            type='email'
            disabled={isLoading}
            value={doctor.email}
            onChange={handleChange}
          />
          {error.email && <p className='text-xs text-red-500'>{error.email}</p>}
        </div>
        <div>
          <Input
            label='degree'
            name='degree'
            type='text'
            id='degree'
            disabled={isLoading}
            placeholder='doctors degree'
            value={doctor.degree}
            onChange={handleChange}
          />
          {error.degree && (
            <p className='text-xs text-red-500'>{error.degree}</p>
          )}
        </div>
        <div>
          <Input
            label='doctor password'
            id='password'
            name='password'
            type='password'
            placeholder='password'
            disabled={isLoading}
            value={doctor.password}
            onChange={handleChange}
          />
          {error.password && (
            <p className='text-xs text-red-500'>{error.password}</p>
          )}
        </div>
        <div>
          <Select
            label='doctor expeerience'
            options={experience}
            id='experience'
            name='experience'
            value={doctor.experience}
            onChange={handleChange}
            disabled={isLoading}
          />
          {error.experience && (
            <p className='text-xs text-red-500'>{error.experience}</p>
          )}
        </div>

        <div>
          <Input
            label='doctors phone'
            name='phone'
            id='phone'
            type='number'
            placeholder='mobile number'
            value={doctor.phone}
            disabled={isLoading}
            onChange={handleChange}
          />
          {error.phone && <p className='text-xs text-red-500'>{error.phone}</p>}
        </div>

        <div>
          <Input
            label='date of birth'
            name='dob'
            id='dob'
            type='date'
            disabled={isLoading}
            value={doctor.dob}
            onChange={handleChange}
          />
          {error.dob && <p className='text-xs text-red-500'>{error.dob}</p>}
        </div>

        <div>
          <Input
            label='doctor fees'
            name='fees'
            id='fees'
            type='number'
            placeholder='doctors fees'
            value={doctor.fees}
            disabled={isLoading}
            onChange={handleChange}
          />
          {error.fees && <p className='text-xs text-red-500'>{error.fees}</p>}
        </div>
        <div>
          <Select
            label='blood type'
            name='bloodType'
            id='bloodType'
            disabled={isLoading}
            options={bloodTypes}
            value={doctor.bloodType}
            onChange={handleChange}
          />
          {error.bloodType && (
            <p className='text-xs text-red-500'>{error.bloodType}</p>
          )}
        </div>

        <div className='col-span-full'>
          <p>Doctor Address</p>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4'>
            <div>
              <Input
                label='address line 1'
                name='line1'
                id='line1'
                type='text'
                placeholder='address line 1'
                value={doctor.line1}
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
                value={doctor.line2}
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
                value={doctor.pinCode}
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
                value={doctor.city}
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
                value={doctor.state}
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
            value={doctor.gender}
            disabled={isLoading}
            onChange={handleChange}
          />
          {error.gender && (
            <p className='text-xs text-red-500'>{error.gender}</p>
          )}
        </div>
        <div className='col-span-full'>
          <TextArea
            label='about doctor'
            cols={20}
            rows={6}
            name='about'
            id='about'
            disabled={isLoading}
            placeholder='about the doctor'
            className='w-full'
            value={doctor.about}
            onChange={handleChange}
          />
          {error.about && <p className='text-xs text-red-500'>{error.about}</p>}
        </div>

        <div className='w-full text-center col-span-full'>
          <button
            type='submit'
            className='w-full min-[400px]:w-44 text-white text-lg capitalize bg-primary px-3 py-2 rounded-lg'
          >
            {isLoading ? 'Submitting...' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
