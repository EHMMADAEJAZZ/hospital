import Header from '../pages/Header';
import Main from '../pages/Main';
import SideBar from '../pages/SideBar';

const AppLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-100 grid grid-cols-[8rem_1fr]  md:grid-cols-[20rem_1fr] grid-rows-[auto_1fr]  mx-auto  '>
      <Header />
      <SideBar />
      <Main />
    </div>
  );
};

export default AppLayout;
