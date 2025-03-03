import { useNavigate } from 'react-router-dom';
import { useDoctor } from '../../context/DoctorContext';
import { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import uploadImage from '../../utils/uploadImgToCloudinary';
import Input from '../../UI/Input';
import {  dateFormat } from "../../utils/helper";
import Select from '../../UI/Select';
import {
  bloodTypes,
  experience,
  options,
  genders,
} from '../../utils/constanst';
import TextArea from '../../UI/TextArea';
import { doctorApis } from '../../common/api';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
const EditDoctorProfile = () => {
  const [error, setError] = useState({});
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const { dToken, getDoctorProfile, doctorProfile, isLoading:loading } = useDoctor();
  const initialState = {
    name: '',
    email: '',
    phone: '',
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
  const [userProfileData, setuserProfileData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleFile = async (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setImage(file);
  };
  const handleChange = (e) => {
    setuserProfileData({ ...userProfileData, [e.target.name]: e.target.value });
  };
  const uploadImageToCloudinary = async () => {
    setImgLoading(true);
    const upload = await uploadImage(image);
    setImgLoading(false);
    console.log(upload?.secure_url);
    setImage('');
    setuserProfileData({ ...userProfileData, image: upload?.secure_url });
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
   useEffect(() => {
    if (dToken) {
      getDoctorProfile();
      setuserProfileData({
        name: doctorProfile?.name,
        email: doctorProfile?.email,
        phone: doctorProfile?.phone,
        image: doctorProfile?.image,
        dob: doctorProfile?.dob,
        degree: doctorProfile?.degree,
        fees: doctorProfile?.fees,
        gender: doctorProfile?.gender,
        speciality: doctorProfile?.speciality,
        experience: doctorProfile?.experience,
        line1: doctorProfile?.address?.line1,
        line2: doctorProfile?.address?.line2,
        pinCode: doctorProfile?.address?.pinCode,
        city: doctorProfile?.address?.city,
        state: doctorProfile?.address?.state,
        available: doctorProfile?.available,
        about: doctorProfile?.about,
        bloodType: doctorProfile?.bloodType,
      });
    }
  }, [dToken]);
   const handleSubmit = async (e) => {
      // submit form
      e.preventDefault();
      // add doctor to database
      const error = validate(userProfileData);
      setError(error);
      if (Object.values(error)?.length > 0) {
        return;
      }
      setIsLoading(true);
      try {
         const doctorData = {
        name: userProfileData.name,
        email: userProfileData.email,
        phone: userProfileData.phone,
        gender: userProfileData.gender,
        speciality: userProfileData.speciality,
        degree: userProfileData.degree,
        experience: userProfileData.experience,
        about: userProfileData.about,
        fees: userProfileData.fees,
        address: JSON.stringify({
          line1: userProfileData.line1,
          line2: userProfileData.line2,
          pinCode: userProfileData.pinCode,
          city: userProfileData.city,
          state: userProfileData.state,
        }),
        dob: userProfileData.dob,
        bloodType: userProfileData.bloodType,
        image: userProfileData.image,
      };
      const response = await doctorApis.updateDoctorProfile(doctorData,dToken);
      if (response.success) {
           toast.success(response?.message);
            getDoctorProfile();
            navigate('/doctor/profile')
      }else{
        toast.error(response?.message);
      }
      console.log(doctorData)
      } catch (error) {
        console.log(error);
        toast.error(error?.message);
      }finally{
        setIsLoading(false);
      }

     
    };
 
  if (loading) {
    return <Spinner/>
  }
  return (
    <div className='py-3 w-full min-h-[85vh] max-h-[85vh] overflow-hidden overflow-y-auto'>
      <form
        onSubmit={handleSubmit}
        className='bg-white w-full max-h-[80vh] overflow-hidden overflow-y-auto px-6 pb-10 rounded-lg grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 '
      >
          <div className='col-span-full flex items-center gap-3 pt-4'>
            <div className='flex gap-3 items-center'>
              <label htmlFor='img' className='flex flex-col items-center'>
                {/* <MdSupervisedUserCircle className='w-20 h-20 text-gray-400 cursor-pointer' /> */}
                <img
                  src={preview ? preview : doctorProfile?.image}
                  alt=''
                  className='w-16 h-16 bg-blue-500 rounded-full cursor-pointer'
                />
                <span className='text-xs w-fit mt-2 text-neutral-700  cursor-pointer border px-2 py-0.5 hover:bg-blue-500 hover:text-white transition-all rounded border-blue-400/50'>
                  Change picture
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
            {error.image && (
              <p className='text-xs text-red-500'>{error.image}</p>
            )}
          </div>
        <div>
          <Input
            label='Doctors name'
            name='name'
            id='name'
            placeholder='doctor name'
            disabled={isLoading}
            value={userProfileData?.name}
            onChange={handleChange}
            className=''
          />
          {error.name && <p className='text-xs text-red-500'>{error.name}</p>}
        </div>
        <div>
            <div>

          <Select
            label='speciality'
            options={options}
            id='speciality'
            name='speciality'
            defaultChecked={userProfileData.speciality}
            disabled={isLoading}
            value={userProfileData.speciality}
            onChange={handleChange}
            />
            <p className='text-xs text-red-700 capitalize text-right'>{ userProfileData.speciality && userProfileData?.speciality}</p>
            </div>
          {error.speciality && (
            <p className='text-xs text-red-500'>{error.speciality}</p>
          )}
        </div>
        <div>
          <Input
            label='email'
            id='email'
            name='email'
            type='email'
            readOnly={true}
            disabled={true}
            value={userProfileData.email}
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
            value={userProfileData.degree}
            onChange={handleChange}
          />
          {error.degree && (
            <p className='text-xs text-red-500'>{error.degree}</p>
          )}
        </div>

        <div>
            <div>

          <Select
            label='doctor expeerience'
            options={experience}
            id='experience'
            name='experience'
            value={userProfileData.experience}
            onChange={handleChange}
            disabled={isLoading}
            />
            <p className='text-xs text-red-700 capitalize text-right'>{ userProfileData.experience && userProfileData?.experience}</p>
            </div>
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
            value={userProfileData.phone}
            disabled={isLoading}
            onChange={handleChange}
          />
          {error.phone && <p className='text-xs text-red-500'>{error.phone}</p>}
        </div>

        <div>
          <div>

          <Input
            label='date of birth'
            name='dob'
            id='dob'
            type='date'
            disabled={isLoading}
            value={userProfileData.dob}
            onChange={handleChange}
            />
            <p className='text-xs text-red-700 capitalize text-right'>{ userProfileData.dob && dateFormat(userProfileData?.dob)}</p>
            </div>
          {error.dob && <p className='text-xs text-red-500'>{error.dob}</p>}
        </div>

        <div>
          <Input
            label='doctor fees'
            name='fees'
            id='fees'
            type='number'
            placeholder='doctors fees'
            value={userProfileData.fees}
            disabled={isLoading}
            onChange={handleChange}
          />
          {error.fees && <p className='text-xs text-red-500'>{error.fees}</p>}
        </div>
        <div>
            <div>

          <Select
            label='blood type'
            name='bloodType'
            id='bloodType'
            disabled={isLoading}
            options={bloodTypes}
            value={userProfileData.bloodType}
            onChange={handleChange}
            />
             <p className='text-xs text-red-700 capitalize text-right'>{ userProfileData.bloodType && userProfileData?.bloodType}</p>
            </div>
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
                value={userProfileData.line1}
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
                value={userProfileData.line2}
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
                value={userProfileData.pinCode}
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
                value={userProfileData.city}
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
                value={userProfileData.state}
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
            <div>

          <Select
            label='gender'
            options={genders}
            name='gender'
            value={userProfileData.gender}
            disabled={isLoading}
            onChange={handleChange}
          />
           <p className='text-xs capitalize text-red-700 text-right'>{ userProfileData.gender && userProfileData?.gender}</p>
              </div>
          {error.gender && (
              <p className='text-xs  text-red-500'>{error.gender}</p>
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
            value={userProfileData.about}
            onChange={handleChange}
          />
          {error.about && <p className='text-xs text-red-500'>{error.about}</p>}
        </div>

        <div className='w-full text-center col-span-full'>
          <button
            type='submit'
            className='w-full min-[400px]:w-44 text-white text-lg capitalize bg-primary px-3 py-2 rounded-lg  hover:bg-yellow-800 transition-all'
          >
            {isLoading ? 'Loading...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctorProfile;
