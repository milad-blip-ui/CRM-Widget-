// ReceivingForm.js
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import initializeApp from "../../services/initializeApp";

export default function ReceivingForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      Receiving_ID:
        new Date().getFullYear() + "/" + (new Date().getMonth() + 1),
      Receiving_Date: new Date(),
      Purchase_Order: "",
      Supplier: "",
      Receiving_Items: [],
    }
  );

  // Keep all the existing state management and handlers from previous implementation
  // Add this new handleSubmit function:
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      //   receivingDate: formData.receivingDate.toISOString(),
    });
  };

  // In ReceivingForm.js
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // receivingDate: new Date(initialData?.receivingDate),
      });
    }
  }, [initialData]);

  // Rest of the component remains the same as previous implementation
  // Make sure to use formData state and update handlers
  // ...

  const initialItemState = {
    Material: "",
    Qty: 0,
    Qty_Received: 0,
    Source: "",
    Received_same_as_Ordered: false,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, Receiving_Date: date });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...formData.Receiving_Items];
    const { name, value, type, checked } = e.target;
    console.log(name, value, type, checked);

    newItems[index][name] = type === "checkbox" ? checked : value;

    if (name === "Received_same_as_Ordered" && checked) {
      newItems[index].Qty_Received = newItems[index].Qty;
    }
    console.log(newItems);

    setFormData({ ...formData, Receiving_Items: newItems });
  };

  const addNewRow = () => {
    setFormData({
      ...formData,
      Receiving_Items: [...formData.Receiving_Items, { ...initialItemState }],
    });
  };

  const handleDeleteRow = (index) => {
    const newItems = formData.Receiving_Items.filter((_, i) => i !== index);
    setFormData({ ...formData, Receiving_Items: newItems });
  };

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const fetchData = async () => {
    try {
      const data = await initializeApp("All_Purchase_Orders");
      console.log("PO Data fetched successfully:", data);
      setPurchaseOrders(data);

      const data2 = await initializeApp("All_Suppliers");
      console.log("suppliers Data fetched successfully:", data2);
      setSuppliers(data2);

      const data3 = await initializeApp("All_Material_Report");
      console.log("Materials Data fetched successfully:", data3);
      setMaterials(data3);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" mx-auto p-6  rounded-md-lg">
      {/* <h2 className="text-2xl font-bold mb-6">Create Receiving</h2> */}
      <form onSubmit={handleSubmit}>
        {/* Main Form Fields */}
        <div className="grid grid-cols-2 gap-4 mb-8 w-[50%]">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Receiving ID
            </label>
            <input
              type="text"
              name="Receiving_ID"
              value={formData.Receiving_ID}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Receiving Date
            </label>
            <DatePicker
              selected={formData.Receiving_Date}
              onChange={handleDateChange}
              className="w-[130%] p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              dateFormat="dd-MM-yyyy"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Purchase Order
            </label>
            <select
              name="Purchase_Order"
              value={formData.Purchase_Order.ID}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            >
              <option value="">Select Purchase Order</option>
              {/* <option value="4599841000005628009">1005</option> */}
              {/* Add dynamic options from Zoho API */}
              {purchaseOrders.map((order) => (
                <option key={order.ID} value={order.ID}>
                  {order.PO_ID}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Supplier</label>
            <select
              name="Supplier"
              value={formData.Supplier.ID}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            >
              <option value="">Select Supplier</option>
              {/* <option value="4599841000005545007">Cousin</option> */}
              {/* Add dynamic options from Zoho API */}
              {suppliers.map((order) => (
                <option key={order.ID} value={order.ID}>
                  {order.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Receiving Items Subform */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Receiving Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Material</th>
                  <th className="px-4 py-2 text-left">Qty Ordered</th>
                  <th className="px-4 py-2 text-left">Qty Received</th>
                  <th className="px-4 py-2 text-left">Source</th>
                  <th className="px-4 py-2 text-left">Received Same</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.Receiving_Items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <select
                        name="Material"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={item.Material.ID}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      >
                        <option value="">Select Material</option>
                        <option value="4599841000004950247">
                          {" "}
                          Acrylic Black Extruded 1/2"x48"x96" 2025 - opaque
                          ACRblGL202512
                        </option>
                        {/* Add dynamic options from Zoho API */}
                        {materials.map((order) => (
                          <option key={order.ID} value={order.ID}>
                            {order.Item_Name.Name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="Qty"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={item.Qty}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="Qty_Received"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        value={item.Qty_Received}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                        disabled={item.Received_same_as_Ordered}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        name="Source"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={item.Source}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      >
                        <option value="">Select Source</option>
                        <option value="BOM">BOM</option>
                        <option value="Stocking">Stocking</option>
                        <option value="Manual">Manual</option>
                        {/* Add dynamic options from Zoho API */}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        name="Received_same_as_Ordered"
                        className="h-4 w-4"
                        checked={item.Received_same_as_Ordered}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(index)}
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
          <button
            type="button"
            onClick={addNewRow}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-3"
          >
            Add Item
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        >
          Create Receiving
        </button>
      </form>
    </div>
  );
}
