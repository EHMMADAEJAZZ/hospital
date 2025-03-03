
const Select = ({ options, label, name, id, onChange, className,disabled=false,required=true }) => {
  return (
    <div className={`flex flex-col gap-1 my-1 ${className} `}>
      {label && (
        <label
          htmlFor={id}
          className=' text-sm tracking-[2px] capitalize leading-6 font-medium text-gray-500'
        >
          {label}
        </label>
      )}
      <select
        id={id}
        onChange={onChange}
        name={name}
        required={required}
        
         className='w-full text-gray-700 text-sm rounded-lg px-2  py-3 bg-inherit border border-gray-200 outline-none placeholder:text-inherit placeholder:text-gray-400 placeholder:tracking-widest placeholder:capitalize placeholder:text-xs focus:outline-none 
        focus:border-gray-500 bg-gray-400'
      >
        {options.map((option) => (
          <option key={option.value}  disabled={disabled} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
