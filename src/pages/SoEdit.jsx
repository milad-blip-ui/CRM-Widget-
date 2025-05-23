// import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import toast from "react-hot-toast";
// import JoditEditor from "jodit-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import CustomDropdown from "../components/shared/CustomDropdown";
// import AccountDropdown from "../components/shared/AccountDropdown";
// import { formatDate } from "../utils/dateUtils";
// import { PageSpinner } from "../components/shared/Spinner";
// import updateEstimate from "../services/updateEstimate";

// import DeliveryVehicleSection from "../components/PostProductionOptions/DeliveryVehicleSection";
// import RentedTruckSection from "../components/PostProductionOptions/RentedTruckSection";
// import CustomerPickupSection from "../components/PostProductionOptions/CustomerPickupSection";
// import DropshipSection from "../components/PostProductionOptions/DropshipSection";
// import UPSSection from "../components/PostProductionOptions/UPSSection";
// import CustomerAccountSection from "../components/PostProductionOptions/CustomerAccountSection";
// import FreightDeliverySection from "../components/PostProductionOptions/FreightDeliverySection";
// import InstallSection from "../components/PostProductionOptions/InstallSection";
// // Utility function for shallow comparison
// function shallowEqual(obj1, obj2) {
//   if (obj1 === obj2) return true;
//   if (
//     typeof obj1 !== "object" ||
//     obj1 === null ||
//     typeof obj2 !== "object" ||
//     obj2 === null
//   ) {
//     return false;
//   }
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);
//   if (keys1.length !== keys2.length) return false;
//   for (const key of keys1) {
//     if (obj1[key] !== obj2[key]) return false;
//   }
//   return true;
// }

// const Edit = ({ placeholder }) => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const { allItems, updateEstimateById } = useContext(AppContext);
//   const navigate = useNavigate();
//   const [editSpinner, setEditSpinner] = useState(false);
//   const [forceUpdate, setForceUpdate] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [estimateData, setEstimateData] = useState(null);
//   const [loadingCreatorData, setLoadingCreatorData] = useState(true);
//   const [newContactOptions, setNewContactOptions] = useState([]);
//   const [loadingAccountDetails, setLoadingAccountDetails] = useState(false);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const connection = "crmwidgetconnection";
//         const [allProductType, allEmployee] = await Promise.all([
//           window.ZOHO.CRM.CONNECTION.invoke(connection, {
//             parameters: {},
//             headers: {
//               "Content-Type": "application/json",
//             },
//             method: "GET",
//             url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/All_Product_Types`,
//             param_type: 1,
//           }),
//           window.ZOHO.CRM.CONNECTION.invoke(connection, {
//             parameters: {},
//             headers: {
//               "Content-Type": "application/json",
//             },
//             method: "GET",
//             url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/All_Employees`,
//             param_type: 1,
//           }),
//         ]);

//         setData({
//           allProductTypes: allProductType.details.statusMessage,
//           allEmployees: allEmployee.details.statusMessage,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load initial data");
//       } finally {
//         setLoadingCreatorData(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchEstimateData = async () => {
//       try {
//         const estimate = allItems.find((item) => {
//           return item.ID === id;
//         });
//         if (estimate) {
//           setEstimateData(estimate);

//           // Initialize customer attachments
//           if (estimate.Customer_Attachments?.length) {
//             setCustomerAttachments(
//               estimate.Customer_Attachments.map((attach) => ({
//                 id: attach.id,
//                 file: null, // Keep as null since we can't recreate File objects from JSON
//                 fileName: attach.fileName || "",
//                 fileDescription: attach.fileDescription || "",
//               }))
//             );
//           } else {
//             setCustomerAttachments([
//               { id: 1, file: null, fileName: "", fileDescription: "" },
//             ]);
//           }

//           // Initialize private attachments
//           if (estimate.Private_Attachments?.length) {
//             setPrivateAttachments(
//               estimate.Private_Attachments.map((attach) => ({
//                 id: attach.id,
//                 file: null, // Keep as null since we can't recreate File objects from JSON
//                 fileName: attach.fileName || "",
//                 fileDescription: attach.fileDescription || "",
//               }))
//             );
//           } else {
//             setPrivateAttachments([
//               { id: 1, file: null, fileName: "", fileDescription: "" },
//             ]);
//           }
//         } else {
//           toast.error("Failed to fetch estimate data");
//         }
//       } catch (error) {
//         console.error("Error fetching estimate:", error);
//         toast.error("An error occurred while fetching the estimate");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEstimateData();
//   }, [id]);

//   // Address handling
//   const [fetchedData, setFetchedData] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);

//   // Handle address selection change
//   const handleAddressChange = (selectedName) => {
//     const selected = fetchedData.find((addr) => addr.name === selectedName);
//     setSelectedAddress(selected);
//     if (selected) {
//       setFormData((prev) => ({
//         ...prev,
//         locationName: selected.name,
//         billingAddress: {
//           street: selected.Billing_Street,
//           city: selected.Billing_City,
//           state: selected.Billing_State,
//           zip: selected.Billing_Code,
//         },
//         shippingAddress: {
//           street: selected.Shipping_Street,
//           city: selected.Shipping_City,
//           state: selected.Shipping_State,
//           zip: selected.Shipping_Code,
//         },
//       }));
//     }
//   };

//   // Form data state
//   //Form data
//   const [formData, setFormData] = useState({
//     quoteDate: new Date(),
//     quoteName: "",
//     crmAccountName: "",
//     crmAccountNameString: "",
//     postProduction: "",
//     leadTime: "",
//     taxRate: "",
//     locationName: "",
//     hasCustomerPo: "",
//     poNumber: "",
//     salesperson: "",
//     salespersonName: "",
//     vendorNumber: "",
//     crmContactName: "",
//     privateNotes: "",
//     publicNotes: "",
//     isHotJob: "",
//     billingAddress: {
//       street: "",
//       city: "",
//       state: "",
//       zip: "",
//     },
//     shippingAddress: {
//       street: "",
//       city: "",
//       state: "",
//       zip: "",
//     },
//     isDesignProofNeeded: "",
//     approvedOn: null,
//     commitmentDate: null,
//     customerDueDate: null,

//     Delivery_address: {
//       address_line_1: "",
//       address_line_2: "",
//       district_city: "",
//       state_province: "",
//       postal_Code: "",
//     },
//     Desired_delivery_date: null,

//     Vehicle_number: "",
//     Delivery_Address_rented_truck: {
//       address_line_1: "",
//       address_line_2: "",
//       district_city: "",
//       state_province: "",
//       postal_Code: "",
//     },
//     Desired_delivery_date_Rented_truck: null,

//     Do_we_know_who_is_picking_up: "", // dropdown
//     Name: "", // text field
//     Do_we_know_when_will_customer_pickup: "", // dropdown
//     PickUp_Date: null,

//     Ship_to_address: {
//       address_line_1: "",
//       address_line_2: "",
//       district_city: "",
//       state_province: "",
//     },
//     Where_will_it_ship_from: "", // "Our shop" or "Our supplier direct to our customer"
//     Need_Multiple_Locations_Dropship: "",

//     Our_Account: "SO_PO_UFOA_ourAccount",
//     Next_day_shipment_needed: "", // "UPS" or "Fedex"
//     Regular_Ground_shipment: "", // "Yes" or "No"
//     Charge_normal_markup: "", // "Yes" or "No"
//     Account_Numer: "", // text input
//     Need_Multiple_Locations_Send_UPS_Our_Account: "",

//     Customer_account: "", // Radio options: "UPS", "Fedex"
//     Need_Multiple_Locations_Send_UPS_customer: "", // Dropdown options: "Yes", "No"
//     What_is_customer_account_number_to_charge_for_shipping_amount: "",

//     Pallet_size_needed_provide_estimate: "", // Textbox
//     Who_will_arrange_freight_pickup: "", // Dropdown options: '1Source', 'Customer'
//     Date_of_freight_pickup_required_to_meet_customer_due_date: "",

//     Type_of_Work_Needed: "", // dropdown options
//     Install_Summary_of_Work: "", // multi-line textbox
//     Manufacture_Type: "", // dropdown options
//     Miss_DIG_required1: "", // dropdown options
//     Install_type: "", // dropdown options
//     Sign_Permit_Required: "", // dropdown options
//     Electrical_Permit_Required: "", // dropdown options
//     Electrical_Connection_Made_by_Us: "", // dropdown options
//     Has_the_wall_recently_been_painted: "", // dropdown options
//     What_floor_s_will_Signage_be_installed: "", // textbox
//     Is_There_a_Working_Elevator_Available: "", // dropdown options
//     Is_Rental_Equipment_Needed: "", // dropdown options
//     In_House_Large_Equipment_Needed: "", // dropdown options
//     In_house_equipment: "", // dropdown options
//     Any_obstruction_in_the_install_area: "", // dropdown options
//     Rental_Equipment: "", // dropdown options
//     TYPE_OF_WALL_SURFACE_BEING_INSTALLED: "", // dropdown options
//     Whta_type_of_Hardware_Specific: "", // textbox
//     URL_Link1: "", // textbox
//     URL_Link2: "", // textbox
//     Preferred_Date_1: "", // datepicker
//     Preferred_Date_2: "", // datepicker
//     Preferred_Time: "", // dropdown options
//     Is_Hardware_Needed: "", // dropdown options
//     Hardware_Grade: "", // dropdown options
//     Appprox_fabrication_time_Hours: "", // number
//     How_many_installers_needed2: "", // number
//     Number_of_Visits_needed: "", // textbox
//     Estimated_hours_of_travel: "", // number
//     Estimated_hours_on_site: "", // number
//     Production_due_date: "", // datepicker
//     Fabrication_due_date: "", // datepicker
//     Installation_due_date: "", // datepicker
//   });

//   // Initialize form with estimate data

//   useEffect(() => {
//     if (!estimateData) return;
//     const initialFormData = {
//       quoteDate: estimateData.SO_Date || new Date(),
//       quoteName: estimateData.SO_name || "",
//       crmAccountName: estimateData.CRM_Account_Name,
//       postProduction: estimateData.Post_production || "",
//       leadTime: estimateData.Lead_time_from_approval_Business_Days || "",
//       taxRate: estimateData.Tax_rate || "",
//       locationName: estimateData.Widget_Location_Name,
//       poNumber: estimateData.PO_Number || "",
//       salesperson: estimateData.Salesperson || "",
//       vendorNumber: estimateData.Vendor_Number || "",
//       crmContactName: estimateData.Widget_CRM_Contact_Name || "",
//       hasCustomerPo: estimateData.Did_customer_provide_a_customer_PO || "",
//       privateNotes: estimateData.Private_Notes_RT || "",
//       publicNotes: estimateData.Notes_Public_RT || "",
//       isHotJob: estimateData.Is_Hot_Job || "",
//       billingAddress: {
//         street: estimateData.Bill_To?.address_line_1,
//         city: estimateData.Bill_To?.district_city,
//         state: estimateData.Bill_To?.state_province,
//         zip: estimateData.Bill_To?.postal_Code,
//       },
//       shippingAddress: {
//         street: estimateData.Ship_To?.address_line_1,
//         city: estimateData.Ship_To?.district_city,
//         state: estimateData.Ship_To?.state_province,
//         zip: estimateData.Ship_To?.postal_Code,
//       },
//       crmAccountNameString: estimateData.CRM_Account_Name_String,
//       salespersonName: estimateData.SalespersonName,
//       isDesignProofNeeded: estimateData.is_Design_Proof_needed,
//       approvedOn: estimateData.Approved_On,
//       commitmentDate: estimateData.Our_Commitment_Date,
//       customerDueDate: estimateData.Customer_due_date,
//       ///////////////////////////////////////////////////////
//       Delivery_address: estimateData.Delivery_address || {
//         address_line_1: "",
//         address_line_2: "",
//         district_city: "",
//         state_province: "",
//         postal_Code: "",
//       },
//       Desired_delivery_date: estimateData.Desired_delivery_date
//         ? formatDate(estimateData.Desired_delivery_date)
//         : null,

//       Vehicle_number: estimateData.Vehicle_number || "",
//       Delivery_Address_rented_truck:
//         estimateData.Delivery_Address_rented_truck || {
//           address_line_1: "",
//           address_line_2: "",
//           district_city: "",
//           state_province: "",
//           postal_Code: "",
//         },
//       Desired_delivery_date_Rented_truck:
//         estimateData.Desired_delivery_date_Rented_truck
//           ? formatDate(estimateData.Desired_delivery_date_Rented_truck)
//           : null,

//       Do_we_know_who_is_picking_up: estimateData.Do_we_know_who_is_picking_up,
//       Name: estimateData.Name,
//       Do_we_know_when_will_customer_pickup:
//         estimateData.Do_we_know_when_will_customer_pickup,
//       PickUp_Date: estimateData.PickUp_Date
//         ? formatDate(estimateData.PickUp_Date)
//         : null,

//       Ship_to_address: estimateData.Ship_to_address || {
//         address_line_1: "",
//         address_line_2: "",
//         district_city: "",
//         state_province: "",
//       },
//       Where_will_it_ship_from: estimateData.Where_will_it_ship_from,
//       Need_Multiple_Locations_Dropship:
//         estimateData.Need_Multiple_Locations_Dropship,

//       Our_Account: estimateData.Our_Account,
//       Next_day_shipment_needed: estimateData.Next_day_shipment_needed,
//       Regular_Ground_shipment: estimateData.Regular_Ground_shipment,
//       Charge_normal_markup: estimateData.Charge_normal_markup,
//       Account_Numer: estimateData.Account_Numer,
//       Need_Multiple_Locations_Send_UPS_Our_Account:
//         estimateData.Need_Multiple_Locations_Send_UPS_Our_Account,

//       Customer_account: estimateData.Customer_account,
//       Need_Multiple_Locations_Send_UPS_customer:
//         estimateData.Need_Multiple_Locations_Send_UPS_customer,
//       Date_of_freight_pickup_required_to_meet_customer_due_date:
//         estimateData.Date_of_freight_pickup_required_to_meet_customer_due_date
//           ? formatDate(
//               estimateData.Date_of_freight_pickup_required_to_meet_customer_due_date
//             )
//           : null,

//       Pallet_size_needed_provide_estimate:
//         estimateData.Pallet_size_needed_provide_estimate,
//       Who_will_arrange_freight_pickup:
//         estimateData.Who_will_arrange_freight_pickup,
//       What_is_customer_account_number_to_charge_for_shipping_amount:
//         estimateData.What_is_customer_account_number_to_charge_for_shipping_amount,

//       Type_of_Work_Needed: estimateData.Type_of_Work_Needed,
//       Install_Summary_of_Work: estimateData.Install_Summary_of_Work,
//       Manufacture_Type: estimateData.Manufacture_Type,
//       Miss_DIG_required1: estimateData.Miss_DIG_required1,
//       Install_type: estimateData.Install_type,
//       Sign_Permit_Required: estimateData.Sign_Permit_Required,
//       Electrical_Permit_Required: estimateData.Electrical_Permit_Required,
//       Electrical_Connection_Made_by_Us:
//         estimateData.Electrical_Connection_Made_by_Us,
//       Has_the_wall_recently_been_painted:
//         estimateData.Has_the_wall_recently_been_painted,
//       What_floor_s_will_Signage_be_installed:
//         estimateData.What_floor_s_will_Signage_be_installed,
//       Is_There_a_Working_Elevator_Available:
//         estimateData.Is_There_a_Working_Elevator_Available,
//       Is_Rental_Equipment_Needed: estimateData.Is_Rental_Equipment_Needed,
//       In_House_Large_Equipment_Needed:
//         estimateData.In_House_Large_Equipment_Needed,
//       In_house_equipment: estimateData.In_house_equipment,
//       Any_obstruction_in_the_install_area:
//         estimateData.Any_obstruction_in_the_install_area,
//       Rental_Equipment: estimateData.Rental_Equipment,
//       TYPE_OF_WALL_SURFACE_BEING_INSTALLED:
//         estimateData.TYPE_OF_WALL_SURFACE_BEING_INSTALLED,
//       Whta_type_of_Hardware_Specific:
//         estimateData.Whta_type_of_Hardware_Specific,
//       URL_Link1: estimateData.URL_Link1,
//       URL_Link2: estimateData.URL_Link2,
//       Preferred_Date_1: estimateData.Preferred_Date_1
//         ? formatDate(estimateData.Preferred_Date_1)
//         : null,
//       Preferred_Date_2: estimateData.Preferred_Date_2
//         ? formatDate(estimateData.Preferred_Date_2)
//         : null,
//       Preferred_Time: estimateData.Preferred_Time,
//       Is_Hardware_Needed: estimateData.Is_Hardware_Needed,
//       Hardware_Grade: estimateData.Hardware_Grade,
//       Appprox_fabrication_time_Hours:
//         estimateData.Appprox_fabrication_time_Hours,
//       How_many_installers_needed2: estimateData.How_many_installers_needed2,
//       Number_of_Visits_needed: estimateData.Number_of_Visits_needed,
//       Estimated_hours_of_travel: estimateData.Estimated_hours_of_travel,
//       Estimated_hours_on_site: estimateData.Estimated_hours_on_site,
//       Production_due_date: estimateData.Production_due_date
//         ? formatDate(estimateData.Production_due_date)
//         : null,
//       Fabrication_due_date: estimateData.Fabrication_due_date
//         ? formatDate(estimateData.Fabrication_due_date)
//         : null,
//       Installation_due_date: estimateData.Installation_due_date
//         ? formatDate(estimateData.Installation_due_date)
//         : null,
//     };

//     setFormData((prev) =>
//       shallowEqual(prev, initialFormData) ? prev : initialFormData
//     );

//     fetchAccountDetails(
//       estimateData.CRM_Account_Name,
//       estimateData.Shipping_Name
//     );
//   }, [estimateData]);

//   const fetchAccountDetails = async (accountId, estimateAddress) => {
//     console.log(accountId, "-", estimateAddress);
//     setLoadingAccountDetails(true);
//     try {
//       // Fetch the account details
//       const accountResponse = await window.ZOHO.CRM.API.getRecord({
//         Entity: "Accounts",
//         RecordID: accountId,
//       });
//       const accountData = accountResponse.data[0];

//       if (!estimateAddress) {
//         // Update formData with vendor number
//         setFormData((prev) => ({
//           ...prev,
//           vendorNumber: accountData.Vendor_number || "",
//         }));
//       }

//       const addressData = [];

//       // Fetch contacts
//       const contactsResponse = await window.ZOHO.CRM.API.getRelatedRecords({
//         Entity: "Accounts",
//         RecordID: accountId,
//         RelatedList: "Contacts",
//       });

//       if (
//         !contactsResponse ||
//         !contactsResponse.data ||
//         !Array.isArray(contactsResponse.data)
//       ) {
//         console.warn("No contacts data found or invalid response structure");
//         setNewContactOptions([]); // Set empty array if no data
//       } else {
//         setNewContactOptions(
//           contactsResponse.data
//             .filter((contact) => contact.First_Name || contact.Last_Name)
//             .map((contact) => ({
//               value: `${contact.First_Name || ""} ${
//                 contact.Last_Name || ""
//               }`.trim(),
//               label: `${contact.First_Name || ""} ${
//                 contact.Last_Name || ""
//               }`.trim(),
//             }))
//         );
//       }

//       // 1. Get the main account address
//       const mainAddress = {
//         name: accountData?.Account_Name,
//         Billing_Street: accountData?.Billing_Street,
//         Billing_City: accountData?.Billing_City,
//         Billing_State: accountData?.Billing_State,
//         Billing_Code: accountData?.Billing_Code,
//         Shipping_Street: accountData?.Shipping_Street,
//         Shipping_City: accountData?.Shipping_City,
//         Shipping_State: accountData?.Shipping_State,
//         Shipping_Code: accountData?.Shipping_Code,
//       };

//       // Add the main address to the address data
//       addressData.push(mainAddress);
//       if (!estimateAddress) {
//         // Update formData with the main address details
//         setFormData((prev) => ({
//           ...prev,
//           locationName: accountData?.Account_Name || "",
//           billingAddress: {
//             street: accountData?.Billing_Street || "",
//             city: accountData?.Billing_City || "",
//             state: accountData?.Billing_State || "",
//             zip: accountData?.Billing_Code || "",
//           },
//           shippingAddress: {
//             street: accountData?.Shipping_Street || "",
//             city: accountData?.Shipping_City || "",
//             state: accountData?.Shipping_State || "",
//             zip: accountData?.Shipping_Code || "",
//           },
//         }));
//       }
//       // Fetch addresses
//       const addressesResponse = await window.ZOHO.CRM.API.getRelatedRecords({
//         Entity: "Accounts",
//         RecordID: accountId,
//         RelatedList: "Address",
//       });

//       if (
//         addressesResponse &&
//         addressesResponse.data &&
//         Array.isArray(addressesResponse.data)
//       ) {
//         addressesResponse.data.forEach((address) => {
//           if (
//             address.Name ||
//             address.Billing_Street ||
//             address.Shipping_Street
//           ) {
//             addressData.push({
//               name: address.Name || "",
//               Billing_Street: address.Billing_Street || "",
//               Billing_City: address.Billing_City || "",
//               Billing_State: address.Billing_State || "",
//               Billing_Code: address.Billing_Code || "",
//               Shipping_Street: address.Shipping_Street || "",
//               Shipping_City: address.Shipping_City || "",
//               Shipping_State: address.Shipping_State || "",
//               Shipping_Code: address.Shipping_Code || "",
//             });
//           }
//         });
//       } else {
//         console.warn("No valid addresses data found in response");
//       }

//       setFetchedData(addressData);

//       // Set the selected address based on the estimate address if provided
//       if (estimateAddress) {
//         const selectedAddr = addressData.find(
//           (addr) => addr.name === estimateAddress
//         );
//         console.log(selectedAddr);
//         if (selectedAddr) {
//           setSelectedAddress(selectedAddr);
//         }
//       } else {
//         setSelectedAddress(mainAddress); // Use main address by default
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to load account details");
//     } finally {
//       setLoadingAccountDetails(false);
//     }
//   };

//   // Items section
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       Item: "",
//       Qty: "",
//       Unit: "",
//       Description_Rich_Text: "",
//       Product_Type1: "",
//       Piece_cost: "",
//       Margin: "",
//       piecePrice: "0.00",
//       amount: "0.00",
//       isPieceCostFocused: false,
//       isMarkupFocused: false,
//       Product_Type_Name: "",
//     },
//   ]);

//   // Initialize items with estimate data
//   useEffect(() => {
//     if (!estimateData?.Item_Details?.length) return;
//     const newItems = estimateData.Item_Details.map((item) => ({
//       id: item.id || Math.random().toString(36).substr(2, 9),
//       Item: item.Item || "",
//       Qty: item.Qty || "",
//       Unit: item.Unit || "",
//       Description_Rich_Text: item.Description_Rich_Text || "",
//       Product_Type1: item.Product_Type1 || "",
//       Piece_cost: item.Piece_cost || "",
//       Margin: item.Margin || "",
//       piecePrice: item.piecePrice || "0.00",
//       amount: item.amount || "0.00",
//       isPieceCostFocused: false,
//       isMarkupFocused: false,
//       Product_Type_Name: item.Product_Type_Name,
//     }));

//     setItems((prev) => (shallowEqual(prev, newItems) ? prev : newItems));
//   }, [estimateData?.Item_Details]);

//   // Reference URLs
//   const [referenceUrls, setReferenceUrls] = useState([
//     { id: 1, url: "", description: "" },
//   ]);

//   // Initialize reference URLs
//   useEffect(() => {
//     if (!estimateData?.Reference_URL?.length) return;

//     const newUrls = estimateData.Reference_URL.map((url, index) => ({
//       id: index + 1,
//       url: url.Url?.url || "",
//       description: url.Description || "",
//     }));

//     setReferenceUrls((prev) => (shallowEqual(prev, newUrls) ? prev : newUrls));
//   }, [estimateData?.Reference_URL]);
//   const addNewReferenceUrl = () => {
//     setReferenceUrls([
//       ...referenceUrls,
//       {
//         id: referenceUrls.length + 1,
//         url: "",
//         description: "",
//       },
//     ]);
//   };
//   // Accounting summary
//   useEffect(() => {
//     if (estimateData && estimateData.Accounting_Summary) {
//       setAccountingSummary(prevSummary => ({
//         ...prevSummary,
//         downPaymentPercent: estimateData.Accounting_Summary.downPaymentPercent,
//         // Update other properties from estimateData here if needed
//       }));
//     }
//   }, [estimateData]);
//   const [accountingSummary, setAccountingSummary] = useState({
//     totalCost: 0,
//     subTotal: 0,
//     jobProfit: 0,
//     jobProfitPercent: 0,
//     salesTax: 0,
//     total: 0,
//     pastDue: 0,
//     downPaymentPercent: 0,
//     downPaymentAmount: 0,
//     creditLimit: 0,
//     balanceDue: 0,
//     totalReceivable: 0,
//   });

//   // Calculate derived values
//   const calculateDerivedValues = (items, taxRate, downPaymentPercent) => {
//     const updatedItems = items.map((item) => {
//       const Piece_cost = parseFloat(item.Piece_cost) || 0;
//       const Margin = parseFloat(item.Margin) || 0;
//       const qty = parseFloat(item.Qty) || 0;

//       const piecePrice = Piece_cost * (1 + Margin / 100);
//       const amount = piecePrice * qty;

//       return {
//         ...item,
//         piecePrice: piecePrice.toFixed(2),
//         amount: amount.toFixed(2),
//       };
//     });

//     // Calculate summary values
//     let subTotal = 0;
//     let totalCost = 0;
//     let taxableAmount = 0;

//     updatedItems.forEach((item) => {
//       const amount = parseFloat(item.amount) || 0;
//       const itemCost =
//         (parseFloat(item.Piece_cost) || 0) * (parseFloat(item.Qty) || 0);

//       subTotal += amount;
//       totalCost += itemCost;

//       if (taxRate === "6%") {
//         const productType = productTypeOptions.find(
//           (pt) => pt.value === item.Product_Type1
//         );
//         if (productType?.taxable) {
//           taxableAmount += amount;
//         }
//       }
//     });

//     // Calculate sales tax
//     const salesTax = taxRate === "6%" ? taxableAmount * 0.06 : 0;

//     const total = subTotal + salesTax;
//     const jobProfit = subTotal - totalCost;
//     const jobProfitPercent = subTotal > 0 ? (jobProfit / subTotal) * 100 : 0;
//     const downPaymentAmount =
//       downPaymentPercent > 0 ? (total * downPaymentPercent) / 100 : 0;
//     const balanceDue = total - downPaymentAmount;

//     return {
//       items: updatedItems,
//       summary: {
//         totalCost: totalCost.toFixed(2),
//         subTotal: subTotal.toFixed(2),
//         jobProfit: jobProfit.toFixed(2),
//         jobProfitPercent: jobProfitPercent.toFixed(2),
//         salesTax: salesTax.toFixed(2),
//         total: total.toFixed(2),
//         downPaymentAmount: downPaymentAmount.toFixed(2),
//         balanceDue: balanceDue.toFixed(2),
//         totalReceivable: total.toFixed(2),
//         taxableAmount: taxableAmount.toFixed(2),
//       },
//     };
//   };
//   const productTypeOptions = useMemo(
//     () =>
//       data?.allProductTypes?.data?.map((type) => ({
//         value: type.ID,
//         label: type.Type_field,
//         taxable: type.Taxable === "true",
//       })) || [],
//     [data?.allProductTypes?.data]
//   );
//   // Memoize calculations
//   const derivedValues = useMemo(() => {
//     return calculateDerivedValues(
//       items,
//       formData.taxRate,
//       accountingSummary.downPaymentPercent
//     );
//   }, [
//     items,
//     formData.taxRate,
//     accountingSummary.downPaymentPercent,
//     forceUpdate,
//   ]);

//   // Update accounting summary
//   useEffect(() => {
//     setAccountingSummary((prev) => ({
//       ...prev,
//       ...derivedValues.summary,
//     }));
//   }, [derivedValues.summary]);

//   // Dropdown options
//   const taxRateOptions = [
//     { value: "0%", label: "0%" },
//     { value: "6%", label: "6%" },
//   ];

//   const hasCustomerPoOptions = [
//     { value: "Yes", label: "Yes" },
//     { value: "No", label: "No" },
//   ];
//   const designProofOptions = [
//     { value: "Yes", label: "Yes" },
//     { value: "No", label: "No" },
//   ];
//   const postProductionOptions = [
//     { value: "We Deliver (Our Vehicle)", label: "We Deliver (Our Vehicle)" },
//     { value: "We Deliver (Rented Truck)", label: "We Deliver (Rented Truck)" },
//     { value: "Customer Pickup", label: "Customer Pickup" },
//     { value: "Dropship", label: "Dropship" },
//     {
//       value: "Send UPS/Fedex (Our Account)",
//       label: "Send UPS/Fedex (Our Account)",
//     },
//     { value: "Freight Delivery", label: "Freight Delivery" },
//     { value: "Install", label: "Install" },
//     { value: "Unknown", label: "Unknown" },
//   ];
//   const salesTeam = useMemo(
//     () =>
//       data?.allEmployees?.data
//         ?.filter((employee) => employee.Profile?.zc_display_value === "Sales")
//         ?.map((employee) => ({
//           value: employee.ID,
//           label:
//             employee.Name_SL ||
//             `${employee.Name?.first_name} ${employee.Name?.last_name}`.trim(),
//         })) || [],
//     [data?.allEmployees?.data]
//   );

//   const unitOptions = [
//     "Box",
//     "Each",
//     "Feet",
//     "Pieces",
//     "Sheet",
//     "Sq Feet",
//     "Units",
//   ];

//   // Form handlers
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDateChange = (date) => {
//     if (!date || isNaN(new Date(date).getTime())) {
//       toast.error("Invalid date selected");
//       return;
//     }
//     setFormData((prev) => ({
//       ...prev,
//       quoteDate: date,
//     }));
//   };

//   // Item handlers
//   const addNewItem = () => {
//     setItems((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         Item: "",
//         Qty: "",
//         Unit: "",
//         Description_Rich_Text: "",
//         Product_Type1: "",
//         Piece_cost: "",
//         Margin: "",
//         piecePrice: "0.00",
//         amount: "0.00",
//         isPieceCostFocused: false,
//         isMarkupFocused: false,
//       },
//     ]);
//   };

//   const removeItem = (id) => {
//     setItems(items.filter((item) => item.id !== id));
//   };

//   // Handler for Product Type change
//   const handleProductTypeChange = (id, value) => {
//     const selectedProductType = productTypeOptions.find(
//       (option) => option.value === value
//     );
//     setItems(
//       items.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               Product_Type1: value,
//               Product_Type_Name: selectedProductType?.label || "",
//             }
//           : item
//       )
//     );
//     // Force recalculation by updating a dummy state
//     setForceUpdate((prev) => !prev); // Add this state at the top: const [forceUpdate, setForceUpdate] = useState(false);
//   };

//   const handlePieceCostChange = (id, value) => {
//     setItems((prev) => {
//       return prev.map((item) => {
//         if (item.id === id) {
//           const Piece_cost = parseFloat(value) || 0;
//           const Margin = parseFloat(item.Margin) || 0;
//           const qty = parseFloat(item.Qty) || 0;
//           const piecePrice = Piece_cost * (1 + Margin / 100);
//           const amount = piecePrice * qty;

//           return {
//             ...item,
//             Piece_cost: value,
//             piecePrice: piecePrice.toFixed(2),
//             amount: amount.toFixed(2),
//           };
//         }
//         return item;
//       });
//     });
//   };

//   const handleMarkupChange = (id, value) => {
//     setItems((prev) => {
//       return prev.map((item) => {
//         if (item.id === id) {
//           const Piece_cost = parseFloat(item.Piece_cost) || 0;
//           const Margin = parseFloat(value) || 0;
//           const qty = parseFloat(item.Qty) || 0;
//           const piecePrice = Piece_cost * (1 + Margin / 100);
//           const amount = piecePrice * qty;

//           return {
//             ...item,
//             Margin: value,
//             piecePrice: piecePrice.toFixed(2),
//             amount: amount.toFixed(2),
//           };
//         }
//         return item;
//       });
//     });
//   };

//   const handleQtyChange = (id, value) => {
//     setItems((prev) => {
//       return prev.map((item) => {
//         if (item.id === id) {
//           const Piece_cost = parseFloat(item.Piece_cost) || 0;
//           const Margin = parseFloat(item.Margin) || 0;
//           const qty = parseFloat(value) || 0;
//           const piecePrice = Piece_cost * (1 + Margin / 100);
//           const amount = piecePrice * qty;

//           return {
//             ...item,
//             Qty: value,
//             piecePrice: piecePrice.toFixed(2),
//             amount: amount.toFixed(2),
//           };
//         }
//         return item;
//       });
//     });
//   };

//   const handleMarkupBlur = (id) => {
//     setItems(
//       items.map((item) =>
//         item.id === id ? { ...item, isMarkupFocused: false } : item
//       )
//     );
//   };
//   const handlePieceCostFocus = (id) => {
//     setItems(
//       items.map((item) =>
//         item.id === id ? { ...item, isPieceCostFocused: true } : item
//       )
//     );
//   };

//   const handlePieceCostBlur = (id) => {
//     setItems(
//       items.map((item) =>
//         item.id === id ? { ...item, isPieceCostFocused: false } : item
//       )
//     );
//   };

//   const handleMarkupFocus = (id) => {
//     setItems(
//       items.map((item) =>
//         item.id === id ? { ...item, isMarkupFocused: true } : item
//       )
//     );
//   };
//   // Notes editors
//   const [showPublicNotes, setShowPublicNotes] = useState(false);
//   const [showPrivateNotes, setShowPrivateNotes] = useState(false);
//   const [openDescriptionEditorId, setOpenDescriptionEditorId] = useState(null);

//   const editorPrivate = useRef(null);
//   const editorPublic = useRef(null);

//   const config = useMemo(
//     () => ({
//       readonly: false,
//       placeholder: "Start typings...",
//       height: "600px",
//       showCharsCounter: false,
//       showWordsCounter: false,
//       showXPathInStatusbar: false,
//       removeButtons: ["file", "speechRecognize"],
//     }),
//     [placeholder]
//   );

//   const handlePrivateNotesChange = (newContent) => {
//     setFormData((prev) => ({
//       ...prev,
//       privateNotes: newContent,
//     }));
//   };

//   const handlePublicNotesChange = (newContent) => {
//     setFormData((prev) => ({
//       ...prev,
//       publicNotes: newContent,
//     }));
//   };

//   const handleOpenDescriptionEditor = (id) => {
//     setOpenDescriptionEditorId(id);
//   };

//   const handleCloseDescriptionEditor = () => {
//     setOpenDescriptionEditorId(null);
//   };

//   const handleDescriptionChange = (id, newContent) => {
//     setItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, Description_Rich_Text: newContent } : item
//       )
//     );
//   };

//   // Down payment handler
//   const handleDownPaymentChange = (e) => {
//     const value = parseFloat(e.target.value) || 0;
//     setAccountingSummary((prev) => ({
//       ...prev,
//       downPaymentPercent: value,
//     }));
//   };

//   // Attachments
//   const [customerAttachments, setCustomerAttachments] = useState([]);
//   const attachmentFileInputRefs = useRef([]);

//   const addNewCustomerAttachment = () => {
//     setCustomerAttachments((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         file: null,
//         fileDescription: "",
//       },
//     ]);
//   };

//   const removeCustomerAttachment = (id) => {
//     setCustomerAttachments((prev) =>
//       prev.filter((attachment) => attachment.id !== id)
//     );
//   };

//   const handleCustomerAttachmentFileChange = (id, event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File size must be less than 5MB");
//       return;
//     }
//     setCustomerAttachments((prev) =>
//       prev.map((attachment) =>
//         attachment.id === id
//           ? {
//               ...attachment,
//               file,
//               fileName: file.name, // Update fileName when file changes
//             }
//           : attachment
//       )
//     );
//   };

//   const handleCustomerAttachmentFileClick = (index) => {
//     attachmentFileInputRefs.current[index]?.click();
//   };

//   const [privateAttachments, setPrivateAttachments] = useState([]);
//   const privateAttachmentFileInputRefs = useRef([]);

//   const addNewPrivateAttachment = () => {
//     setPrivateAttachments((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         file: null,
//         fileDescription: "",
//       },
//     ]);
//   };

//   const removePrivateAttachment = (id) => {
//     setPrivateAttachments((prev) =>
//       prev.filter((attachment) => attachment.id !== id)
//     );
//   };

//   const handlePrivateAttachmentFileChange = (id, event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File size must be less than 5MB");
//       return;
//     }
//     setPrivateAttachments((prev) =>
//       prev.map((attachment) =>
//         attachment.id === id
//           ? {
//               ...attachment,
//               file,
//               fileName: file.name, // Update fileName when file changes
//             }
//           : attachment
//       )
//     );
//   };

//   const handlePrivateAttachmentFileClick = (index) => {
//     privateAttachmentFileInputRefs.current[index]?.click();
//   };

//   // Form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log(formData);
//     console.log(items);
//     console.log(customerAttachments);
//     console.log(privateAttachments);
//     console.log(referenceUrls);

//     const requiredFields = {
//       quoteName: "SO Name",
//       postProduction: "Post Production",
//       taxRate: "Tax Rate",
//     };

//     const missingFields = Object.entries(requiredFields)
//       .filter(([field]) => !formData[field])
//       .map(([_, name]) => name);

//     if (missingFields.length > 0) {
//       toast.error(`Missing required fields: ${missingFields.join(", ")}`);
//       return;
//     }

//     setEditSpinner(true);
//     const refURLS = referenceUrls
//       .map((item) => {
//         if (item.url) {
//           return { Url: { url: item.url }, Description: item.description };
//         }
//         return null;
//       })
//       .filter((item) => item !== null);

//     // Create the complete data object
//     const createCompleteData = (formData) => {
//       const baseData = {
//         // ... Main fields
//         ID:estimateData.ID,
//         Salesorder:estimateData.Salesorder,
//         Tax_rate: formData.taxRate,
//         SO_name: formData.quoteName,
//         Status: "Draft",
//         Source: "Widget",
//         Post_production: formData.postProduction,
//         CRM_Account_Name: formData.crmAccountName,
//         Lead_time_from_approval_Business_Days: formData.leadTime,
//         Salesperson_Lookup: formData.salesperson,
//         SO_Date: formatDate(formData.quoteDate),
//         Widget_CRM_Contact_Name: formData.crmContactName,
//         Widget_Location_Name: formData.locationName,
//         Vendor_Number: formData.vendorNumber,
//         Down_Payment: accountingSummary.downPaymentPercent,
//         Shipping_Name: formData.locationName,
//         Billing_Name: formData.crmAccountNameString || "",
//         Did_customer_provide_a_customer_PO: formData.hasCustomerPo,
//         PO_Number: formData.poNumber,
//         Ship_To: {
//           address_line_1: formData.shippingAddress.street,
//           district_city: formData.shippingAddress.city,
//           state_province: formData.shippingAddress.state,
//           postal_Code: formData.shippingAddress.zip,
//         },
//         Bill_To: {
//           address_line_1: formData.billingAddress.street,
//           postal_Code: formData.billingAddress.zip,
//           district_city: formData.billingAddress.city,
//           state_province: formData.billingAddress.state,
//         },
//         Notes_Public_RT: formData.publicNotes,
//         Private_Notes_RT: formData.privateNotes,
//         Is_Hot_Job: formData.isHotJob,
//         Item_Details: items,
//         Reference_URL: refURLS,
//         Accounting_Summary: accountingSummary,
//         Customer_Attachments: customerAttachments.map((att) => ({
//           file: att.file,
//           fileDescription: att.fileDescription,
//           fileName: att.fileName,
//         })),
//         Private_Attachments: privateAttachments.map((att) => ({
//           file: att.file,
//           fileDescription: att.fileDescription,
//           fileName: att.fileName,
//         })),
//         CRM_Account_Name_String: formData.crmAccountNameString,
//         SalespersonName: formData.salespersonName,
//         is_Design_Proof_needed: formData.isDesignProofNeeded,
//         Approved_On: formData.approvedOn ? formatDate(formData.approvedOn) : "",
//         Our_Commitment_Date: formData.commitmentDate
//           ? formatDate(formData.commitmentDate)
//           : "",
//         Customer_due_date: formData.customerDueDate
//           ? formatDate(formData.customerDueDate)
//           : "",
//       };

//       // Conditionally add fields based on Post_production
//       switch (formData.postProduction) {
//         case "We Deliver (Our Vehicle)":
//           return {
//             ...baseData,
//             Delivery_address: formData.Delivery_address,
//             Desired_delivery_date: formData.Desired_delivery_date
//               ? formatDate(formData.Desired_delivery_date)
//               : "",
//           };

//         case "We Deliver (Rented Truck)":
//           return {
//             ...baseData,
//             Vehicle_number: formData.Vehicle_number,
//             Delivery_Address_rented_truck:
//               formData.Delivery_Address_rented_truck,
//             Desired_delivery_date_Rented_truck:
//               formData.Desired_delivery_date_Rented_truck
//                 ? formatDate(formData.Desired_delivery_date_Rented_truck)
//                 : "",
//           };

//         case "Customer Pickup":
//           return {
//             ...baseData,
//             Do_we_know_who_is_picking_up: formData.Do_we_know_who_is_picking_up,
//             Name: formData.Name,
//             Do_we_know_when_will_customer_pickup:
//               formData.Do_we_know_when_will_customer_pickup,
//             PickUp_Date: formData.PickUp_Date
//               ? formatDate(formData.PickUp_Date)
//               : "",
//           };

//         case "Dropship":
//           return {
//             ...baseData,
//             Ship_to_address: formData.Ship_to_address,
//             Where_will_it_ship_from: formData.Where_will_it_ship_from,
//             Need_Multiple_Locations_Dropship:
//               formData.Need_Multiple_Locations_Dropship,
//           };

//         case "Send UPS/Fedex (Our Account)":
//           return {
//             ...baseData,
//             Our_Account: formData.Our_Account,
//             Next_day_shipment_needed: formData.Next_day_shipment_needed,
//             Regular_Ground_shipment: formData.Regular_Ground_shipment,
//             Charge_normal_markup: formData.Charge_normal_markup,
//             Account_Numer: formData.Account_Numer,
//             Need_Multiple_Locations_Send_UPS_Our_Account:
//               formData.Need_Multiple_Locations_Send_UPS_Our_Account,
//           };

//         case "Send UPS/Fedex (Customer Account)":
//           return {
//             ...baseData,
//             Customer_account: formData.Customer_account,
//             Need_Multiple_Locations_Send_UPS_customer:
//               formData.Need_Multiple_Locations_Send_UPS_customer,
//             Date_of_freight_pickup_required_to_meet_customer_due_date:
//               formData.Date_of_freight_pickup_required_to_meet_customer_due_date
//                 ? formatDate(
//                     formData.Date_of_freight_pickup_required_to_meet_customer_due_date
//                   )
//                 : "",
//           };

//         case "Freight Delivery":
//           return {
//             ...baseData,
//             Pallet_size_needed_provide_estimate:
//               formData.Pallet_size_needed_provide_estimate,
//             Who_will_arrange_freight_pickup:
//               formData.Who_will_arrange_freight_pickup,
//             What_is_customer_account_number_to_charge_for_shipping_amount:
//               formData.What_is_customer_account_number_to_charge_for_shipping_amount,
//           };

//         case "Install":
//           return {
//             ...baseData,
//             Type_of_Work_Needed: formData.Type_of_Work_Needed,
//             Install_Summary_of_Work: formData.Install_Summary_of_Work,
//             Manufacture_Type: formData.Manufacture_Type,
//             Miss_DIG_required1: formData.Miss_DIG_required1,
//             Install_type: formData.Install_type,
//             Sign_Permit_Required: formData.Sign_Permit_Required,
//             Electrical_Permit_Required: formData.Electrical_Permit_Required,
//             Electrical_Connection_Made_by_Us:
//               formData.Electrical_Connection_Made_by_Us,
//             Has_the_wall_recently_been_painted:
//               formData.Has_the_wall_recently_been_painted,
//             What_floor_s_will_Signage_be_installed:
//               formData.What_floor_s_will_Signage_be_installed,
//             Is_There_a_Working_Elevator_Available:
//               formData.Is_There_a_Working_Elevator_Available,
//             Is_Rental_Equipment_Needed: formData.Is_Rental_Equipment_Needed,
//             In_House_Large_Equipment_Needed:
//               formData.In_House_Large_Equipment_Needed,
//             In_house_equipment: formData.In_house_equipment,
//             Any_obstruction_in_the_install_area:
//               formData.Any_obstruction_in_the_install_area,
//             Rental_Equipment: formData.Rental_Equipment,
//             TYPE_OF_WALL_SURFACE_BEING_INSTALLED:
//               formData.TYPE_OF_WALL_SURFACE_BEING_INSTALLED,
//             Whta_type_of_Hardware_Specific:
//               formData.Whta_type_of_Hardware_Specific,
//             URL_Link1: formData.URL_Link1,
//             URL_Link2: formData.URL_Link2,
//             Preferred_Date_1: formData.Preferred_Date_1
//               ? formatDate(formData.Preferred_Date_1)
//               : "",
//             Preferred_Date_2: formData.Preferred_Date_2
//               ? formatDate(formData.Preferred_Date_2)
//               : "",
//             Preferred_Time: formData.Preferred_Time,
//             Is_Hardware_Needed: formData.Is_Hardware_Needed,
//             Hardware_Grade: formData.Hardware_Grade,
//             Appprox_fabrication_time_Hours:
//               formData.Appprox_fabrication_time_Hours,
//             How_many_installers_needed2: formData.How_many_installers_needed2,
//             Number_of_Visits_needed: formData.Number_of_Visits_needed,
//             Estimated_hours_of_travel: formData.Estimated_hours_of_travel,
//             Estimated_hours_on_site: formData.Estimated_hours_on_site,
//             Production_due_date: formData.Production_due_date
//               ? formatDate(formData.Production_due_date)
//               : "",
//             Fabrication_due_date: formData.Fabrication_due_date
//               ? formatDate(formData.Fabrication_due_date)
//               : "",
//             Installation_due_date: formData.Installation_due_date
//               ? formatDate(formData.Installation_due_date)
//               : "",
//           };

//         default:
//           return baseData;
//       }
//     };
//     // Dynamically create the complete data object
//     const completeData = createCompleteData(formData);

//     // Create the payload with Estimate_Json as stringified complete data
//     const payload = {
//       data: {
//         ...completeData, // Spread all the original data
//         Salesorder_JSON: JSON.stringify(completeData), // Add the complete data as JSON string
//       },
//     };
//     console.log("payload", payload);
//     try {
//       const result = await updateEstimate(
//         id,
//         payload,
//         customerAttachments,
//         privateAttachments
//       );
//       if (result.data) {
//         toast.success("Updated successfully!");
//         updateEstimateById(id);
//         navigate("/");
//       } else {
//         console.error("Failed to update estimate:", result);
//         toast.error("Failed to update estimate. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error updating estimate:", error);
//       toast.error("An error occurred while updating the estimate.");
//     } finally {
//       setEditSpinner(false);
//     }
//   };

//   const handleCancel = () => {
//     window.history.back();
//   };

//   //////post product option////////////////////////////
//   const handleDeliveryAddressChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Delivery_address: {
//         ...prev.Delivery_address,
//         [field]: value,
//       },
//     }));
//   };

//   const handleDeliveryDateChange = (date) => {
//     setFormData((prev) => ({
//       ...prev,
//       Desired_delivery_date: date,
//     }));
//   };

//   const handleRentedTruckAddressChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Delivery_Address_rented_truck: {
//         ...prev.Delivery_Address_rented_truck,
//         [field]: value,
//       },
//     }));
//   };

//   const handleRentedTruckDeliveryDateChange = (date) => {
//     setFormData((prev) => ({
//       ...prev,
//       Desired_delivery_date_Rented_truck: date,
//     }));
//   };

//   const handleVehicleNumberChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       Vehicle_number: e.target.value,
//     }));
//   };

//   const handlePickupFieldChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handlePickupDateChange = (date) => {
//     setFormData((prev) => ({
//       ...prev,
//       PickUp_Date: date,
//     }));
//   };

//   const handleShipToAddressChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Ship_to_address: {
//         ...prev.Ship_to_address,
//         [field]: value,
//       },
//     }));
//   };

//   const handleShipFromChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Where_will_it_ship_from: value,
//     }));
//   };

//   const handleMultipleLocationsChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Need_Multiple_Locations_Dropship: value,
//     }));
//   };

//   const handleShippingServiceChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Next_day_shipment_needed: value,
//     }));
//   };

//   const handleRegularGroundChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Regular_Ground_shipment: value,
//     }));
//   };

//   const handleMarkupsChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Charge_normal_markup: value,
//     }));
//   };

//   const handleAccountNumberChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       Account_Numer: e.target.value,
//     }));
//   };

//   const handleMultipleLocationsUPSChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Need_Multiple_Locations_Send_UPS_Our_Account: value,
//     }));
//   };

//   // Handle Customer Account selection (radio buttons)
//   const handleCustomerAccountChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Customer_account: value,
//     }));
//   };

//   // Handle "Need Multiple Locations?" dropdown selection
//   const handleMultipleLocationsCustomerChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Need_Multiple_Locations_Send_UPS_customer: value,
//     }));
//   };

//   // Handle Customer Account Number (Textbox)
//   const handleCustomerAccountNumberChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       What_is_customer_account_number_to_charge_for_shipping_amount:
//         e.target.value,
//     }));
//   };

//   // Handle Pallet Size Estimate (Textbox)
//   const handlePalletSizeChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       Pallet_size_needed_provide_estimate: e.target.value,
//     }));
//   };

//   // Handle Freight Pickup Arrangement (Dropdown)
//   const handleFreightPickupChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       Who_will_arrange_freight_pickup: value,
//     }));
//   };

//   // Handle Datepicker input change
//   const handleFreightPickupDateChange = (date) => {
//     setFormData((prev) => ({
//       ...prev,
//       Date_of_freight_pickup_required_to_meet_customer_due_date: date,
//     }));
//   };

//   // Dropdown Handlers
//   const handleDropdownChange = (field) => (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Textbox Handlers
//   const handleTextChange = (field) => (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: e.target.value,
//     }));
//   };

//   // Number Handlers
//   const handleNumberChange = (field) => (e) => {
//     const value = e.target.value;
//     if (!isNaN(value) || value === "") {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//   };

//   // Datepicker Handlers
//   const handleDateInstallChange = (field) => (date) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: date,
//     }));
//   };

//   if (isLoading || !estimateData) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         Loading estimate data...
//       </div>
//     );
//   }
//   // Render spinner if still loading
//   if (loadingCreatorData) {
//     return <PageSpinner />;
//   }
//   return (
//     <div className="h-[90vh] w-full overflow-y-auto overflow-x-hidden">
//       <form onSubmit={handleSubmit} className="p-6 space-y-4 w-full">
//         <div className="flex flex-col md:flex-row gap-6 w-full mb-8">
//           <div className="">
//             <div>
//               <label className="input-label">
//                 CRM Account <span className="text-red-500">*</span>
//               </label>
//               <AccountDropdown
//                 value={formData.crmAccountName}
//                 initialLabel={formData.crmAccountNameString} // Pass the account name string
//                 onChange={(value, accountName) => {
//                   setFormData((prev) => ({
//                     ...prev,
//                     crmAccountName: value,
//                     crmAccountNameString: accountName || "",
//                   }));
//                   // Call your additional function here
//                   fetchAccountDetails(value);
//                 }}
//                 searchable={true} // Changed from string "true" to boolean true
//                 placeholder="-Select-"
//                 className="w-full"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="input-label">CRM Contact</label>
//               <CustomDropdown
//                 options={newContactOptions}
//                 value={formData.crmContactName}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     crmContactName: value,
//                   }))
//                 }
//                 placeholder="-Select-"
//                 className="w-full"
//                 disabled={loadingAccountDetails}
//               />
//             </div>
//             <div className="mt-4">
//               <label className="input-label">Lead Time From Approval</label>
//               <input
//                 type="number"
//                 name="leadTime"
//                 className="input-box"
//                 value={formData.leadTime}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="mt-4">
//               <label className="input-label">
//                 Post Production <span className="text-red-500">*</span>
//               </label>
//               <CustomDropdown
//                 options={postProductionOptions}
//                 value={formData.postProduction}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     postProduction: value,
//                   }))
//                 }
//                 placeholder="-Select-"
//                 className="w-56"
//               />
//             </div>
//           </div>
//           <div className="">
//             <div>
//               <label className="input-label">
//               SO Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="quoteName"
//                 className="input-box"
//                 value={formData.quoteName}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="mt-4">
//               <label className="input-label">
//                 SO Date <span className="text-red-500">*</span>
//               </label>
//               <DatePicker
//                 selected={formData.quoteDate}
//                 onChange={handleDateChange}
//                 className="input-box"
//                 dateFormat="dd-MMM-yyyy"
//                 placeholderText="-Select-"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="input-label">
//                 Tax Rate <span className="text-red-500">*</span>
//               </label>
//               <CustomDropdown
//                 options={taxRateOptions}
//                 value={formData.taxRate}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     taxRate: value,
//                   }))
//                 }
//                 placeholder="-Select-"
//                 className="w-full"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="input-label">Salesperson</label>
//               <CustomDropdown
//                 options={salesTeam}
//                 value={formData.salesperson}
//                 onChange={(value) => {
//                   const selected = salesTeam.find(
//                     (option) => option.value === value
//                   );
//                   setFormData((prev) => ({
//                     ...prev,
//                     salesperson: value,
//                     salespersonName: selected?.label || "",
//                   }));
//                 }}
//                 placeholder="-Select-"
//                 className="w-full"
//               />
//             </div>
//           </div>
//           <div className="">
//             <div className="">
//               <label className="input-label">
//                 Customer Provide PO# <span className="text-red-500">*</span>
//               </label>
//               <CustomDropdown
//                 options={hasCustomerPoOptions}
//                 value={formData.hasCustomerPo}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     hasCustomerPo: value,
//                   }))
//                 }
//                 placeholder="-Select-"
//                 className="w-full"
//               />
//             </div>
//             {formData.hasCustomerPo === "Yes" && (
//               <div className="mt-4">
//                 <label className="input-label">
//                   PO Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="poNumber"
//                   className="input-box"
//                   value={formData.poNumber}
//                   onChange={handleChange}
//                 />
//               </div>
//             )}
//             <div className="mt-4">
//               <label className="input-label">Vendor Number</label>
//               <input
//                 type="text"
//                 name="vendorNumber"
//                 className="input-box"
//                 value={formData.vendorNumber}
//                 readOnly
//                 onChange={() => {}}
//               />
//             </div>
//             <div className="mt-4">
//               <label className="text-gray-600 mb-2 block text-sm">
//                 Is Hot Job?
//               </label>
//               <div className="flex items-center space-x-4 mt-3">
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="isHotJob"
//                     className="form-radio text-indigo-600 focus:ring-0"
//                     value="Yes"
//                     checked={formData.isHotJob === "Yes"}
//                     onChange={handleChange}
//                   />
//                   <span className="ml-2 text-sm text-gray-600">Yes</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="isHotJob"
//                     className="form-radio text-indigo-600 focus:ring-0"
//                     value="No"
//                     checked={formData.isHotJob === "No"}
//                     onChange={handleChange}
//                   />
//                   <span className="ml-2 text-sm text-gray-600">No</span>
//                 </label>
//               </div>
//             </div>
//           </div>
//           <div className=" ">
//             {/* Add these new fields after the existing ones */}
//             <div className="">
//               <label className="input-label">Is Design Proof Needed?</label>
//               <CustomDropdown
//                 options={designProofOptions}
//                 value={formData.isDesignProofNeeded}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     isDesignProofNeeded: value,
//                   }))
//                 }
//                 placeholder="-Select-"
//                 className="w-full"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="input-label">Approved On</label>
//               <DatePicker
//                 selected={formData.approvedOn}
//                 onChange={(date) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     approvedOn: date,
//                   }))
//                 }
//                 className="input-box"
//                 dateFormat="dd-MMM-yyyy"
//                 placeholderText="-Select-"
//               />
//             </div>

//             <div className="mt-4">
//               <label className="input-label">Commitment Date</label>
//               <DatePicker
//                 selected={formData.commitmentDate}
//                 onChange={(date) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     commitmentDate: date,
//                   }))
//                 }
//                 className="input-box"
//                 dateFormat="dd-MMM-yyyy"
//                 placeholderText="-Select-"
//               />
//             </div>

//             <div className="mt-4">
//               <label className="input-label">Customer Due Date</label>
//               <DatePicker
//                 selected={formData.customerDueDate}
//                 onChange={(date) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     customerDueDate: date,
//                   }))
//                 }
//                 className="input-box"
//                 dateFormat="dd-MMM-yyyy"
//                 placeholderText="-Select-"
//               />
//             </div>
//           </div>
//           <div className="md:w-96">
//             <div className="relative">
//               <label className="text-gray-600 mb-2 block text-sm">
//                 Account Address <span className="text-primary">*</span>
//               </label>
//               <CustomDropdown
//                 options={fetchedData.map((addr) => ({
//                   value: addr.name,
//                   label: addr.name,
//                 }))}
//                 value={selectedAddress?.name || ""}
//                 onChange={handleAddressChange}
//                 placeholder="Select address"
//                 className="w-full"
//                 searchable="true"
//               />
//               {selectedAddress && (
//                 <div className="mt-4 flex items-start gap-16">
//                   <div>
//                     <h2 className="text-sm mb-2 text-gray-400">
//                       BILLING ADDRESS
//                     </h2>
//                     <p className="text-gray-600 text-sm">
//                       {selectedAddress.Billing_Street}
//                       <br />
//                       {selectedAddress.Billing_City},{" "}
//                       {selectedAddress.Billing_State}{" "}
//                       {selectedAddress.Billing_Code}
//                     </p>
//                   </div>
//                   <div>
//                     <h2 className="text-sm mb-2 text-gray-400">
//                       SHIPPING ADDRESS
//                     </h2>
//                     <p className="text-gray-600 text-sm">
//                       {selectedAddress.Shipping_Street}
//                       <br />
//                       {selectedAddress.Shipping_City},{" "}
//                       {selectedAddress.Shipping_State}{" "}
//                       {selectedAddress.Shipping_Code}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="">
//               <button
//                 type="button"
//                 className="text-indigo-500 mt-2 hover:text-indigo-600 font-medium flex items-center gap-1"
//               >
//                 <span className="text-xl">+</span>
//                 Add new address
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* new section for post product*/}
//         <div>
//           {formData.postProduction === "We Deliver (Our Vehicle)" && (
//             <DeliveryVehicleSection
//               formData={formData}
//               handleDeliveryAddressChange={handleDeliveryAddressChange}
//               handleDeliveryDateChange={handleDeliveryDateChange}
//             />
//           )}

//           {formData.postProduction === "We Deliver (Rented Truck)" && (
//             <RentedTruckSection
//               formData={formData}
//               handleVehicleNumberChange={handleVehicleNumberChange}
//               handleRentedTruckDeliveryDateChange={
//                 handleRentedTruckDeliveryDateChange
//               }
//               handleRentedTruckAddressChange={handleRentedTruckAddressChange}
//             />
//           )}

//           {formData.postProduction === "Customer Pickup" && (
//             <CustomerPickupSection
//               formData={formData}
//               handlePickupFieldChange={handlePickupFieldChange}
//               handlePickupDateChange={handlePickupDateChange}
//             />
//           )}

//           {formData.postProduction === "Dropship" && (
//             <DropshipSection
//               formData={formData}
//               handleShipFromChange={handleShipFromChange}
//               handleMultipleLocationsChange={handleMultipleLocationsChange}
//               handleShipToAddressChange={handleShipToAddressChange}
//             />
//           )}

//           {formData.postProduction === "Send UPS/Fedex (Our Account)" && (
//             <UPSSection
//               formData={formData}
//               handleShippingServiceChange={handleShippingServiceChange}
//               handleRegularGroundChange={handleRegularGroundChange}
//               handleMarkupsChange={handleMarkupsChange}
//               handleAccountNumberChange={handleAccountNumberChange}
//               handleMultipleLocationsUPSChange={
//                 handleMultipleLocationsUPSChange
//               }
//             />
//           )}
//           {formData.postProduction === "Send UPS/Fedex (Customer Account)" && (
//             <CustomerAccountSection
//               formData={formData}
//               handleCustomerAccountNumberChange={
//                 handleCustomerAccountNumberChange
//               }
//               handleCustomerAccountChange={handleCustomerAccountChange}
//               handleMultipleLocationsCustomerChange={
//                 handleMultipleLocationsCustomerChange
//               }
//             />
//           )}

//           {formData.postProduction === "Freight Delivery" && (
//             <FreightDeliverySection
//               formData={formData}
//               handlePalletSizeChange={handlePalletSizeChange}
//               handleFreightPickupChange={handleFreightPickupChange}
//               handleFreightPickupDateChange={handleFreightPickupDateChange}
//             />
//           )}

//           {formData.postProduction === "Install" && (
//             <InstallSection
//               formData={formData}
//               handleDropdownChange={handleDropdownChange}
//               handleTextChange={handleTextChange}
//               handleNumberChange={handleNumberChange}
//               handleDateInstallChange={handleDateInstallChange}
//             />
//           )}
//         </div>
//         {/* Items Section */}
//         <h1 className="mt-4 text-gray-700 font-roboto font-semibold">
//           Item Details
//         </h1>
//         <div className="mx-auto overflow-x-auto mt-4 ">
//           <div className="min-w-[700px]">
//             <div className="flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4">
//               <div className="w-48">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Type
//                 </label>
//               </div>
//               <div className="w-40">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Item Details <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-16">
//                 <label className="block text-sm font-medium text-gray-700 ml-3 mb-1">
//                   Qty <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-28">
//                 <label className="block text-sm font-medium text-gray-700 ml-3 mb-1">
//                   Unit <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-28">
//                 <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
//                   Description
//                 </label>
//               </div>
//               <div className="w-32 ">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Piece Cost ($)
//                 </label>
//               </div>
//               <div className="w-28">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Markup (%)
//                 </label>
//               </div>
//               <div className="w-32">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Piece Price ($)
//                 </label>
//               </div>
//               <div className="w-28 mr-[-20px]">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Amount ($)
//                 </label>
//               </div>
//             </div>
//             {items.map((item) => (
//               <div key={item.id} className="flex gap-4 mb-4 items-start">
//                 <button
//                   type="button"
//                   onClick={() => removeItem(item.id)}
//                   className="mt-2 text-gray-400 hover:text-gray-600"
//                 >
//                   <span className="text-xs">
//                     <i className="fas fa-x"></i>
//                   </span>
//                 </button>
//                 <div className="w-44">
//                   <CustomDropdown
//                     options={productTypeOptions}
//                     value={item.Product_Type1}
//                     onChange={(value) =>
//                       handleProductTypeChange(item.id, value)
//                     }
//                     placeholder="-Select-"
//                     className="w-full"
//                     searchable="true"
//                   />
//                 </div>
//                 <div className="w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     placeholder="Enter item details"
//                     value={item.Item}
//                     onChange={(e) =>
//                       setItems(
//                         items.map((i) =>
//                           i.id === item.id ? { ...i, Item: e.target.value } : i
//                         )
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="w-16">
//                   <input
//                     type="text"
//                     className="input-box"
//                     placeholder="######"
//                     value={item.Qty}
//                     onChange={(e) => handleQtyChange(item.id, e.target.value)}
//                   />
//                 </div>
//                 <div className="w-28">
//                   <div className="w-28">
//                     <CustomDropdown
//                       options={unitOptions.map((option) => ({
//                         value: option,
//                         label: option,
//                       }))}
//                       value={item.Unit}
//                       onChange={(value) =>
//                         setItems(
//                           items.map((i) =>
//                             i.id === item.id ? { ...i, Unit: value } : i
//                           )
//                         )
//                       }
//                       placeholder="-Select-"
//                       className="w-full" // or your preferred width
//                       searchable={false} // Since these are predefined units
//                     />
//                   </div>
//                 </div>
//                 <div className="w-20">
//                   <button
//                     type="button"
//                     onClick={() => handleOpenDescriptionEditor(item.id)}
//                     className="btn2 py-[7px] px-3 text-sm capitalize"
//                   >
//                     <i className="fa-sharp fa-solid fa-square-plus"></i> Add
//                   </button>
//                 </div>
//                 <div className="relative w-28">
//                   <input
//                     type="number"
//                     className="input-box"
//                     placeholder="####"
//                     value={item.Piece_cost}
//                     onChange={(e) =>
//                       handlePieceCostChange(item.id, e.target.value)
//                     }
//                     onFocus={() => handlePieceCostFocus(item.id)}
//                     onBlur={() => handlePieceCostBlur(item.id)}
//                   />
//                   <span
//                     className={`input-span ${
//                       item.isPieceCostFocused ? "input-span-focus" : ""
//                     }`}
//                   >
//                     $
//                   </span>
//                 </div>
//                 <div className="w-28 relative">
//                   <input
//                     type="number"
//                     className="input-box"
//                     placeholder=""
//                     value={item.Margin}
//                     onChange={(e) =>
//                       handleMarkupChange(item.id, e.target.value)
//                     }
//                     onFocus={() => handleMarkupFocus(item.id)}
//                     onBlur={() => handleMarkupBlur(item.id)}
//                   />
//                   <span
//                     className={`input-span ${
//                       item.isMarkupFocused ? "input-span-focus" : ""
//                     }`}
//                   >
//                     %
//                   </span>
//                 </div>
//                 <div className="w-28 relative">
//                   <input
//                     type="number"
//                     className="input-box"
//                     placeholder="0.00"
//                     value={item.piecePrice}
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//                 <div className="w-28 relative">
//                   <input
//                     type="number"
//                     className="input-box"
//                     placeholder="0.00"
//                     value={item.amount}
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>
//             ))}

//             {openDescriptionEditorId && (
//               <div className="fixed inset-0 bg-white z-50 p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold">Item Description</h2>
//                   <button type="button" onClick={handleCloseDescriptionEditor}>
//                     <i className="fa-solid fa-xmark text-red-500 font-bold text-xl"></i>
//                   </button>
//                 </div>
//                 <JoditEditor
//                   value={
//                     items.find((item) => item.id === openDescriptionEditorId)
//                       ?.Description_Rich_Text || ""
//                   }
//                   config={config}
//                   onBlur={(newContent) =>
//                     handleDescriptionChange(openDescriptionEditorId, newContent)
//                   }
//                 />
//               </div>
//             )}

//             <div className="flex justify-between items-center mt-4">
//               <button
//                 type="button"
//                 onClick={addNewItem}
//                 className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
//               >
//                 <span className="text-xl">+</span> Add New
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Accounting Summary Section */}
//         <div className="">
//           <div className="grid grid-cols-3 gap-6">
//             {/* First Column */}
//             <div className="space-y-4">
//               <h1 className="mt-4 text-gray-700 font-roboto font-semibold">
//                 Notes
//               </h1>
//               <div className="flex flex-col md:flex-row items-center w-full gap-6">
//                 {!showPublicNotes && (
//                   <button
//                     type="button"
//                     onClick={() => setShowPublicNotes(true)}
//                     className="btn capitalize text-xs px-3"
//                   >
//                     Add Public Notes
//                   </button>
//                 )}
//                 {!showPrivateNotes && (
//                   <button
//                     type="button"
//                     onClick={() => setShowPrivateNotes(true)}
//                     className="btn capitalize text-xs px-3"
//                   >
//                     Add Private Notes
//                   </button>
//                 )}
//               </div>

//               {showPublicNotes && (
//                 <div className="fixed inset-0 bg-white z-50 p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold">Public Notes</h2>
//                     <button
//                       type="button"
//                       onClick={() => setShowPublicNotes(false)}
//                     >
//                       <i className="fa-solid fa-xmark text-red-500 font-bold text-xl"></i>
//                     </button>
//                   </div>
//                   <JoditEditor
//                     ref={editorPublic}
//                     value={formData.publicNotes}
//                     config={config}
//                     onBlur={(newContent) => handlePublicNotesChange(newContent)}
//                   />
//                 </div>
//               )}

//               {showPrivateNotes && (
//                 <div className="fixed inset-0 bg-white z-50 p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold">Private Notes</h2>
//                     <button
//                       type="button"
//                       onClick={() => setShowPrivateNotes(false)}
//                     >
//                       <i className="fa-solid fa-xmark text-red-500 font-bold text-xl"></i>
//                     </button>
//                   </div>
//                   <JoditEditor
//                     ref={editorPrivate}
//                     value={formData.privateNotes}
//                     config={config}
//                     onBlur={(newContent) =>
//                       handlePrivateNotesChange(newContent)
//                     }
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Second Column */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Total Cost</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.totalCost === "0.00"
//                         ? ""
//                         : accountingSummary.totalCost
//                     }
//                     placeholder={
//                       accountingSummary.totalCost === "0.00" ? "#,###,###" : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Job Profit</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.jobProfit === "0.00"
//                         ? ""
//                         : accountingSummary.jobProfit
//                     }
//                     placeholder={
//                       accountingSummary.jobProfit === "0.00" ? "#,###,###" : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Job Profit %</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.jobProfitPercent === "0.00"
//                         ? ""
//                         : accountingSummary.jobProfitPercent
//                     }
//                     placeholder={
//                       accountingSummary.jobProfitPercent === "0.00" ? "" : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">%</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Past Due</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={accountingSummary.pastDue || ""}
//                     placeholder={accountingSummary.pastDue ? "" : "#,###,###"}
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">
//                   Total Receivable
//                 </label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.totalReceivable === "0.00"
//                         ? ""
//                         : accountingSummary.totalReceivable
//                     }
//                     placeholder={
//                       accountingSummary.totalReceivable === "0.00"
//                         ? "#,###,###"
//                         : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Credit Limit</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={accountingSummary.creditLimit || ""}
//                     placeholder={
//                       accountingSummary.creditLimit ? "" : "#,###,###"
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>
//             </div>

//             {/* Third Column */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Sub-Total</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.subTotal === "0.00"
//                         ? ""
//                         : accountingSummary.subTotal
//                     }
//                     placeholder={
//                       accountingSummary.subTotal === "0.00" ? "#,###,###" : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Sales Tax</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.salesTax === "0.00"
//                         ? ""
//                         : accountingSummary.salesTax
//                     }
//                     placeholder={
//                       accountingSummary.salesTax === "0.00" ? "#,###,###" : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Total</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.total === "0.00"
//                         ? ""
//                         : accountingSummary.total
//                     }
//                     placeholder={
//                       accountingSummary.total === "0.00" ? "#,###,###" : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Down Payment %</label>
//                 <div className="relative w-40">
//                   <input
//                     type="number"
//                     className="input-box"
//                     value={accountingSummary.downPaymentPercent || ""}
//                     placeholder=""
//                     onChange={handleDownPaymentChange}
//                   />
//                   <span className="input-span">%</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">
//                   Down Payment Amount
//                 </label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.downPaymentAmount === "0.00"
//                         ? ""
//                         : accountingSummary.downPaymentAmount
//                     }
//                     placeholder={
//                       accountingSummary.downPaymentAmount === "0.00"
//                         ? "#,###,###"
//                         : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="text-gray-600 text-sm">Balance Due</label>
//                 <div className="relative w-40">
//                   <input
//                     type="text"
//                     className="input-box"
//                     value={
//                       accountingSummary.balanceDue === "0.00"
//                         ? ""
//                         : accountingSummary.balanceDue
//                     }
//                     placeholder={
//                       accountingSummary.balanceDue === "0.00" ? "#,###,###" : ""
//                     }
//                     disabled
//                   />
//                   <span className="input-span">$</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Customer Attachments section */}
//         <h1 className="mt-4 text-gray-700 font-roboto font-semibold">
//           Customer Attachments
//         </h1>
//         <div className="mx-auto overflow-x-auto mt-4 pb-8">
//           <div className="w-[500px]">
//             <div className="flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4">
//               <div className="w-40">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   File Upload
//                 </label>
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
//                   File Description
//                 </label>
//               </div>
//             </div>
//             {customerAttachments.map((attachment, index) => (
//               <div
//                 key={`${attachment.id}-${index}`}
//                 className="flex gap-4 mb-4 items-start"
//               >
//                 <button
//                   type="button"
//                   onClick={() => removeCustomerAttachment(attachment.id)}
//                   className="mt-2 text-gray-400 hover:text-gray-600"
//                 >
//                   <span className="text-xs">
//                     <i className="fas fa-x"></i>
//                   </span>
//                 </button>

//                 <div className="w-40">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       className="input-box"
//                       placeholder="Select File"
//                       readOnly
//                       value={
//                         attachment.fileName ||
//                         (attachment.file ? attachment.file.name : "")
//                       }
//                       onClick={() => handleCustomerAttachmentFileClick(index)}
//                     />
//                     <input
//                       type="file"
//                       className="hidden"
//                       ref={(el) =>
//                         (attachmentFileInputRefs.current[index] = el)
//                       }
//                       onChange={(e) =>
//                         handleCustomerAttachmentFileChange(attachment.id, e)
//                       }
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-2 top-1/2 -translate-y-1/2"
//                       onClick={() => handleCustomerAttachmentFileClick(index)}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-gray-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     className="input-box"
//                     placeholder="Enter file description"
//                     value={attachment.fileDescription}
//                     onChange={(e) =>
//                       setCustomerAttachments(
//                         customerAttachments.map((a) =>
//                           a.id === attachment.id
//                             ? { ...a, fileDescription: e.target.value }
//                             : a
//                         )
//                       )
//                     }
//                   />
//                 </div>
//               </div>
//             ))}
//             <div className="flex justify-between items-center mt-4">
//               <button
//                 type="button"
//                 onClick={addNewCustomerAttachment}
//                 className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
//               >
//                 <span className="text-xl">+</span> Add New
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Private Attachments section */}
//         <h1 className="mt-4 text-gray-700 font-roboto font-semibold">
//           Private Attachments
//         </h1>
//         <div className="mx-auto overflow-x-auto mt-4 pb-8">
//           <div className="w-[500px]">
//             <div className="flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4">
//               <div className="w-40">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   File Upload
//                 </label>
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
//                   File Description
//                 </label>
//               </div>
//             </div>
//             {privateAttachments.map((attachment, index) => (
//               <div
//                 key={`${attachment.id}-${index}`}
//                 className="flex gap-4 mb-4 items-start"
//               >
//                 <button
//                   type="button"
//                   onClick={() => removePrivateAttachment(attachment.id)}
//                   className="mt-2 text-gray-400 hover:text-gray-600"
//                 >
//                   <span className="text-xs">
//                     <i className="fas fa-x"></i>
//                   </span>
//                 </button>

//                 <div className="w-40">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       className="input-box"
//                       placeholder="Select File"
//                       readOnly
//                       value={
//                         attachment.fileName ||
//                         (attachment.file ? attachment.file.name : "")
//                       }
//                       onClick={() => handlePrivateAttachmentFileClick(index)}
//                     />
//                     <input
//                       type="file"
//                       className="hidden"
//                       ref={(el) =>
//                         (privateAttachmentFileInputRefs.current[index] = el)
//                       }
//                       onChange={(e) =>
//                         handlePrivateAttachmentFileChange(attachment.id, e)
//                       }
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-2 top-1/2 -translate-y-1/2"
//                       onClick={() => handlePrivateAttachmentFileClick(index)}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-gray-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     className="input-box"
//                     placeholder="Enter file description"
//                     value={attachment.fileDescription}
//                     onChange={(e) =>
//                       setPrivateAttachments(
//                         privateAttachments.map((a) =>
//                           a.id === attachment.id
//                             ? { ...a, fileDescription: e.target.value }
//                             : a
//                         )
//                       )
//                     }
//                   />
//                 </div>
//               </div>
//             ))}
//             <div className="flex justify-between items-center mt-4">
//               <button
//                 type="button"
//                 onClick={addNewPrivateAttachment}
//                 className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
//               >
//                 <span className="text-xl">+</span> Add New
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Reference URL section */}
//         <h1 className="mt-4 text-gray-700 font-roboto font-semibold">
//           Reference URL
//         </h1>
//         <div className="mx-auto overflow-x-auto mt-4">
//           <div className="w-[500px]">
//             <div className="flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   URL
//                 </label>
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
//                   Description
//                 </label>
//               </div>
//             </div>
//             {referenceUrls.map((reference, index) => (
//               <div key={reference.id} className="flex gap-4 mb-4 items-start">
//                 <button
//                   type="button"
//                   onClick={() => removeReferenceUrl(reference.id)}
//                   className="mt-2 text-gray-400 hover:text-gray-600"
//                 >
//                   <span className="text-xs">
//                     <i className="fas fa-x"></i>
//                   </span>
//                 </button>

//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     className="input-box"
//                     placeholder="Enter URL"
//                     value={reference.url}
//                     onChange={(e) =>
//                       setReferenceUrls(
//                         referenceUrls.map((r) =>
//                           r.id === reference.id
//                             ? { ...r, url: e.target.value }
//                             : r
//                         )
//                       )
//                     }
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <textarea
//                     className="input-box h-24"
//                     placeholder="Enter description"
//                     value={reference.description}
//                     onChange={(e) =>
//                       setReferenceUrls(
//                         referenceUrls.map((r) =>
//                           r.id === reference.id
//                             ? { ...r, description: e.target.value }
//                             : r
//                         )
//                       )
//                     }
//                   />
//                 </div>
//               </div>
//             ))}
//             <div className="flex justify-between items-center mt-4">
//               <button
//                 type="button"
//                 onClick={addNewReferenceUrl}
//                 className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
//               >
//                 <span className="text-xl">+</span> Add New
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Form buttons */}
//         {loadingAccountDetails && <PageSpinner />}
//         {editSpinner && <PageSpinner />}
//         <div className="flex items-center mt-5 py-2 flex-row gap-3">
//           <button type="submit" className="btn">
//             <span>
//               <i className="fas fa-save mr-2"></i>
//             </span>
//             Update
//           </button>

//           <button type="button" onClick={handleCancel} className="btn2">
//             <span>
//               <i className="fas fa-times mr-2"></i>
//             </span>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Edit;

import React from "react";
import ReceivingForm from "../components/Receiving/ReceivingForm";
import { useNavigate, useParams } from "react-router-dom";
import { useReceivings } from "../context/ReceivingContext";
import ShippingForm from "../components/Shipping/ShippingForm";
import { useShippings } from "../context/ShippingContext";

const SoEdit = () => {
  const { id } = useParams();
  const { shippings, updateShipping } = useShippings();
  const navigate = useNavigate();

  const receiving = shippings.find((item) => item.ID === id);

  const handleSubmit = (formData) => {
    updateShipping(Number(id), formData);
    navigate("/so");
  };

  if (!shippings) {
    return <div>Shipping not found</div>;
  }

  return (
    <div className="mx-auto p-6">
      {/* <h2 className="text-2xl font-bold mb-6">Edit Shipping</h2> */}
      <ShippingForm onSubmit={handleSubmit} initialData={receiving} />
    </div>
  );
};

export default SoEdit;
