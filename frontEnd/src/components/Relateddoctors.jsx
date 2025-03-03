import { useEffect, useState } from 'react';
// import { doctors } from '../assets/assets';
import Text from '../UI/Text';
import { useNavigate } from 'react-router-dom';
import { UseApp } from '../context/AppContext';
import Spinner from './Spinner';

const Relateddoctors = ({ speciality, docId }) => {
  const [relateDoc, setRelateDoc] = useState([]);
  const navigate = useNavigate();
 const {doctors,isLoading}= UseApp();

  const fetchRelatedDocs = () => {
    // fetch related doctor data by docId
    const relatedDocs = doctors.filter(
      (doc) => doc.speciality === speciality && doc._id !== docId
    );
    setRelateDoc(relatedDocs);
  };
  useEffect(() => {
    fetchRelatedDocs();
  }, [speciality, docId]);
  if (isLoading) return <Spinner/>;
  return (
    <div className='my-20'>
      <div className='text-center my-5 gap-2 flex flex-col'>
        <h1 className='text-lg font-medium'>Related Doctors</h1>
        <p className='text-xs'>
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>
      <div className='w-full grid grid-cols-1 items-center row-auto md:grid-cols-3 lg:grid-cols-5 gap-3 p-2 m-auto border border-gray-600'>
        {relateDoc.map((person, index) => {
          return (
            <div
              onClick={() => {
                navigate(`/appointments/${person._id}`);
                scrollTo(0, 0);
              }}
              key={index}
              className=' w-full mx-auto max-w-[300px] min-h-[250px] flex flex-col flex-1 gap-3 items-start justify-between  border border-gray-600 hover:scale-95 transition-all duration-300 '
            >
              <div className='max-h-44 bg-gray-200 w-full flex justify-center flex-1'>
                <img
                  className='w-40 h-full '
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
    </div>
  );
};

export default Relateddoctors;
