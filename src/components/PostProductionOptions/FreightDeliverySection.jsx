import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDropdown from "../../components/shared/CustomDropdown";

const FreightDeliverySection = ({
    formData,
    handlePalletSizeChange,
    handleFreightPickupChange,
    handleFreightPickupDateChange,
}) => {
    const freightPickupOptions = [
        { value: "1Source", label: "1Source" },
        { value: "Customer", label: "Customer" },
      ];
  return (
    <div className="mt-6">
    <h2 className="text-gray-700 font-roboto font-semibold mb-4">Freight Delivery Details</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      {/* Pallet Size Needed */}
      <div>
        <label className="input-label">Pallet Size Needed (Provide Estimate)</label>
        <input
          type="text"
          className="input-box w-full"
          value={formData.Pallet_size_needed_provide_estimate}
          onChange={handlePalletSizeChange}
          placeholder="Enter pallet size estimate"
        />
      </div>

      {/* Who Will Arrange Freight Pickup? */}
      <div>
        <label className="input-label">Who Will Arrange Freight Pickup?</label>
        <CustomDropdown
          options={freightPickupOptions}
          value={formData.Who_will_arrange_freight_pickup}
          onChange={handleFreightPickupChange}
          placeholder="-Select-"
          className="w-full"
        />
      </div>

      {/* Freight Pickup Date */}
      <div>
        <label className="input-label">Date of Freight Pickup Required</label>
        <DatePicker
          selected={formData.Date_of_freight_pickup_required_to_meet_customer_due_date}
          onChange={handleFreightPickupDateChange}
          dateFormat="MM/dd/yyyy"
          className="input-box w-full"
          placeholderText="Select a date"
        />
      </div>
    </div>
  </div>
  )
}

export default FreightDeliverySection