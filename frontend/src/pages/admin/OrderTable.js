import axios from "axios";
import React, { useEffect, useState } from "react";

const statuses = [];

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

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

  // Handle status update
  const handleUpdateStatus = (id, newStatus) => {
    console.log(id, newStatus);
    axios
      .put(`http://localhost/api/orders.php`, { id :id , status: newStatus })
      .then(() => {
        alert("Status updated successfully!");
        getAllOrders();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    if (orders.length === 0) {
      getAllOrders();
    }
  }, []);

  return (
    <div className="w-full bg-white shadow-md rounded-lg m-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto text-left">
          <thead>
            <tr>
              {["Order ID", "Customer Email", "Order Date", "Status", "Details"].map((head) => (
                <th
                  key={head}
                  className="border-b border-gray-200 bg-gray-100 p-4 text-sm font-medium text-gray-700"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                {/* Order ID */}
                <td className="p-4 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-800">{order.orderId}</span>
                </td>

                {/* Customer Email */}
                <td className="p-4 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-800">{order.userId}</span>
                </td>

                {/* Order Date */}
                <td className="p-4 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-600">{order.created_at}</span>
                </td>

                {/* Status */}
                <td className="p-4 border-b border-gray-200">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                    >
                      <option value="Order Placed" >Order Placed</option>
                      <option value="In Transit">In Transit</option>
                      <option value= "Out for Delivery"> Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>

                {/* Details */}
                <td className="p-4 border-b border-gray-200">
                  <span className="text-sm text-gray-700">
                    {(() => {
                      try {
                        // Try to parse as JSON
                        const details = JSON.parse(order.details);
                        if (Array.isArray(details)) {
                          return details.map((item) => `${item.quantity}x ${item.name}`).join(", ");
                        } else {
                          return String(order.details);
                        }
                      } catch (error) {
                        // If JSON parsing fails, display the raw details as string
                        console.warn('Failed to parse order details as JSON:', order.details, error);
                        return String(order.details);
                      }
                    })()}
                  </span>
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
