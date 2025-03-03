import React from 'react';

const OverLay = ({ children }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-screen backdrop-blur-sm z-10 transition-all duration-150'>
      {children}
    </div>
  );
};

export default OverLay;
