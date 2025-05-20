// ShippingForm.js
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialItemState = {
  item: "",
  description: "",
  qty: 0,
};

export default function ShippingForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      shippingId: "",
      shippingDate: new Date(),
      shippingAccount: "",
      salesOrder: "",
      shipVia: "Fedex",
      shipTo: "",
      accountNumber: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      items: [],
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...formData.items];
    newItems[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ...initialItemState }],
    });
  };

  const deleteItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Inside the ShippingForm component
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        shippingDate: new Date(initialData?.shippingDate),
      });
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="w-[50%] grid grid-cols-2 gap-4">
        {/* Main Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Shipping ID</label>
          <input
            type="text"
            name="shippingId"
            className="w-full p-2 border rounded"
            value={formData.shippingId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Shipping Date
          </label>
          <DatePicker
            selected={formData.shippingDate}
            onChange={(date) =>
              setFormData({ ...formData, shippingDate: date })
            }
            className="w-[130%] p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Shipping Account
          </label>
          <select
            name="shippingAccount"
            className="w-full p-2 border rounded"
            value={formData.shippingAccount}
            onChange={handleChange}
            required
          >
            <option value="">Select Account</option>
            <option value="test">test</option>
            {/* Add dynamic options */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sales Order</label>
          <select
            name="salesOrder"
            className="w-full p-2 border rounded"
            value={formData.salesOrder}
            onChange={handleChange}
            required
          >
            <option value="">Select Sales Order</option>
            <option value="test">test</option>

            {/* Add dynamic options */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ship To</label>
          <input
            type="text"
            name="shipTo"
            className="w-full p-2 border rounded"
            value={formData.shipTo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            className="w-full p-2 border rounded"
            value={formData.accountNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ship Via</label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="shipVia"
                value="Fedex"
                checked={formData.shipVia === "Fedex"}
                onChange={handleChange}
                className="mr-2"
              />
              FedEx
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="shipVia"
                value="UPS"
                checked={formData.shipVia === "UPS"}
                onChange={handleChange}
                className="mr-2"
              />
              UPS
            </label>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="w-[50%] border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              name="line1"
              className="w-full p-2 border rounded"
              value={formData.address.line1}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              name="line2"
              className="w-full p-2 border rounded"
              value={formData.address.line2}
              onChange={handleAddressChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              City/District
            </label>
            <input
              type="text"
              name="city"
              className="w-full p-2 border rounded"
              value={formData.address.city}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              State/Province
            </label>
            <input
              type="text"
              name="state"
              className="w-full p-2 border rounded"
              value={formData.address.state}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              className="w-full p-2 border rounded"
              value={formData.address.postalCode}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              name="country"
              className="w-full p-2 border rounded"
              value={formData.address.country}
              onChange={handleAddressChange}
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              {/* Add more countries */}
            </select>
          </div>
        </div>
      </div>

      {/* Items Subform */}
      <div className="border p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Shipping Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="item"
                      className="w-full p-2 border rounded"
                      value={item.item}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="description"
                      className="w-full p-2 border rounded"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      name="qty"
                      className="w-full p-2 border rounded"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => deleteItem(index)}
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

      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Submit Shipping
      </button>
    </form>
  );
}
