import { assets } from '../assets/assets';
import Heading from '../UI/Heading';
const Header = () => {
  return (
    <div className='flex flex-col items-start  md:flex-row flex-wrap md:items-center px-6 rounded-lg lg:px-20 md:px-10 md:justify-between bg-primary '>
      {/* -----left side----- */}
      <div className='w-full md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 mx-auto md:py-[10vw] md:mb-[30px] '>
        <Heading className='text-white text-sm md:text-2xl font-semibold'>
          book appointments <br /> with trusted doctors
        </Heading>
        <div className='flex flex-col md:flex-row  items-center justify-center gap-3 font-light text-white'>
          <img
            className='w-28 '
            src={assets.group_profiles}
            alt='doctors_photo'
          />
          <p className='text-sm'>
            Lorem ipsum dolor, sit amet consectetur
            <br className='hidden sm:block' />
            consectetur adipisicing elit.
          </p>
        </div>
        <a
          href='#speciality'
          className=' flex items-center  justify-start bg-white p-2 rounded-full text-sm gap-3 capitalize font-medium text-gray-600 hover:text-white hover:bg-black transition-all duration-300'
        >
          book appointment{' '}
          <img
            className='w-6 h-6 rounded-full bg-red-500 p-1'
            src={assets.arrow_icon}
            alt='arrow_icon'
          />
        </a>
      </div>
      {/* -----rigth side ----- */}
      <div className='w-full md:w-1/2 relative'>
        <img
          className='w-full bottom-0 h-auto rounded-lg backdrop:text-slate-400'
          src={assets.header_img}
          alt='header_img'
        />
      </div>
    </div>
  );
};

export default Header;
