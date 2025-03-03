const Input = ({
  label,
  type = 'text',
  name,
  placeholder = '',
  value,
  id,
  disabled = false,
  required = false,
  readOnly=false,
  onChange = () => {},
  className,
}) => {
  return (
    <div className={`w-full flex flex-col gap-1 my-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className=' text-sm capitalize leading-6 font-medium text-gray-500'
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={id}
        required={required}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
        className='w-full text-gray-700 text-sm rounded-lg p-2 bg-inherit border border-gray-200 outline-none placeholder:text-inherit  focus:outline-none 
        focus:border-gray-500 bg-gray-400 placeholder:text-neutral-400'
      />
    </div>
  );
};

export default Input;
