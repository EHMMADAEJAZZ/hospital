const Text = ({ className, children }) => {
  return (
    <p className={`${className} w-full text-sm text-center`}>{children}</p>
  );
};

export default Text;
