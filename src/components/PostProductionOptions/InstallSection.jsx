  import React from 'react'
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import CustomDropdown from "../../components/shared/CustomDropdown";
  const InstallSection = ({
    formData,
    handleDropdownChange,
    handleTextChange,
    handleNumberChange,
    handleDateInstallChange
  }) => {
    const workTypeOptions = [
        { value: "Site Survey", label: "Site Survey" },
        { value: "Permit Request", label: "Permit Request" },
        { value: "Service Call", label: "Service Call" },
        { value: "Installation", label: "Installation" },
        { value: "Re-Visit / Re-Install", label: "Re-Visit / Re-Install" },
      ];
      
      const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ];
      
      const manufactureTypeOptions = [
        { value: "In-house", label: "In-house" },
        { value: "Outsource", label: "Outsource" },
        { value: "Combination", label: "Combination" },
      ];
      
      const installTypeOptions = [
        { value: "Interior", label: "Interior" },
        { value: "Exterior", label: "Exterior" },
      ];
      
      const preferredTimeOptions = [
        { value: "Morning", label: "Morning" },
        { value: "Afternoon", label: "Afternoon" },
        { value: "Evening", label: "Evening" },
      ];
      
      const hardwareGradeOptions = [
        { value: "Interior", label: "Interior" },
        { value: "Exterior", label: "Exterior" },
      ];
      
      const wallSurfaceOptions = [
        { value: "Drywall", label: "Drywall" },
        { value: "Cement Board", label: "Cement Board" },
        { value: "Plywood / Wood Paneling", label: "Plywood / Wood Paneling" },
        { value: "Glass", label: "Glass" },
        { value: "Flat Steel", label: "Flat Steel" },
        { value: "Corrugated Steel", label: "Corrugated Steel" },
        { value: "Rough Stone / Faux Stone", label: "Rough Stone / Faux Stone" },
        { value: "Smooth Stone / Concrete", label: "Smooth Stone / Concrete" },
        { value: "Tile", label: "Tile" },
      ];
      
      const inHouseEquipmentOptions = [
        { value: "Mini loader / auger", label: "Mini loader / auger" },
        { value: "Hand held auger", label: "Hand held auger" },
        { value: "Trailer", label: "Trailer" },
        { value: "Large ladder", label: "Large ladder" },
        { value: "Jack hammer", label: "Jack hammer" },
        { value: "Generator / Compressor", label: "Generator / Compressor" },
      ];
      
      const rentalEquipmentOptions = [
        { value: "Scissor Lift (19’)", label: "Scissor Lift (19’)" },
        { value: "Scissor Lift (26’)", label: "Scissor Lift (26’)" },
        { value: "Towable Boom Lift (35’)", label: "Towable Boom Lift (35’)" },
        { value: "Towable Boom Lift (50’)", label: "Towable Boom Lift (50’)" },
        { value: "Bucket Truck", label: "Bucket Truck" },
        { value: "Crane Truck", label: "Crane Truck" },
      ];
      
      const obstructionOptions = [
        { value: "Overhead Beams", label: "Overhead Beams" },
        { value: "HVAC / Ducts", label: "HVAC / Ducts" },
        { value: "Staircase", label: "Staircase" },
        { value: "Desk / Cabinets", label: "Desk / Cabinets" },
        { value: "High Traffic Area", label: "High Traffic Area" },
        { value: "Outlets / Lighting", label: "Outlets / Lighting" },
        { value: "Trees / Bushes / Fences", label: "Trees / Bushes / Fences" },
        { value: "Powerlines", label: "Powerlines" },
        { value: "Uneven Terrain", label: "Uneven Terrain" },
        { value: "Vehicles in parking lot", label: "Vehicles in parking lot" },
      ];
    return (
        <div className="mt-6">
        <h2 className="mt-4 text-gray-700 font-roboto font-semibold mb-4">Install Details</h2>
    
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Type of Work Needed */}
          <div>
            <label className="input-label">Type of Work Needed</label>
            <CustomDropdown
              options={workTypeOptions}
              value={formData.Type_of_Work_Needed}
              onChange={handleDropdownChange('Type_of_Work_Needed')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Install Summary of Work */}
          <div>
            <label className="input-label">Install Summary of Work</label>
            <textarea
              className="input-box w-full h-24"
              value={formData.Install_Summary_of_Work}
              onChange={handleTextChange('Install_Summary_of_Work')}
              placeholder="Enter summary of work"
            />
          </div>
    
          {/* Manufacture Type */}
          <div>
            <label className="input-label">Manufacture Type</label>
            <CustomDropdown
              options={manufactureTypeOptions}
              value={formData.Manufacture_Type}
              onChange={handleDropdownChange('Manufacture_Type')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Miss DIG Required */}
          <div>
            <label className="input-label">Miss DIG Required?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Miss_DIG_required1}
              onChange={handleDropdownChange('Miss_DIG_required1')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Install Type */}
          <div>
            <label className="input-label">Install Type</label>
            <CustomDropdown
              options={installTypeOptions}
              value={formData.Install_type}
              onChange={handleDropdownChange('Install_type')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Sign Permit Required */}
          <div>
            <label className="input-label">Sign Permit Required?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Sign_Permit_Required}
              onChange={handleDropdownChange('Sign_Permit_Required')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Electrical Permit Required */}
          <div>
            <label className="input-label">Electrical Permit Required?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Electrical_Permit_Required}
              onChange={handleDropdownChange('Electrical_Permit_Required')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Electrical Connection Made by Us */}
          <div>
            <label className="input-label">Electrical Connection Made by Us?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Electrical_Connection_Made_by_Us}
              onChange={handleDropdownChange('Electrical_Connection_Made_by_Us')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Has the Wall Recently Been Painted? */}
          <div>
            <label className="input-label">Has the Wall Recently Been Painted?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Has_the_wall_recently_been_painted}
              onChange={handleDropdownChange('Has_the_wall_recently_been_painted')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* What Floor(s) Will Signage Be Installed? */}
          <div>
            <label className="input-label">What Floor(s) Will Signage Be Installed?</label>
            <input
              type="text"
              className="input-box w-full"
              value={formData.What_floor_s_will_Signage_be_installed}
              onChange={handleTextChange('What_floor_s_will_Signage_be_installed')}
              placeholder="Enter floor(s)"
            />
          </div>
    
          {/* Is There a Working Elevator Available? */}
          <div>
            <label className="input-label">Is There a Working Elevator Available?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Is_There_a_Working_Elevator_Available}
              onChange={handleDropdownChange('Is_There_a_Working_Elevator_Available')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Is Rental Equipment Needed? */}
          <div>
            <label className="input-label">Is Rental Equipment Needed?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Is_Rental_Equipment_Needed}
              onChange={handleDropdownChange('Is_Rental_Equipment_Needed')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* In-House Large Equipment Needed? */}
          <div>
            <label className="input-label">In-House Large Equipment Needed?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.In_House_Large_Equipment_Needed}
              onChange={handleDropdownChange('In_House_Large_Equipment_Needed')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* In-House Equipment */}
          <div>
            <label className="input-label">In-House Equipment</label>
            <CustomDropdown
              options={inHouseEquipmentOptions}
              value={formData.In_house_equipment}
              onChange={handleDropdownChange('In_house_equipment')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Any Obstruction in the Install Area? */}
          <div>
            <label className="input-label">Any Obstruction in the Install Area?</label>
            <CustomDropdown
              options={obstructionOptions}
              value={formData.Any_obstruction_in_the_install_area}
              onChange={handleDropdownChange('Any_obstruction_in_the_install_area')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Rental Equipment */}
          <div>
            <label className="input-label">Rental Equipment</label>
            <CustomDropdown
              options={rentalEquipmentOptions}
              value={formData.Rental_Equipment}
              onChange={handleDropdownChange('Rental_Equipment')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Type of Wall Surface Being Installed */}
          <div>
            <label className="input-label">Type of Wall Surface Being Installed</label>
            <CustomDropdown
              options={wallSurfaceOptions}
              value={formData.TYPE_OF_WALL_SURFACE_BEING_INSTALLED}
              onChange={handleDropdownChange('TYPE_OF_WALL_SURFACE_BEING_INSTALLED')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* What Type of Hardware Specific? */}
          <div>
            <label className="input-label">What Type of Hardware Specific?</label>
            <input
              type="text"
              className="input-box w-full"
              value={formData.Whta_type_of_Hardware_Specific}
              onChange={handleTextChange('Whta_type_of_Hardware_Specific')}
              placeholder="Enter hardware type"
            />
          </div>
    
          {/* URL Link 1 */}
          <div>
            <label className="input-label">URL Link 1</label>
            <input
              type="text"
              className="input-box w-full"
              value={formData.URL_Link1}
              onChange={handleTextChange('URL_Link1')}
              placeholder="Enter URL"
            />
          </div>
    
          {/* URL Link 2 */}
          <div>
            <label className="input-label">URL Link 2</label>
            <input
              type="text"
              className="input-box w-full"
              value={formData.URL_Link2}
              onChange={handleTextChange('URL_Link2')}
              placeholder="Enter URL"
            />
          </div>
    
          {/* Preferred Date 1 */}
          <div>
            <label className="input-label">Preferred Date 1</label>
            <DatePicker
              selected={formData.Preferred_Date_1}
              onChange={handleDateInstallChange('Preferred_Date_1')}
              dateFormat="MM/dd/yyyy"
              className="input-box w-full"
              placeholderText="Select a date"
            />
          </div>
    
          {/* Preferred Date 2 */}
          <div>
            <label className="input-label">Preferred Date 2</label>
            <DatePicker
              selected={formData.Preferred_Date_2}
              onChange={handleDateInstallChange('Preferred_Date_2')}
              dateFormat="MM/dd/yyyy"
              className="input-box w-full"
              placeholderText="Select a date"
            />
          </div>
    
          {/* Preferred Time */}
          <div>
            <label className="input-label">Preferred Time</label>
            <CustomDropdown
              options={preferredTimeOptions}
              value={formData.Preferred_Time}
              onChange={handleDropdownChange('Preferred_Time')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Is Hardware Needed? */}
          <div>
            <label className="input-label">Is Hardware Needed?</label>
            <CustomDropdown
              options={yesNoOptions}
              value={formData.Is_Hardware_Needed}
              onChange={handleDropdownChange('Is_Hardware_Needed')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Hardware Grade */}
          <div>
            <label className="input-label">Hardware Grade</label>
            <CustomDropdown
              options={hardwareGradeOptions}
              value={formData.Hardware_Grade}
              onChange={handleDropdownChange('Hardware_Grade')}
              placeholder="-Select-"
              className="w-full"
            />
          </div>
    
          {/* Approx Fabrication Time (Hours) */}
          <div>
            <label className="input-label">Approx Fabrication Time (Hours)</label>
            <input
              type="number"
              className="input-box w-full"
              value={formData.Appprox_fabrication_time_Hours}
              onChange={handleNumberChange('Appprox_fabrication_time_Hours')}
              placeholder="Enter hours"
            />
          </div>
    
          {/* How Many Installers Needed */}
          <div>
            <label className="input-label">How Many Installers Needed?</label>
            <input
              type="number"
              className="input-box w-full"
              value={formData.How_many_installers_needed2}
              onChange={handleNumberChange('How_many_installers_needed2')}
              placeholder="Enter number"
            />
          </div>
    
          {/* Number of Visits Needed */}
          <div>
            <label className="input-label">Number of Visits Needed</label>
            <input
              type="text"
              className="input-box w-full"
              value={formData.Number_of_Visits_needed}
              onChange={handleTextChange('Number_of_Visits_needed')}
              placeholder="Enter visits"
            />
          </div>
    
          {/* Estimated Hours of Travel */}
          <div>
            <label className="input-label">Estimated Hours of Travel</label>
            <input
              type="number"
              className="input-box w-full"
              value={formData.Estimated_hours_of_travel}
              onChange={handleNumberChange('Estimated_hours_of_travel')}
              placeholder="Enter hours"
            />
          </div>
    
          {/* Estimated Hours on Site */}
          <div>
            <label className="input-label">Estimated Hours on Site</label>
            <input
              type="number"
              className="input-box w-full"
              value={formData.Estimated_hours_on_site}
              onChange={handleNumberChange('Estimated_hours_on_site')}
              placeholder="Enter hours"
            />
          </div>
    
          {/* Production Due Date */}
          <div>
            <label className="input-label">Production Due Date</label>
            <DatePicker
              selected={formData.Production_due_date}
              onChange={handleDateInstallChange('Production_due_date')}
              dateFormat="MM/dd/yyyy"
              className="input-box w-full"
              placeholderText="Select a date"
            />
          </div>
    
          {/* Fabrication Due Date */}
          <div>
            <label className="input-label">Fabrication Due Date</label>
            <DatePicker
              selected={formData.Fabrication_due_date}
              onChange={handleDateInstallChange('Fabrication_due_date')}
              dateFormat="MM/dd/yyyy"
              className="input-box w-full"
              placeholderText="Select a date"
            />
          </div>
    
          {/* Installation Due Date */}
          <div>
            <label className="input-label">Installation Due Date</label>
            <DatePicker
              selected={formData.Installation_due_date}
              onChange={handleDateInstallChange('Installation_due_date')}
              dateFormat="MM/dd/yyyy"
              className="input-box w-full"
              placeholderText="Select a date"
            />
          </div>
        </div>
      </div>
    )
  }
  
  export default InstallSection