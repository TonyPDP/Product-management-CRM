const SalesMapping = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Sales Mapping by Country
      </h3>

      <div className="relative h-48 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute top-8 left-8 w-16 h-12 bg-orange-400 rounded-lg opacity-80"></div>
          <div className="absolute bottom-12 left-12 w-8 h-16 bg-red-400 rounded-lg opacity-80"></div>
          <div className="absolute top-6 left-1/2 w-12 h-8 bg-green-400 rounded-lg opacity-80"></div>
          <div className="absolute top-4 right-16 w-20 h-16 bg-blue-400 rounded-lg opacity-80"></div>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-10 h-16 bg-purple-400 rounded-lg opacity-80"></div>
          <div className="absolute bottom-8 right-12 w-8 h-6 bg-yellow-400 rounded-lg opacity-80"></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Interactive sales data by region
        </p>
      </div>
    </div>
  );
};

export default SalesMapping;
