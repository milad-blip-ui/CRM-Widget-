import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const RentedTruckSection = ({
  formData,
  handleVehicleNumberChange,
  handleRentedTruckDeliveryDateChange,
  handleRentedTruckAddressChange,
}) => {
  return (
    <div className="mt-6">
      <h2 className="mt-4 text-gray-700 font-roboto font-semibold mb-4">
        Delivery Details (Rented Truck)
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
            value={formData.Delivery_Address_rented_truck.address_line_1}
            onChange={(e) =>
              handleRentedTruckAddressChange("address_line_1", e.target.value)
            }
          />
          {/* Address Line 2 */}
          <input
            type="text"
            placeholder="Address Line 2"
            className="input-box mt-2"
            value={formData.Delivery_Address_rented_truck.address_line_2}
            onChange={(e) =>
              handleRentedTruckAddressChange("address_line_2", e.target.value)
            }
          />
          <div class="flex space-x-2 mt-2">
            {/* City */}
            <input
              type="text"
              placeholder="City"
              className="input-box"
              value={formData.Delivery_Address_rented_truck.district_city}
              onChange={(e) =>
                handleRentedTruckAddressChange("district_city", e.target.value)
              }
            />
            {/* State */}
            <input
              type="text"
              placeholder="State"
              className="input-box"
              value={formData.Delivery_Address_rented_truck.state_province}
              onChange={(e) =>
                handleRentedTruckAddressChange("state_province", e.target.value)
              }
            />
          </div>
          {/* Postal Code */}
          <input
            type="text"
            placeholder="Zip Code"
            className="input-box mt-2"
            value={formData.Delivery_Address_rented_truck.postal_Code}
            onChange={(e) =>
              handleRentedTruckAddressChange("postal_Code", e.target.value)
            }
          />
        </div>

        <div className="mt-2">
          <label className="input-label">Vehicle Number</label>
          <label className="input-label mt-7">Desired Delivery Date</label>
        </div>
        <div>
          <input
            type="text"
            className="input-box"
            value={formData.Vehicle_number}
            onChange={handleVehicleNumberChange}
            placeholder="Enter vehicle number"
          />
          <DatePicker
            selected={formData.Desired_delivery_date_Rented_truck}
            onChange={handleRentedTruckDeliveryDateChange}
            className="input-box mt-2 w-[233px]"
            dateFormat="dd-MMM-yyyy"
            placeholderText="-Select-"
            minDate={new Date()}
          />
        </div>
      </div>
    </div>
  );
};

export default RentedTruckSection;
