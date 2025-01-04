import React, { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import PageTitle from "../../components/repair/PageTitle";
import axios from "axios";
import { useSelector } from "react-redux";


export default function RepairItemsTable() {
  const userId = useSelector((state) => state.auth.userId);


  const [repairs, setRepairs] = useState([]);  // Change initial state to an empty array
  const getAllRepairs = () => {
    axios
      .get(
        "http://localhost/api/repairs.php"
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.length == null){
          alert("No repairs available");
          setRepairs([]);
        }else{
          setRepairs(res.data);
        }

      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    if (repairs.length === 0){
      getAllRepairs();
    }
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = (id) => {
    axios
      .delete(
        `http://localhost/api/repairs.php/${id}`
      )
      .then(() => {
        alert("Item deleted successfully!");
        getAllRepairs();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg my-8">
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
            {repairs
            .filter((item) => item.userId === userId)
            .map((item, index) => {
              const isOpen = openIndex === index;
              const rowClasses = "p-4 border-b border-gray-200";

              return (
                <React.Fragment key={item.id}>
                  <tr>
                    {/* Device Profile */}
                    <td className={rowClasses}>
                      <div className="flex items-center">
                        {/* <img
                          src={item.deviceImage}
                          alt={item.deviceName}
                          className="w-12 h-12 rounded-xl bg-blue-100 mr-4"
                        /> */}
                        <span className="pl-5 text-sm font-medium text-gray-800">
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
                        {new Date(item.created_at).toLocaleDateString()}
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
                              Customer Email:
                            </strong>
                            <p className="text-sm text-gray-700">
                              {item.userId}
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
