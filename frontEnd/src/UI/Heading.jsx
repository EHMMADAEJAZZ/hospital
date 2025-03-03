const Heading = ({ className, children }) => {
  return (
    <h1
      className={`w-full text-2xl uppercase font-bold   text-gray-600 ${className} `}
    >
      {children}
    </h1>
  );
};

export default Heading;
