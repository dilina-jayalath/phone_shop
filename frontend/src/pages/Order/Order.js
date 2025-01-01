import React from 'react';
import OrderDetails from '../../components/order/OrderDetails';
import DeliveryDetails from '../../components/order/DeliveryDetails';

function Order() {
  return (
    <div className="p-4 md:p-8 flex flex-col md:flex-row gap-4 justify-center">
      <div className="w-full md:w-auto">
        <OrderDetails />
      </div>
      <div className="w-full md:w-auto">
        <DeliveryDetails />
      </div>
    </div>
  );
}

export default Order;
