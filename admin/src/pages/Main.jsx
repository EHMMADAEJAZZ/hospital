import { Outlet } from 'react-router-dom';

const Main = () => {
  return (
    <div className='px-2 min-h-[90dvh] bg-gray-100 flex flex-col overflow-hidden overflow-y-auto'>
      <Outlet />
    </div>
  );
};

export default Main;
