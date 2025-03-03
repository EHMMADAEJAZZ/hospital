import { Link } from 'react-router-dom';
import Text from '../UI/Text';
import { specialityData } from '../assets/assets';
import SubHeading from '../UI/SubHeading';
const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16' id='speciality'>
      <SubHeading className='capitalize text-center'>
        find by speciality
      </SubHeading>
      <Text className='sm:w-1/3'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus,
        dolore?
      </Text>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {specialityData.map((speciality, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            to={`/doctors/${speciality.speciality}`}
            key={index}
            className='flex items-center gap-4 flex-col'
          >
            <img
              className='w-16 h-16 sm:w-24 sm:h-24 rounded-full hover:translate-y-[-10px] transition-all duration-300 mb-2'
              src={speciality.image}
              alt={speciality.speciality}
            />
            <Text>{speciality.speciality}</Text>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
