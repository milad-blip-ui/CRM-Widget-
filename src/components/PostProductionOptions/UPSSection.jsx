import React from 'react'
import CustomDropdown from "../../components/shared/CustomDropdown";
const UPSSection = ({formData,
    handleShippingServiceChange,
    handleRegularGroundChange,
    handleMarkupsChange,
    handleAccountNumberChange,
    handleMultipleLocationsUPSChange
}) => {
    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ];
      
      const shippingServiceOptions = [
        { value: "UPS", label: "UPS" },
        { value: "Fedex", label: "Fedex" },
      ];
  return (
    <div className="mt-6">
    <h2 className="mt-4 text-gray-700 font-roboto font-semibold mb-4">UPS/Fedex Shipping Details</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      {/* Next Day Shipment Needed */}
      <div className="md:col-span-2">
        <label className="input-label">Next Day Shipment Needed</label>
        <div className="flex space-x-4 mt-2">
          {shippingServiceOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600 focus:ring-0"
                name="Next_day_shipment_needed"
                value={option.value}
                checked={formData.Next_day_shipment_needed === option.value}
                onChange={() => handleShippingServiceChange(option.value)}
              />
              <span className="ml-2 text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Regular Ground Shipment */}
      <div>
        <label className="input-label">Regular Ground Shipment</label>
        <CustomDropdown
          options={yesNoOptions}
          value={formData.Regular_Ground_shipment}
          onChange={handleRegularGroundChange}
          placeholder="-Select-"
          className="w-full"
        />
      </div>

      {/* Charge Normal Markup */}
      <div>
        <label className="input-label">Charge Normal Markup</label>
        <CustomDropdown
          options={yesNoOptions}
          value={formData.Charge_normal_markup}
          onChange={handleMarkupsChange}
          placeholder="-Select-"
          className="w-full"
        />
      </div>

      {/* Account Number */}
      <div>
        <label className="input-label">Account Number</label>
        <input
          type="text"
          className="input-box"
          value={formData.Account_Numer}
          onChange={handleAccountNumberChange}
          placeholder="Enter account number"
        />
      </div>

      {/* Need Multiple Locations */}
      <div>
        <label className="input-label">Need Multiple Locations?</label>
        <CustomDropdown
          options={yesNoOptions}
          value={formData.Need_Multiple_Locations_Send_UPS_Our_Account}
          onChange={handleMultipleLocationsUPSChange}
          placeholder="-Select-"
          className="w-full"
        />
      </div>
    </div>
  </div>
  )
}

export default UPSSection