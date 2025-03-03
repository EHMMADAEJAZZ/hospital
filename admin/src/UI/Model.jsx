import React from 'react';
import OverLay from './OverLay';

const Model = ({ children, OnCloseModel }) => {
  return (
    <OverLay>
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg shadow-lg shadow-gray-700 py-12 px-16 transition-all duration-150'>
        <button
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-400 transition-all duration-150'
          onClick={OnCloseModel}
        >
          &times;
        </button>
        {children}
      </div>
    </OverLay>
  );
};

export default Model;
