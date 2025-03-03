import React from 'react';

const TextArea = ({
  label,
  name,
  value,
  id,
  rows = 4,
  cols = 40,
  disabled = false,
  required = true,
  onChange = () => {},
  className,
}) => {
  return (
    <div className={`flex flex-col gap-1 my-1 ${className} `}>
      {label && (
        <label
          htmlFor={id}
          className='text-sm capitalize leading-6 font-medium tracking-[2px] text-gray-500'
        >
          {label}
        </label>
      )}
      <textarea
        name={name}
        id={id}
        required={required}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder='about'
        rows={rows}
        cols={cols}
        className={`w-full text-gray-700 text-sm rounded-lg px-2 py-3 bg-inherit border border-gray-200 outline-none placeholder:text-inherit placeholder:text-gray-400 placeholder:tracking-widest placeholder:capitalize placeholder:text-xs focus:outline-none 
        focus:border-gray-500 bg-gray-400 resize-none ${className}`}
      />
    </div>
  );
};

export default TextArea;
