import React from "react";

import CustomDropdown from "../../components/shared/CustomDropdown";

const CustomerAccountSection = ({formData,
  handleCustomerAccountNumberChange,
  handleCustomerAccountChange,
  handleMultipleLocationsCustomerChange
}) => {
  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
  
  const customerAccountOptions = [
    { value: "UPS", label: "UPS" },
    { value: "Fedex", label: "Fedex" },
  ];
  return (
    <div className="mt-6">
    <h2 className="mt-4 text-gray-700 font-roboto font-semibold mb-4">UPS/Fedex (Customer Account) Details</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      {/* Customer Account */}
      <div className="md:col-span-2">
        <label className="input-label">Customer Account</label>
        <div className="flex space-x-4 mt-2">
          {customerAccountOptions.map((option) => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600 focus:ring-0"
                name="Customer_account"
                value={option.value}
                checked={formData.Customer_account === option.value}
                onChange={() => handleCustomerAccountChange(option.value)}
              />
              <span className="ml-2 text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Need Multiple Locations? */}
      <div>
        <label className="input-label">Need Multiple Locations?</label>
        <CustomDropdown
          options={yesNoOptions}
          value={formData.Need_Multiple_Locations_Send_UPS_customer}
          onChange={handleMultipleLocationsCustomerChange}
          placeholder="-Select-"
          className="w-full"
        />
      </div>
        {/* Customer Account Number */}
        <div>
        <label className="input-label">Customer Account Number (To Charge for Shipping Amount)</label>
        <input
          type="text"
          className="input-box w-full"
          value={formData.What_is_customer_account_number_to_charge_for_shipping_amount}
          onChange={handleCustomerAccountNumberChange}
          placeholder="Enter customer account number"
        />
      </div>
    </div>
  </div>
  )
}

export default CustomerAccountSection
