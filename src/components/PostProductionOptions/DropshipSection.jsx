import React from 'react'
import CustomDropdown from "../../components/shared/CustomDropdown";
const DropshipSection = ({formData, handleShipFromChange, handleMultipleLocationsChange,
    handleShipToAddressChange
}) => {
    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ];
      
      const shipFromOptions = [
        { value: "Our shop", label: "Our shop" },
        { value: "Our supplier direct to our customer", label: "Our supplier direct to our customer" },
      ];
  return (
    <div className="mt-6">
    <h2 className="mt-4 text-gray-700 font-roboto font-semibold mb-4">Dropship Details</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      {/* Where will it ship from? */}
      <div className="md:col-span-2">
        <label className="input-label">Where will it ship from?</label>
        <div className="flex flex-col space-y-2 mt-2">
          {shipFromOptions.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600 focus:ring-0"
                name="Where_will_it_ship_from"
                value={option.value}
                checked={formData.Where_will_it_ship_from === option.value}
                onChange={() => handleShipFromChange(option.value)}
              />
              <span className="ml-2 text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Need Multiple Locations Dropship? */}
      <div>
        <label className="input-label">Need Multiple Locations Dropship?</label>
        <CustomDropdown
          options={yesNoOptions}
          value={formData.Need_Multiple_Locations_Dropship}
          onChange={handleMultipleLocationsChange}
          placeholder="-Select-"
          className="w-full"
        />
      </div>

      {/* Ship To Address - Address Line 1 */}
      <div className="md:col-span-2">
        <label className="input-label">Ship To Address - Line 1</label>
        <input
          type="text"
          className="input-box"
          value={formData.Ship_to_address.address_line_1}
          onChange={(e) => handleShipToAddressChange('address_line_1', e.target.value)}
          placeholder="Enter address line 1"
        />
      </div>

      {/* Ship To Address - Address Line 2 */}
      <div className="md:col-span-2">
        <label className="input-label">Ship To Address - Line 2</label>
        <input
          type="text"
          className="input-box"
          value={formData.Ship_to_address.address_line_2}
          onChange={(e) => handleShipToAddressChange('address_line_2', e.target.value)}
          placeholder="Enter address line 2"
        />
      </div>

      {/* Ship To Address - City */}
      <div>
        <label className="input-label">City</label>
        <input
          type="text"
          className="input-box"
          value={formData.Ship_to_address.district_city}
          onChange={(e) => handleShipToAddressChange('district_city', e.target.value)}
          placeholder="Enter city"
        />
      </div>

      {/* Ship To Address - State */}
      <div>
        <label className="input-label">State</label>
        <input
          type="text"
          className="input-box"
          value={formData.Ship_to_address.state_province}
          onChange={(e) => handleShipToAddressChange('state_province', e.target.value)}
          placeholder="Enter state"
        />
      </div>
    </div>
  </div>
  )
}

export default DropshipSection