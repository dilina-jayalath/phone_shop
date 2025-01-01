import React from 'react';
import { useSelector } from 'react-redux';

function OrderDetails() {
  const products = useSelector((state) => state.orebi.products);

  return (
    <div className='bg-background'>
      <h2 className="text-2xl font-semibold mb-4 ">Package Items</h2>
      <div className="space-y-4 ">
        {products.map((item) => (
          <div
            key={item._id}
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              className="w-12 h-12 object-cover rounded-lg"
              src={item.image}
              alt={item.name}
            />
            <div className="ml-4">
              <h3 className="text-m font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.colors}</p>
              {/* <p className="text-gray-600">Available colors: {item.colors.join(', ')}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetails;
