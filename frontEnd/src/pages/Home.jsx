import Banner from '../components/Banner';

import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import Spinner from '../components/Spinner';
import TopDoctors from '../components/TopDoctors';
import { UseApp } from '../context/AppContext';

const Home = () => {
 const {isLoading}= UseApp();
 if(isLoading){
  return <Spinner/>
 }
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;
