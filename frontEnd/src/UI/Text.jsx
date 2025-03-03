const Text = ({ className, children }) => {
  return (
    <p className={` w-full text-sm text-center ${className}`}>{children}</p>
  );
};

export default Text;
