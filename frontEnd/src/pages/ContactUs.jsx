import { assets } from '../assets/assets';

const ContactUs = () => {
  return (
    <div>
      <div className='text-xl w-full my-6 mx-auto'>
        <p className='text-center uppercase text-gray-500'>
          contact <span className='font-medium text-gray-600'>US</span>
        </p>
      </div>
      <div className='flex flex-col md:flex-row justify-center items-start gap-8 '>
        <div className='w-full md:max-w-[250px]    '>
          <img src={assets.contact_image} className='w-full' alt='about_img' />
        </div>

        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          <h1 className='uppercase text-lg font-medium'>Our OFFICE</h1>
          <div>
            <p>54709 Willms Station </p>
            <p>Suite 350, Washington, USA</p>
          </div>
          <div>
            <p>Tel: (415) 555‑0132</p>
            <p>Email: greatstackdev@gmail.com</p>
          </div>
          <div>
            <h1 className='uppercase font-medium'>Careers at PRESCRIPTO</h1>
            <p>Learn more about our teams and job openings.</p>
          </div>
          <div>
            <button className='border border-gray-200 px-4 py-3 cursor-pointer hover:bg-black hover:text-white transition-all duration-500'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
