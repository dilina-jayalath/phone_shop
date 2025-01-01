import React, { useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import PageTitle from "../../components/repair/PageTitle";

// Sample Data for Repair Items
const repairItems = [
  {
    id: 1,
    deviceImage: "https://via.placeholder.com/50",
    deviceName: "iPhone 12",
    deviceType: "Mobile Phone",
    issue: "Screen Replacement",
    customerName: "John Doe",
    dropOffDate: "2025-01-01",
    status: "In Progress",
    notes: "Customer requested expedited service.",
    file: "https://example.com/invoice1.pdf",
  },
  {
    id: 2,
    deviceImage: "https://via.placeholder.com/50",
    deviceName: "Samsung Galaxy Tab S7",
    deviceType: "Tablet",
    issue: "Battery Issue",
    customerName: "Jane Smith",
    dropOffDate: "2025-01-02",
    status: "Pending",
    notes: "Device not holding charge.",
    file: "https://example.com/invoice2.pdf",
  },
  {
    id: 3,
    deviceImage: "https://via.placeholder.com/50",
    deviceName: "Apple Watch Series 6",
    deviceType: "Smart Watch",
    issue: "Software Update",
    customerName: "Alice Johnson",
    dropOffDate: "2025-01-03",
    status: "Completed",
    notes: "Update to latest OS version.",
    file: "https://example.com/invoice3.pdf",
  },
];

export default function RepairItemsTable() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = (id) => {
    // Implement delete functionality here
    console.log(`Delete item with id: ${id}`);
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      <div className="">
      <PageTitle label="Booked Repairs" btn={true} btnTitle={'Make An Appointment for Repair'} link={'/repair/form'} btnStyle={'bg-green'}/>

        <table className="w-full min-w-full table-auto text-left">
          <thead>
            <tr>
              {["Device", "Issue", "Drop-off Date", "Action"].map((head) => (
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
            {repairItems.map((item, index) => {
              const isOpen = openIndex === index;
              const rowClasses = "p-4 border-b border-gray-200";

              return (
                <React.Fragment key={item.id}>
                  <tr>
                    {/* Device Profile */}
                    <td className={rowClasses}>
                      <div className="flex items-center">
                        <img
                          src={item.deviceImage}
                          alt={item.deviceName}
                          className="w-12 h-12 rounded-xl bg-blue-100 mr-4"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {item.deviceName}
                        </span>
                      </div>
                    </td>

                    {/* Issue */}
                    <td className={rowClasses}>
                      <span className="text-sm font-medium text-gray-800">
                        {item.issue}
                      </span>
                    </td>

                    {/* Drop-off Date */}
                    <td className={rowClasses}>
                      <span className="text-xs font-medium text-gray-600">
                        {new Date(item.dropOffDate).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className={rowClasses}>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleToggleAccordion(index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {isOpen ? "See Less" : <HiOutlineInformationCircle size={20} />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Additional Info */}
                  {isOpen && (
                    <tr>
                      <td colSpan={4} className="p-4 bg-gray-100">
                        <div className="grid grid-cols-8 gap-8">
                          <div className="col-span-3">
                            <strong className="font-bold text-black">
                              Customer Name:
                            </strong>
                            <p className="text-sm text-gray-700">
                              {item.customerName}
                            </p>
                          </div>

                          <div className="col-span-3">
                            <strong className="font-bold text-black">
                              Status:
                            </strong>
                            <p className="text-sm text-gray-700">
                              {item.status}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <strong className="font-bold text-black">
                              Notes:
                            </strong>
                            <p className="text-sm text-gray-700">
                              {item.notes}
                            </p>
                          </div>
                          <div>
                            <button
                              className="bg-red-500 text-white rounded-md px-4 py-2 text-sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete Record
                            </button>
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

      {/* Mobile View */}
      {/* Implement mobile view if necessary */}
    </div>
  );
}
