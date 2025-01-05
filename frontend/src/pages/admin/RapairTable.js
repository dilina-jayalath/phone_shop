import React, { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import PageTitle from "../../components/repair/PageTitle";
import axios from "axios";

export default function RepairItemsTable() {
  const [repairs, setRepairs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // Fetch all repairs
  const getAllRepairs = () => {
    axios
      .get("http://localhost/api/repairs.php")
      .then((res) => {
        if (!res.data.length) {
          alert("No repairs available");
          setRepairs([]);
        } else {
          setRepairs(res.data);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    if (repairs.length === 0) getAllRepairs();
  }, []);

  // Toggle accordion
  const handleToggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Handle status update
  const handleUpdateStatus = (id, newStatus) => {
    axios
      .put(`http://localhost/api/repairs.php`, { id :id , status: newStatus })
      .then(() => {
        alert("Status updated successfully!");
        getAllRepairs();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // Handle delete
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost/api/repairs.php/${id}`)
      .then(() => {
        alert("Item deleted successfully!");
        getAllRepairs();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg my-8 mr-8">

      <table className="w-full min-w-full table-auto text-left">
        <thead>
          <tr>
            {["Device", "Issue", "Contact Number","Drop-off Date", "Status", "Action"].map((head) => (
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
          {repairs.map((item, index) => {
            const isOpen = openIndex === index;
            const rowClasses = "p-4 border-b border-gray-200";

            return (
              <React.Fragment key={item.id}>
                <tr>
                  <td className={rowClasses}>
                    <div className="flex items-center">
                      <span className="pl-5 text-sm font-medium text-gray-800">
                        {item.deviceName}
                      </span>
                    </div>
                  </td>

                  <td className={rowClasses}>
                    <span className="text-sm font-medium text-gray-800">
                      {item.issue}
                    </span>
                  </td>
                  <td className={rowClasses}>
                    <span className="text-sm font-medium text-gray-800">
                      {item.contact}
                    </span>
                  </td>

                  <td className={rowClasses}>
                    <span className="text-xs font-medium text-gray-600">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className={rowClasses}>
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className="border border-gray-300 rounded-md p-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className={rowClasses}>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleToggleAccordion(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {isOpen ? "See Less" : <HiOutlineInformationCircle size={20} />}
                      </button>
                      <button
                        className="bg-red-500 text-white rounded-md px-4 py-2 text-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {isOpen && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-gray-100">
                      <div className="grid grid-cols-8 gap-8">
                        <div className="col-span-3">
                          <strong className="font-bold text-black">Customer Email:</strong>
                          <p className="text-sm text-gray-700">{item.userId}</p>
                        </div>
                        <div className="col-span-3">
                          <strong className="font-bold text-black">Notes:</strong>
                          <p className="text-sm text-gray-700">{item.notes}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
