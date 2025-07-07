
const TopProducts = () => {
  const products = [
    {
      id: "01",
      name: "Home Decor Range",
      popularity: 45,
      sales: "45%",
      color: "bg-blue-500",
    },
    {
      id: "02", 
      name: "Disney Princess Pink Bag Kit",
      popularity: 29,
      sales: "29%",
      color: "bg-green-500",
    },
    {
      id: "03",
      name: "Bathroom Essentials", 
      popularity: 18,
      sales: "18%",
      color: "bg-purple-500",
    },
    {
      id: "04",
      name: "Apple Smartwatches",
      popularity: 25,
      sales: "25%", 
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 font-medium border-b pb-2">
          <span>#</span>
          <span>Name</span>
          <span>Popularity</span>
          <span>Sales</span>
        </div>
        
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-4 gap-4 items-center py-2">
            <span className="text-sm font-medium text-gray-900">{product.id}</span>
            <span className="text-sm text-gray-700 truncate">{product.name}</span>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`${product.color} h-2 rounded-full`}
                  style={{ width: `${product.popularity}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900">{product.sales}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
