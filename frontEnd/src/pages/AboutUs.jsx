import { assets } from '../assets/assets';

const AboutUs = () => {
  return (
    <div>
      <div className='text-xl w-full my-6 mx-auto'>
        <p className='text-center text-gray-500 uppercase'>
          About <span className='font-medium text-gray-600'>US</span>
        </p>
      </div>
      <div className='flex flex-col md:flex-row justify-center items-start gap-8'>
        <div className='w-full md:max-w-[250px] rounded-lg   '>
          <img
            src={assets.about_image}
            className='w-full rounded-lg'
            alt='about_img'
          />
        </div>
        <div className='flex-1 flex flex-col gap-5 justify-start text-sm font-light'>
          <p className='leading-6 text-justify'>
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p className='leading-6 text-justify'>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you&apos;re booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <div className='flex flex-col gap-5 '>
            <h2 className='font-medium'>Our Vision</h2>
            <p className='leading-6 text-justify'>
              Our vision at Prescripto is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>
      <div className='my-20'>
        <h1 className='tex-lg uppercase font-medium my-4'>
          Why <span className='font-bold'>Choose Us</span>
        </h1>
        <div className='flex flex-col md:flex-row '>
          <div className='flex-1 border border-gray-200 px-16 py-10 md:px-14'>
            <h1 className='text-lg font-medium text-gray-700'>Efficiency:</h1>
            <p className='text-xs leading-6'>
              treamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>
          <div className='flex-1 border border-gray-200 px-16 py-10 md:px-14'>
            <h1 className='text-lg font-medium text-gray-700'>Convenience:</h1>
            <p className='text-xs leading-6'>
              Access to a network of trusted healthcare professionals in your
              area
            </p>
          </div>
          <div className='flex-1 border border-gray-200 px-16 py-10 md:px-14'>
            <h1 className='text-lg font-medium text-gray-700'>
              Personalization:
            </h1>
            <p className='text-xs leading-6'>
              Tailored recommendations and reminders to help you stay on top of
              your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
