import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import SubHeading from '../UI/SubHeading';
import Text from '../UI/Text';

const Footer = () => {
  return (
    <div>
      <div className='flex py-6  flex-col  px-4 md:grid grid-cols-[3fr_1fr_1fr]  text-gray-500 my-0 mt-40 gap-14'>
        <div className=''>
          <img src={assets.logo} className='w-28' alt='' />
          <Text className='mt-3 text-justify leading-6'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia
            libero, natus hic voluptates possimus provident incidunt animi sed
            quia, cupiditate expedita corporis error, placeat tempora
            recusandae? Vero deserunt est unde.
          </Text>
        </div>
        <div className=''>
          <SubHeading className='text-lg font-medium uppercase'>
            company
          </SubHeading>
          <ul className='flex flex-col gap-2 text-gray-600 mt-3'>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            <li>
              <Link to='/contact'>Contact us</Link>
            </li>
            <li>
              <Link to='/'> privacy policy</Link>
            </li>
          </ul>
        </div>
        <div className=''>
          <SubHeading className='text-lg font-medium uppercase'>
            get in touch
          </SubHeading>
          <ul className='flex flex-col gap-2 text-gray-600 mt-3'>
            <li>
              <a href='tel:+917006520326'>+917006520326</a>
            </li>
            <li>
              <a href='mailto:ehmmadaejazz33@gmail.com'>
                ehmmadaejazz33@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* -------------copyright----------- */}
      <div className='my-4'>
        <hr className='h-0.5 bg-text-gray-500 my-2' />
        <Text className='text-center text-gray-600 text-sm'>
          &copy; {new Date().getFullYear()} All rights reserved
        </Text>
      </div>
    </div>
  );
};

export default Footer;
