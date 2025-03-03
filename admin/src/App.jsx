import { Bounce,  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import Header from './pages/Header';
import Main from './pages/Main';
import SideBar from './pages/SideBar';
import AppLayout from './UI/AppLayout';

const App = () => {
  return (
    <>
    {/* // <AppLayout>
    //   <Header />
    //   <SideBar />
    //   <Main />
    // </AppLayout> */}
    <Outlet />
     <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Bounce}
        className='max-w-lg'
      />
    </>
  );
};

export default App;
