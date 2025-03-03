import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Button from '../UI/Button';
import SubHeading from '../UI/SubHeading';
import Text from '../UI/Text';

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className=' flex  px-6 lg:px-12 d:mx-20 my-20 bg-primary'>
      {/* left side */}
      <div className='flex-1 sm:py-10 md:py-16 lg:py-24 justify-start items-start'>
        <div className='text-white'>
          <SubHeading className='text-white mb-2'>book appointment</SubHeading>
          <Text className='text-start text-xl'>with 100+ trusted doctors</Text>
        </div>
        <div className='w-44 mt-5  text-gray-700'>
          <Button
            label='create account'
            onClick={() => {
              navigate('/login');
              scrollTo(0, 0);
            }}
            className='bg-white text-gray-700'
          />
        </div>
      </div>
      {/* right side */}
      <div className='hidden md:block w-1/2 lg:w-[360px] relative'>
        <img
          className='w-full absolute bottom-0 right-0 max-w-md'
          src={assets.appointment_img}
          alt=''
        />
      </div>
    </div>
  );
};

export default Banner;
