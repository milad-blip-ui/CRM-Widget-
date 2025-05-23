// ShippingForm.js
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import initializeApp from "../../services/initializeApp";

const initialItemState = {
  Item: "",
  Description: "",
  Qty: 0,
};

export default function ShippingForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      Shipping_ID: new Date().getFullYear() + "/" + (new Date().getMonth() + 1),
      Shipping_Date: new Date(),
      Shippings_Account: "",
      Salesorder: "",
      Ship_via: "Fedex",
      Ship_To: "",
      Account_Number: "",
      Shipping_Address: {
        address_line_1: "",
        address_line_2: "",
        district_city: "",
        state_province: "",
        postal_code: "",
        country: "",
      },
      SubForm: [],
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      Shipping_Address: {
        ...formData.Shipping_Address,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...formData.SubForm];
    newItems[index][e.target.name] = e.target.value;
    setFormData({ ...formData, SubForm: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      SubForm: [...formData.SubForm, { ...initialItemState }],
    });
  };

  const deleteItem = (index) => {
    const newItems = formData.SubForm.filter((_, i) => i !== index);
    setFormData({ ...formData, SubForm: newItems });
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
        // shippingDate: new Date(initialData?.shippingDate),
      });
    }
  }, [initialData]);
    
  const [salesOrders, setSalesOrders] = useState([]);
  const fetchData = async () => {
    try {
      const data = await initializeApp("All_Salesorder_List_view");
      console.log("SO Data fetched successfully:", data);
      setSalesOrders(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="w-[50%] grid grid-cols-2 gap-4">
        {/* Main Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Shipping ID</label>
          <input
            type="text"
            name="Shipping_ID"
            className="w-full p-2 border rounded"
            value={formData.Shipping_ID}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Shipping Date
          </label>
          <DatePicker
            selected={formData.Shipping_Date}
            onChange={(date) =>
              setFormData({ ...formData, Shipping_Date: date })
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
            name="Shippings_Account"
            className="w-full p-2 border rounded"
            value={formData.Shippings_Account}
            onChange={handleChange}
            required
          >
            <option value="">Select Account</option>
            <option value="1Source">1Source</option>
            <option value="Customer">Customer</option>
            {/* Add dynamic options */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sales Order</label>
          <select
            name="Salesorder"
            className="w-full p-2 border rounded"
            value={formData.Salesorder.ID}
            onChange={handleChange}
            required
          >
            <option value="">Select Sales Order</option>
            {/* <option value="4599841000004903095">RO-2504023</option> */}
            {/* Add dynamic options */}
            {salesOrders.map((order) => (
              <option key={order.ID} value={order.ID}>
                {order.Salesorder}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ship To</label>
          <input
            type="text"
            name="Ship_To"
            className="w-full p-2 border rounded"
            value={formData.Ship_To}
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
            name="Account_Number"
            className="w-full p-2 border rounded"
            value={formData.Account_Number}
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
                name="Ship_via"
                value="Fedex"
                checked={formData.Ship_via === "Fedex"}
                onChange={handleChange}
                className="mr-2"
              />
              FedEx
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="Ship_via"
                value="UPS"
                checked={formData.Ship_via === "UPS"}
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
              name="address_line_1"
              className="w-full p-2 border rounded"
              value={formData.Shipping_Address.address_line_1}
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
              name="address_line_2"
              className="w-full p-2 border rounded"
              value={formData.Shipping_Address.address_line_2}
              onChange={handleAddressChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              City/District
            </label>
            <input
              type="text"
              name="district_city"
              className="w-full p-2 border rounded"
              value={formData.Shipping_Address.district_city}
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
              name="state_province"
              className="w-full p-2 border rounded"
              value={formData.Shipping_Address.state_province}
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
              name="postal_code"
              className="w-full p-2 border rounded"
              value={formData.Shipping_Address.postal_code}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              name="country"
              className="w-full p-2 border rounded"
              value={formData.Shipping_Address.country}
              onChange={handleAddressChange}
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="India">India</option>
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
              {formData.SubForm.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="Item"
                      className="w-full p-2 border rounded"
                      value={item.Item}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      name="Description"
                      className="w-full p-2 border rounded"
                      value={item.Description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      name="Qty"
                      className="w-full p-2 border rounded"
                      value={item.Qty}
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
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Submit Shipping
      </button>
    </form>
  );
}
