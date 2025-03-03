const Button = ({
  label = 'submit',
  onClick,
  type = 'submit',
  disabled = false,
  className,
}) => {
  return (
    <button
      className={`
    
      w-full rounded-full py-2 px-3 cursor-pointer border-none outline-none bg-blue-500 text-sm text-center capitalize ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
