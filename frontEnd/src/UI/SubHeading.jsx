const SubHeading = ({ className, children }) => {
  return (
    <p className={` w-full text-3xl  font-medium  text-gray-700 ${className}`}>
      {children}
    </p>
  );
};

export default SubHeading;
