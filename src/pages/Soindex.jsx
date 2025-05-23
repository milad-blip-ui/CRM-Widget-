// ShippingList.js
import { Link, useNavigate } from "react-router-dom";
import { useShippings } from "../context/ShippingContext";
import { useEffect } from "react";
import initializeApp from "../services/initializeApp";

export default function Soindex() {
  const { shippings, deleteShipping, addShipping } = useShippings();
  const navigate = useNavigate();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this shipping?")) {
      deleteShipping(id);
    }
  };

  const fetchData = async () => {
    try {
      const data = await initializeApp("All_Shippings");
      console.log("Receving Data fetched successfully:", data);
      addShipping(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"></h1>
        {/* <Link
          to="/create-shipping"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New
        </Link> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Shipping ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Ship Via</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shippings.map((item,index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/so-details/${item.ID}`)}
              >
                <td className="px-4 py-2">{item.Shipping_ID}</td>
                <td className="px-4 py-2">
                  {new Date(item.Shipping_Date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{item.Ship_via}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/so-edit/${item.ID}`);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.ID)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
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

// import React from 'react'

// const soindex = () => {
//   return (
//     <div>soindex</div>
//   )
// }

// export default soindex
