import { Outlet } from 'react-router-dom';
import { Bounce,  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
 
  return (
    <div className='mx-4 sm:mx-[10%] '>
      <Navbar />
      <Outlet />
      <Footer />
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
    </div>
  );
}

export default App;
