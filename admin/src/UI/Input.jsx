const Input = ({
  label,
  type = 'text',
  name,
  placeholder = 'placeholder',
  value,
  id,
  disabled = false,
  required = false,
  readOnly = false,
  autoComplete='on',
  onChange = () => {},
  className,
}) => {
  return (
    <div className={`w-full flex flex-col gap-1 my-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className='tracking-[2px] text-sm capitalize leading-6 font-medium text-gray-500'
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
        autoComplete={autoComplete}
        onChange={onChange}
        className='w-full text-gray-700 text-sm rounded-lg px-2 py-3 bg-inherit border border-gray-200 outline-none placeholder:text-inherit placeholder:text-gray-400 placeholder:tracking-widest placeholder:capitalize placeholder:text-xs focus:outline-none 
        focus:border-gray-500 bg-gray-400'
      />
    </div>
  );
};

export default Input;
