import { UseApp } from '../context/AppContext';
import Button from '../UI/Button';
import SubHeading from '../UI/SubHeading';
import Text from '../UI/Text';
// import { doctors } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
const TopDoctors = () => {
  const navigate = useNavigate();
  //   const [page, setpage] = useState(1);
  //   const totalPages = Math.ceil(doctors.length / 10);
  const {doctors,isLoading}= UseApp();
  if(isLoading){
    return <Spinner/>
  }
  return (
    <div className='flex flex-col items-center py-16 gap-4  '>
      <SubHeading className='capitalize text-center'>
        top doctors to Book
      </SubHeading>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus,
        fugit!
      </Text>
      <div className='w-full  grid grid-cols-1 row-auto md:grid-cols-4 lg:grid-cols-5 gap-3 p-2 '>
        {doctors.slice(0, 10).map((person, index) => {
          return (
            <div
              onClick={() => navigate(`/appointments/${person._id}`)}
              key={index}
              className=' w-full max-w-[300px] min-h-[250px]  flex  flex-col flex-1 gap-3 items-start justify-between  border border-gray-600 hover:scale-95 transition-all duration-300 mx-auto'
            >
              <div className='max-h-44 bg-gray-200 w-full flex justify-center flex-1'>
                <img
                  className='w-48 h-full '
                  src={person.image}
                  alt={person.name}
                />
              </div>
              <div className='px-2 mb-4'>
                <div className='flex items-center gap-2'>
                  <Text className='text-start w-2 h-5 text-green-500'>
                    Available
                  </Text>
                </div>
                <Text className='text-start'>{person.name}</Text>
                <Text className='text-start'>{person.speciality}</Text>
              </div>
            </div>
          );
        })}
      </div>
      {/* <p>
        {totalPages} {page}
      </p> */}
      <div className='mt-5'>
        <Button
          className='w-40 mb-4'
          label='show more...'
          onClick={() => {
            navigate('/doctors');
            scrollTo(0, 0);
          }}
        />
      </div>
    </div>
  );
};

export default TopDoctors;
