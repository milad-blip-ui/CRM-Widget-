// ReceivingForm.js
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReceivingForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      receivingId: "",
      receivingDate: new Date(),
      purchaseOrder: "",
      supplier: "",
      items: [],
    }
  );

  // Keep all the existing state management and handlers from previous implementation
  // Add this new handleSubmit function:
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      receivingDate: formData.receivingDate.toISOString(),
    });
  };

  // In ReceivingForm.js
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        receivingDate: new Date(initialData?.receivingDate),
      });
    }
  }, [initialData]);

  // Rest of the component remains the same as previous implementation
  // Make sure to use formData state and update handlers
  // ...

  const initialItemState = {
    material: "",
    qtyOrdered: 0,
    qtyReceived: 0,
    source: "",
    receivedSame: false,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, receivingDate: date });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...formData.items];
    const { name, value, type, checked } = e.target;

    newItems[index][name] = type === "checkbox" ? checked : value;

    if (name === "receivedSame" && checked) {
      newItems[index].qtyReceived = newItems[index].qtyOrdered;
    }

    setFormData({ ...formData, items: newItems });
  };

  const addNewRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ...initialItemState }],
    });
  };

  const handleDeleteRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

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
                          name="receivingId"
                          value={formData.receivingId}
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
              selected={formData.receivingDate}
              onChange={handleDateChange}
              className="w-[130%] p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Purchase Order
            </label>
            <select
                          name="purchaseOrder"
                          value={formData.purchaseOrder}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            >
              <option value="">Select Purchase Order</option>
              <option value="test">test</option>
              {/* Add dynamic options from Zoho API */}
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Supplier</label>
            <select
                          name="supplier"
                          value={formData.supplier}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            >
              <option value="">Select Supplier</option>
              <option value="test">test</option>
              {/* Add dynamic options from Zoho API */}
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
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <select
                        name="material"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={item.material}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      >
                        <option value="">Select Material</option>
                        <option value="test">test</option>
                        {/* Add dynamic options from Zoho API */}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="qtyOrdered"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={item.qtyOrdered}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="qtyReceived"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        value={item.qtyReceived}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                        disabled={item.receivedSame}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        name="source"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        value={item.source}
                        onChange={(e) => handleItemChange(index, e)}
                        required
                      >
                        <option value="">Select Source</option>
                        <option value="test">test</option>
                        {/* Add dynamic options from Zoho API */}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        name="receivedSame"
                        className="h-4 w-4"
                        checked={item.receivedSame}
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
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        >
          Create Receiving
        </button>
      </form>
    </div>
  );
}
