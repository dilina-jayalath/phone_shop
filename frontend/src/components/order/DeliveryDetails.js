import React, { useEffect, useRef, useState } from 'react';
import StatusRound from './StatusRound';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TiContacts } from 'react-icons/ti';

function DeliveryDetails() {
  const [orders, setOrders] = useState([]);
    const userId = useSelector((state) => state.auth.userId);

  const getAllOrders = () => {
    axios
      .get("http://localhost/api/orders.php")
      .then((res) => {
        console.log(res.data);
        if (res.data.length == null) {
          alert("No Orders available");
          setOrders([]);
        } else {
          setOrders(res.data);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost/api/orders.php/${id}`)
      .then(() => {
        alert("Item deleted successfully!");
        getAllOrders();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
  
      getAllOrders();
 
  }, []);

  return (
    <div className="bg-background p-4 md:p-8 rounded-lg shadow-lg transition-all duration-300 space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-primary">ORDER STATUS</h2>

      {/* Mapping over all orders and displaying details */}
      {orders.length > 0 ? (
        orders
        .filter((item) => item.userId === userId)
        .map((order) => (
          <div key={order.OrderId} className="order-details">
            <p className="text-2xl md:text-3xl font-extrabold text-accent">#Ord{order.orderId}</p>
            <p className="text-base md:text-lg text-muted-foreground dark:text-zinc-600">
              # Status: 
              <span className={`font-semibold  text-green-600 dark:text-green-400`}>
                {order.status}
              </span>
            </p>
            <p className="text-sm md:text-base text-muted-foreground dark:text-zinc-400">
              Your order id is on its way to :     {" "}      
              <span className={`font-semibold  text-red-600 dark:text-red-400`}>
               {order.location}
              </span>
            </p>
      
            <p className="text-sm md:text-base text-muted-foreground ">
              Contact Number :     {" "}      
              <span className={`font-semibold  text-blue-600 dark:blue-red-400`}>
               {order.contact}
              </span>
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3">
              <div className="flex w-full md:w-1/4 mt-[-10px]">
                <span className="ml-5 bg-black dark:bg-black-400 w-full h-1 opacity-50"></span>
              </div>

              {/* Map over the order statuses and set completed state dynamically */}
              {["Order Placed", "In Transit", "Out for Delivery", "Delivered"].map((status, index) => {
                const isCompleted = order.status === status   || index < ["Order Placed", "In Transit", "Out for Delivery", "Delivered"].indexOf(order.status);                                                 
                return (
                  <StatusRound index={index} completed={isCompleted} name={status} />
                );
              })}
            </div>


            <div className="mt-4 md:mt-6">
              <ul className="list-disc pl-5 space-y-2">
                {order.history && order.history.map((item, index) => (
                  <li key={index} className="text-sm md:text-base text-muted-foreground dark:text-zinc-400">
                    {item.status} → {item.description}
                    <span className="block text-xs md:text-sm text-muted-foreground dark:text-zinc-400">
                      {item.timestamp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
                <div className='gap-4 flex flex-col md:flex-row items-center justify-between'>
                <button className="mt-4 md:mt-6 bg-red-900 text-white hover:bg-secondary/80 p-2 md:p-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                onClick={() => handleDelete(order.orderId)}>
              Cancel Order
            </button>

            <button className="mt-4 md:mt-6 bg-slate-500 text-white hover:bg-secondary/80 p-2 md:p-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105">
              Refresh
            </button>
                </div>
          </div>
        ))
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
}

export default DeliveryDetails;
