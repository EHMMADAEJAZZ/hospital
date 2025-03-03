import Header from './Header';
import Main from './Main';
import SideBar from './SideBar';

const AppLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-100 grid grid-cols-[4rem_1fr]   sm:grid-cols-[10rem_1fr]  md:grid-cols-[15rem_1fr] grid-rows-[auto_1fr]  mx-auto  '>
      <Header />
      <SideBar />
      <Main />
    </div>
  );
};

export default AppLayout;
