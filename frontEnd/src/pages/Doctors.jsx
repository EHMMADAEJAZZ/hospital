import { useNavigate, useParams } from 'react-router-dom';
// import { doctors } from '../assets/assets';
import { useEffect, useState } from 'react';
import Text from '../UI/Text';
import { UseApp } from '../context/AppContext';
const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const {doctors}= UseApp();
  // setFilterDoc(doctors);
  // console.log(speciality);
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };
  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);
  const navigate = useNavigate();
  // console.log(showFilterMenu);
  return (
    <div>
      <p className='text-sm capitalize font-medium leading-6'>
        browse doctors with speciality
      </p>
      <div className='flex flex-col  gap-4 mt-6 sm:flex-row items-start'>
        <button
          onClick={() => setShowFilterMenu((prev) => !prev)}
          className={`py-1 px-3 capitalize border rounded text-sm sm:hidden transition-all ${
            showFilterMenu ? 'bg-primary text-white' : ''
          } `}
        >
          filters
        </button>
        <div
          className={`flex flex-col gap-2  ${
            showFilterMenu ? 'flex' : 'hidden sm:flex'
          } `}
        >
          <p
            onClick={() => {
              speciality === 'General physician'
                ? navigate('/doctors')
                : navigate('/doctors/General physician');
              showFilterMenu && setShowFilterMenu(false);
            }}
            className={`border border-gray-400 w-48 rounded px-2 text-sm py-2 hover:bg-primary hover:text-white cursor-pointer  transition-all duration-300 ${
              speciality === 'General physician'
                ? 'bg-indigo-100 text-black'
                : ''
            }`}
          >
            General physician
          </p>
          <p
            onClick={() => {
              speciality === 'Gynecologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gynecologist');
              showFilterMenu && setShowFilterMenu(false);
            }}
            className={`border border-gray-400 w-48 rounded px-2 text-sm py-2 hover:bg-primary hover:text-white cursor-pointer  transition-all duration-300 ${
              speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() => {
              speciality === 'Dentist'
                ? navigate('/doctors')
                : navigate('/doctors/Dentist');
              showFilterMenu && setShowFilterMenu(false);
            }}
            className={`border border-gray-400 w-48 rounded px-2 text-sm py-2 hover:bg-primary hover:text-white cursor-pointer  transition-all duration-300 ${
              speciality === 'Dentist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Dentist
          </p>
          <p
            onClick={() => {
              speciality === 'Dermatologist'
                ? navigate('/doctors')
                : navigate('/doctors/Dermatologist');
              showFilterMenu && setShowFilterMenu(false);
            }}
            className={`border border-gray-400 w-48 rounded px-2 text-sm py-2 hover:bg-primary hover:text-white cursor-pointer  transition-all duration-300 ${
              speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() => {
              speciality === 'Pediatricians'
                ? navigate('/doctors')
                : navigate('/doctors/Pediatricians');
              showFilterMenu && setShowFilterMenu(false);
            }}
            className={`border border-gray-400 w-48 rounded px-2 text-sm py-2 hover:bg-primary hover:text-white cursor-pointer  transition-all duration-300 ${
              speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() => {
              speciality === 'Neurologist'
                ? navigate('/doctors')
                : navigate('/doctors/Neurologist');
              showFilterMenu && setShowFilterMenu(false);
            }}
            className={`border border-gray-400 w-48 rounded px-2 text-sm py-2 hover:bg-primary hover:text-white cursor-pointer  transition-all duration-300 ${
              speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            Neurologist
          </p>
          <p
            onClick={() => {
              speciality === 'Gastroenterologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gastroenterologist');
              showFilterMenu && setShowFilterMenu(false);
            }}
            className={`border border-gray-400 w-48 rounded px-2 text-sm py-2 hover:bg-primary hover:text-white cursor-pointer  transition-all duration-300 ${
              speciality === 'Gastroenterologist'
                ? 'bg-indigo-100 text-black'
                : ''
            }`}
          >
            Gastroenterologist
          </p>
        </div>
        <div className='w-full  grid grid-cols-1 row-auto md:grid-cols-3 lg:grid-cols-4 gap-3 p-2 '>
          {filterDoc.length > 0 ? (
            filterDoc.map((person, index) => {
              return (
                <div
                  onClick={() => navigate(`/appointments/${person._id}`)}
                  key={index}
                  className=' w-full sm:max-w-[300px] min-h-[250px] flex flex-col flex-1 gap-3 items-start justify-between  border border-gray-600 hover:scale-95 transition-all duration-300 mx-auto'
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
            })
          ) : (
            <div className='text-center'>No doctor found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
