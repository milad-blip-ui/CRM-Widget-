import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const DeliveryVehicleSection = ({
  formData,
  handleDeliveryAddressChange,
  handleDeliveryDateChange,
}) => (
  <div className="mt-6">
    <h2 className="mt-4 text-gray-700 font-roboto font-semibold mb-4">
      Delivery Details (Our Vehicle)
    </h2>

    <div class="grid grid-cols-6 gap-4">
      <label for="delivery-address" class="input-label">
        Delivery Address
      </label>
      <div>
        {/* Address Line 1 */}
        <input
          type="text"
          placeholder="Address Line 1"
          className="input-box "
          value={formData.Delivery_address.address_line_1}
          onChange={(e) =>
            handleDeliveryAddressChange("address_line_1", e.target.value)
          }
        />
        {/* Address Line 2 */}
        <input
          type="text"
          placeholder="Address Line 2"
          className="input-box mt-2"
          value={formData.Delivery_address.address_line_2}
          onChange={(e) =>
            handleDeliveryAddressChange("address_line_2", e.target.value)
          }
        />
        <div class="flex space-x-2 mt-2">
          {/* City */}
          <input
            type="text"
            placeholder="City"
            className="input-box"
            value={formData.Delivery_address.district_city}
            onChange={(e) =>
              handleDeliveryAddressChange("district_city", e.target.value)
            }
          />
          {/* State */}
          <input
            type="text"
            placeholder="State"
            className="input-box"
            value={formData.Delivery_address.state_province}
            onChange={(e) =>
              handleDeliveryAddressChange("state_province", e.target.value)
            }
          />
        </div>
        {/* Postal Code */}
        <input
          type="text"
          placeholder="Zip Code"
          className="input-box mt-2"
          value={formData.Delivery_address.postal_Code}
          onChange={(e) =>
            handleDeliveryAddressChange("postal_Code", e.target.value)
          }
        />
      </div>

      {/* Desired Delivery Date */}
      <label className="input-label mt-2">Desired Delivery Date</label>
      <DatePicker
        selected={formData.Desired_delivery_date}
        onChange={handleDeliveryDateChange}
        className="input-box"
        dateFormat="dd-MMM-yyyy"
        placeholderText="-Select-"
        minDate={new Date()}
      />
    </div>
  </div>
);

export default DeliveryVehicleSection;
