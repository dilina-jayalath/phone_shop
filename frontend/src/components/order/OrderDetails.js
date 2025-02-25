import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function OrderDetails() {
  const userId = useSelector((state) => state.auth.userId);
  const products = useSelector((state) => state.orebi.products) || [];

  const handleOrderSubmit = async () => {
    const orderDetails = products.map((item) => ({
      
      name: item.name,
      quantity: item.quantity,
      color: item.colors,
    }));

    const orderData = {
      userId,
      details: orderDetails,
    };

    try {
      const response = await axios.post('http://localhost/api/orders', orderData);
      console.log('Order submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className='bg-background'>
      <h2 className="text-2xl font-semibold mb-4">Package Items</h2>
      <div className="space-y-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              className="w-12 h-12 object-cover rounded-lg"
              src={`http://localhost/api/products/${item.image}`}
              alt={item.name}
            />
            <div className="ml-4">
              <h3 className="text-m font-semibold">{item.quantity} x {item.name}</h3>
              <p className="text-gray-600">{item.colors}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleOrderSubmit} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Submit Order
      </button>
    </div>
  );
}

export default OrderDetails;
