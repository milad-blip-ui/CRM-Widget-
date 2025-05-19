import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDropdown from "../../components/shared/CustomDropdown";
const CustomerPickupSection = ({formData, handlePickupFieldChange, handlePickupDateChange}) => {
  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
  return(
  
    <div className="mt-6">
      <h2 className="mt-4 text-gray-700 font-roboto font-semibold mb-4">Customer Pickup Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Do we know who is picking up? */}
        <div>
          <label className="input-label">Do we know who is picking up?</label>
          <CustomDropdown
            options={yesNoOptions}
            value={formData.Do_we_know_who_is_picking_up}
            onChange={(value) => handlePickupFieldChange('Do_we_know_who_is_picking_up', value)}
            placeholder="-Select-"
            className="w-full"
          />
        </div>
  
        {/* Name (conditionally shown) */}
        {formData.Do_we_know_who_is_picking_up === "Yes" && (
          <div>
            <label className="input-label">Name</label>
            <input
              type="text"
              className="input-box"
              value={formData.Name}
              onChange={(e) => handlePickupFieldChange('Name', e.target.value)}
              placeholder="Enter name of person picking up"
            />
          </div>
        )}
  
        {/* Do we know when will customer pickup? */}
        <div>
          <label className="input-label">Do we know when cu pickup?</label>
          <CustomDropdown
            options={yesNoOptions}
            value={formData.Do_we_know_when_will_customer_pickup}
            onChange={(value) => handlePickupFieldChange('Do_we_know_when_will_customer_pickup', value)}
            placeholder="-Select-"
            className="w-full"
          />
        </div>
  
        {/* Pickup Date (conditionally shown) */}
        {formData.Do_we_know_when_will_customer_pickup === "Yes" && (
          <div>
            <label className="input-label">Pickup Date</label>
            <DatePicker
              selected={formData.PickUp_Date}
              onChange={handlePickupDateChange}
              className="input-box"
              dateFormat="dd-MMM-yyyy"
              placeholderText="-Select-"
              minDate={new Date()}
            />
          </div>
        )}
      </div>
    </div>
  )};

export default CustomerPickupSection