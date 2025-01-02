import React, { useState } from "react";

// Sample Data for Orders
const initialOrders = [
  {
    orderId: "ORD001",
    customerName: "John Doe",
    orderDate: "2025-01-01",
    status: "Order Placed",
    details: "2x iPhone 12, 1x MacBook Pro",
  },
  {
    orderId: "ORD002",
    customerName: "Jane Smith",
    orderDate: "2025-01-02",
    status: "In Transit",
    details: "1x Samsung Galaxy Tab S7",
  },
  {
    orderId: "ORD003",
    customerName: "Alice Johnson",
    orderDate: "2025-01-03",
    status: "Delivered",
    details: "1x Apple Watch Series 6",
  },
];

// Order statuses
const statuses = ["Order Placed", "In Transit", "Out for Delivery", "Delivered"];

export default function OrdersTable() {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg m-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto text-left">
          <thead>
            <tr>
              {["Order ID", "Customer Name", "Order Date", "Status", "Details", "Update Status"].map((head) => (
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
                  <span className="text-sm font-medium text-gray-800">
                    {order.orderId}
                  </span>
                </td>

                {/* Customer Name */}
                <td className="p-4 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-800">
                    {order.customerName}
                  </span>
                </td>

                {/* Order Date */}
                <td className="p-4 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </td>

                {/* Status */}
                <td className="p-4 border-b border-gray-200">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    className="text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md p-2"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Details */}
                <td className="p-4 border-b border-gray-200">
                  <span className="text-sm text-gray-700">
                    {order.details}
                  </span>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <button className="text-sm font-medium text-white bg-green-300 rounded-md hover:bg-green-500 p-2">
                    <span className="text-sm font-medium text-black">
                      Update
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
