const transformSalesorder = (item) => {
    // Helper function to parse file info from URL strings
    const parseFileInfo = (fileObj) => {
      try {
        const parsed = JSON.parse(fileObj.File_Download_URL);
        return {
          file: {},
          fileDescription: parsed.fileDescription || "",
          fileName: parsed.fileName || "",
          fileURL:parsed.fileURL
        };
      } catch (e) {
        return {
          file: {},
          fileDescription: "",
          fileName: "",
          fileURL:""
        };
      }
    };
    // Helper to get display name from zc_display_value
    const getDisplayName = (obj) => {
      if (!obj) return "";
      if (obj.zc_display_value) {
        return obj.zc_display_value.trim().replace(/\s+/g, ' ');
      }
      return "";
    };
    return {
      Tax_rate: item.Tax_rate,
      SO_name: item.SO_name,
      Status: item.Status,
      Source: item.Source,
      // Quote_approval: item.Quote_approval,
      // Approver1: item.Approver1?.ID || "",
      Post_production: item.Post_production,
      CRM_Account_Name: item.CRM_Account_Name?.ID || "",
      Lead_time_from_approval_Business_Days: item.Lead_time_from_approval_Business_Days,
      Salesperson: item.Salesperson_Lookup?.ID || "",
      SO_Date: item.SO_Date,
      Widget_CRM_Contact_Name: item.Widget_CRM_Contact_Name,
      Widget_Location_Name: item.Widget_Location_Name,
      Vendor_Number: item.Vendor_Number,

      Shipping_Name: item.Shipping_Name,
      Billing_Name: item.Billing_Name,
      Ship_To: {
        address_line_2: item.Ship_To?.address_line_2 || "",
        district_city: item.Ship_To?.district_city || "",
        state_province: item.Ship_To?.state_province || "",
        postal_Code: item.Ship_To?.postal_code || ""
      },
      Bill_To: {
        address_line_1: item.Bill_To?.address_line_1 || "",
        postal_Code: item.Bill_To?.postal_code || "",
        district_city: item.Bill_To?.district_city || "",
        state_province: item.Bill_To?.state_province || ""
      },
      Notes_Public_RT: item.Notes_Public_RT || "",
      Private_Notes_RT: item.Private_Notes_RT || "",
      Is_Hot_Job: item.Is_Hot_Job,
      Item_Details: item.Item_Details?.map((detail, index) => ({
        id: index + 1,
        Item: detail.Item,
        Qty: detail.Qty,
        Unit: detail.Unit,
        Description_Rich_Text: detail.Description_Rich_Text,
        Product_Type1: detail.Product_Type1?.ID || "",
        Piece_cost: detail.Piece_cost,
        Margin: detail.Margin,
        piecePrice: detail.Piece_price,
        amount: detail.Amount,
        Product_Type_Name: detail.Product_Type1?.Type_field,
        isPieceCostFocused: false,
        isMarkupFocused: false
      })) || [],
      Reference_URL: item.Reference_URL?.map(ref => ({
        Url: { url: ref.Url?.url || ref.Url?.value || "" },
        Description: ref.Description || ""
      })) || [],
      Accounting_Summary: {
        totalCost: item.Total_Cost,
        subTotal: item.Sub_Total,
        jobProfit: item.Job_Profit,
        jobProfitPercent: item.Job_profit_prsent,
        salesTax: item.Sales_tax,
        total: item.Total, 
        pastDue:item.Past_Due,
        downPaymentPercent: parseFloat(item.Down_Payment),
        downPaymentAmount: item.Down_Payment_Amount,
        creditLimit:item.Credit_Limit,
        balanceDue: item.Balance_Due,
        totalReceivable: item.Total_Receivable,
        taxableAmount: item.Sub_Total
      },
      Customer_Attachments: item.Customer_Attachments?.map(parseFileInfo) || [],
      Private_Attachments: item.Private_Attachments?.map(parseFileInfo) || [],
      CRM_Account_Name_String: item.CRM_Account_Name?.account_name || item.Account_Name_String,
      SalespersonName:getDisplayName(item.Salesperson_Lookup),
      ID: item.ID,
      Salesorder: item.Salesorder,
      Did_customer_provide_a_customer_PO:item.Did_customer_provide_a_customer_PO,
      PO_Number:item.PO_Number,
      is_Design_Proof_needed: item.is_Design_Proof_needed,
      Approved_On: item.Approved_On,
      Our_Commitment_Date: item.Our_Commitment_Date,
      Customer_due_date: item.Customer_due_date,
      /////////////////////////////////////////////////////////
      Delivery_address: {
              address_line_1: item.Delivery_address.address_line_1,
              address_line_2: item.Delivery_address.address_line_2,
              district_city: item.Delivery_address.district_city,
              state_province: item.Delivery_address.state_province,
              postal_Code:item.Delivery_address.postal_code,
            },
            Desired_delivery_date: item.Desired_delivery_date,
      
            Vehicle_number: item.Vehicle_number || "",
            Delivery_Address_rented_truck: {
                address_line_1: item.Delivery_Address_rented_truck.address_line_1,
                address_line_2: item.Delivery_Address_rented_truck.address_line_2,
                district_city: item.Delivery_Address_rented_truck.district_city,
                state_province: item.Delivery_Address_rented_truck.state_province,
                postal_Code:item.Delivery_Address_rented_truck.postal_code,
              },
            Desired_delivery_date_Rented_truck:item.Desired_delivery_date_Rented_truck,
      
            Do_we_know_who_is_picking_up: item.Do_we_know_who_is_picking_up,
            Name: item.Name,
            Do_we_know_when_will_customer_pickup:item.Do_we_know_when_will_customer_pickup,
            PickUp_Date: item.PickUp_Date,
      
            Ship_to_address: {
              address_line_1: item.Ship_to_address.address_line_1,
              address_line_2: item.Ship_to_address.address_line_2,
              district_city: item.Ship_to_address.district_city,
              state_province: item.Ship_to_address.state_province,
              postal_Code:item.Ship_to_address.postal_code,
            },
            Where_will_it_ship_from: item.Where_will_it_ship_from,
            Need_Multiple_Locations_Dropship:item.Need_Multiple_Locations_Dropship,
      
            Our_Account: item.Our_Account,
            Next_day_shipment_needed: item.Next_day_shipment_needed,
            Regular_Ground_shipment: item.Regular_Ground_shipment,
            Charge_normal_markup: item.Charge_normal_markup,
            Account_Numer: item.Account_Numer,
            Need_Multiple_Locations_Send_UPS_Our_Account:
              item.Need_Multiple_Locations_Send_UPS_Our_Account,
      
            Customer_account: item.Customer_account,
            Need_Multiple_Locations_Send_UPS_customer:
              item.Need_Multiple_Locations_Send_UPS_customer,
            Date_of_freight_pickup_required_to_meet_customer_due_date:
              item.Date_of_freight_pickup_required_to_meet_customer_due_date,
      
            Pallet_size_needed_provide_estimate:
              item.Pallet_size_needed_provide_estimate,
            Who_will_arrange_freight_pickup:
              item.Who_will_arrange_freight_pickup,
            What_is_customer_account_number_to_charge_for_shipping_amount:
              item.What_is_customer_account_number_to_charge_for_shipping_amount,
      
            Type_of_Work_Needed: item.Type_of_Work_Needed,
            Install_Summary_of_Work: item.Install_Summary_of_Work,
            Manufacture_Type: item.Manufacture_Type,
            Miss_DIG_required1: item.Miss_DIG_required1,
            Install_type: item.Install_type,
            Sign_Permit_Required: item.Sign_Permit_Required,
            Electrical_Permit_Required: item.Electrical_Permit_Required,
            Electrical_Connection_Made_by_Us:
              item.Electrical_Connection_Made_by_Us,
            Has_the_wall_recently_been_painted:
              item.Has_the_wall_recently_been_painted,
            What_floor_s_will_Signage_be_installed:
              item.What_floor_s_will_Signage_be_installed,
            Is_There_a_Working_Elevator_Available:
              item.Is_There_a_Working_Elevator_Available,
            Is_Rental_Equipment_Needed: item.Is_Rental_Equipment_Needed,
            In_House_Large_Equipment_Needed:
              item.In_House_Large_Equipment_Needed,
            In_house_equipment: item.In_house_equipment,
            Any_obstruction_in_the_install_area:
              item.Any_obstruction_in_the_install_area,
            Rental_Equipment: item.Rental_Equipment,
            TYPE_OF_WALL_SURFACE_BEING_INSTALLED:
              item.TYPE_OF_WALL_SURFACE_BEING_INSTALLED,
            Whta_type_of_Hardware_Specific:
              item.Whta_type_of_Hardware_Specific,
            URL_Link1: item.URL_Link1,
            URL_Link2: item.URL_Link2,
            Preferred_Date_1: item.Preferred_Date_1,
            Preferred_Date_2: item.Preferred_Date_2,
            Preferred_Time: item.Preferred_Time,
            Is_Hardware_Needed: item.Is_Hardware_Needed,
            Hardware_Grade: item.Hardware_Grade,
            Appprox_fabrication_time_Hours:
              item.Appprox_fabrication_time_Hours,
            How_many_installers_needed2: item.How_many_installers_needed2,
            Number_of_Visits_needed: item.Number_of_Visits_needed,
            Estimated_hours_of_travel: item.Estimated_hours_of_travel,
            Estimated_hours_on_site: item.Estimated_hours_on_site,
            Production_due_date: item.Production_due_date,
            Fabrication_due_date: item.Fabrication_due_date,
            Installation_due_date: item.Installation_due_date

    };
  };
  
export default transformSalesorder