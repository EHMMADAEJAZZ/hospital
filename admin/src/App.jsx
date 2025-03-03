import { Bounce,  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Spinner from './components/Spinner';


const App = () => {
 const {loading}= useApp();
 if (loading) {
   return <Spinner/>;
 }
  return (
    <>

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
