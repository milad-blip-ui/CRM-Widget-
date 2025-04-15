import React, {useState, useEffect, useRef, useMemo, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext'; 
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import CustomDropdown from '../../components/shared/CustomDropdown';
import AccountDropdown from '..//../components/shared/AccountDropdown';
import { formatDate } from '../../utils/dateUtils';
import { PageSpinner } from '../../components/shared/Spinner';
import updateEstimate from '../../services/updateEstimate';
import { EstimatesContext } from '../../context/EstimateContext'; 

// Utility function for shallow comparison
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}

const Edit = ({ placeholder }) => {  
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { estimates,fetchEstimates } = useContext(EstimatesContext);
  const navigate = useNavigate();
  const [editSpinner, setEditSpinner] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [estimateData, setEstimateData] = useState(null);
  const [loadingCreatorData, setLoadingCreatorData] = useState(true);
  const [newContactOptions, setNewContactOptions] = useState([]);
  const [loadingAccountDetails, setLoadingAccountDetails] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const connection = "crmwidgetconnection";
        const [allProductType, allEmployee] = await Promise.all([
          window.ZOHO.CRM.CONNECTION.invoke(connection, {
            parameters: {},
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
            url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/All_Product_Types`,
            param_type: 1,
          }),
          window.ZOHO.CRM.CONNECTION.invoke(connection, {
            parameters: {},
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
            url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/All_Employees`,
            param_type: 1,
          })
        ]);

        setData({
          allProductTypes: allProductType.details.statusMessage,
          allEmployees: allEmployee.details.statusMessage
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setLoadingCreatorData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchEstimateData = async () => {
      try {
        console.log("Estiamte EditPage",estimates)
        const estimate = estimates.find(item => {         
          return item.ID === id; 
        });
        if (estimate) {
          setEstimateData(estimate);
          
          // Initialize customer attachments
          if (estimate.Customer_Attachments?.length) {
            setCustomerAttachments(estimate.Customer_Attachments.map(attach => ({
              id: attach.id,
              file: null, // Keep as null since we can't recreate File objects from JSON
              fileName: attach.fileName || '',
              fileDescription: attach.fileDescription || ''
            })));
          } else {
            setCustomerAttachments([{ id: 1, file: null, fileName: '', fileDescription: '' }]);
          }
  
          // Initialize private attachments
          if (estimate.Private_Attachments?.length) {
            setPrivateAttachments(estimate.Private_Attachments.map(attach => ({
              id: attach.id,
              file: null, // Keep as null since we can't recreate File objects from JSON
              fileName: attach.fileName || '',
              fileDescription: attach.fileDescription || ''
            })));
          } else {
            setPrivateAttachments([{ id: 1, file: null, fileName: '', fileDescription: '' }]);
          }
        } else {
          toast.error('Failed to fetch estimate data');
        }
      } catch (error) {
        console.error('Error fetching estimate:', error);
        toast.error('An error occurred while fetching the estimate');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchEstimateData();
  }, [id]);

  // Address handling
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Handle address selection change
  const handleAddressChange = (selectedName) => {
    const selected = fetchedData.find(addr => addr.name === selectedName);
    setSelectedAddress(selected);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        locationName: selected.name,
        billingAddress: {
          street: selected.Billing_Street,
          city: selected.Billing_City,
          state: selected.Billing_State,
          zip: selected.Billing_Code
        },
        shippingAddress: {
          street: selected.Shipping_Street,
          city: selected.Shipping_City,
          state: selected.Shipping_State,
          zip: selected.Shipping_Code
        }
      }));
    }
  };

  // Form data state
  const [formData, setFormData] = useState({
    quoteDate: new Date(),
    quoteName: '',
    crmAccountName: '',
    crmAccountNameString:  '',
    postProduction: '',
    leadTime: '',
    taxRate: '',
    locationName: '',
    approver: '',
    approverName: '' ,
    salesperson: '',
    salespersonName: '', // Add this
    vendorNumber: '',
    crmContactName: '',
    internalApprover: '',
    privateNotes: '',
    publicNotes: '',
    isHotJob: '',
    billingAddress: {
      street:  '',
      city: '',
      state:  '',
      zip: ''
    },
    shippingAddress: {
      street: '',
      city:  '',
      state:  '',
      zip: ''
    }
  });

  // Initialize form with estimate data
// Initialize form with estimate data
useEffect(() => {
  if (!estimateData) return;

  const initialFormData = {
    quoteDate: estimateData.Quote_date || new Date(),
    quoteName: estimateData.Quote_name || '',
    crmAccountName: estimateData.CRM_Account_Name,
    postProduction: estimateData.Post_production || '',
    leadTime: estimateData.Lead_time_from_approval_Days || '',
    taxRate: estimateData.Tax_rate_dropdown || '',
    locationName: estimateData.Widget_Location_Name ,
    approver: estimateData.Approver1 || '',
    salesperson: estimateData.Salesperson || '',
    vendorNumber: estimateData.Vendor_Number || '',
    crmContactName: estimateData.Widget_CRM_Contact_Name || '',
    internalApprover: estimateData.Quote_approval || '',
    privateNotes: estimateData.Private_Notes_RT || '',
    publicNotes: estimateData.Notes_Public_RT || '',
    isHotJob: estimateData.Is_Hot_job || '',
    billingAddress: {
      street: estimateData.Bill_To?.address_line_1 ,
      city: estimateData.Bill_To?.district_city ,
      state: estimateData.Bill_To?.state_province ,
      zip: estimateData.Bill_To?.postal_Code 
    },
    shippingAddress: {
      street: estimateData.Ship_To?.address_line_2 ,
      city: estimateData.Ship_To?.district_city ,
      state: estimateData.Ship_To?.state_province ,
      zip: estimateData.Ship_To?.postal_Code ,
    },
    crmAccountNameString:estimateData.CRM_Account_Name_String,
    salespersonName: estimateData.SalespersonName,
    approverName: estimateData.ApproverName,
  };

  setFormData(prev => shallowEqual(prev, initialFormData) ? prev : initialFormData);

  fetchAccountDetails(estimateData.CRM_Account_Name, estimateData.Shipping_Name);
}, [estimateData]);


const fetchAccountDetails = async (accountId, estimateAddress) => {
  console.log(accountId, "-",estimateAddress)
  setLoadingAccountDetails(true);
  try {
    // Fetch the account details
    const accountResponse = await window.ZOHO.CRM.API.getRecord({
      Entity: "Accounts",
      RecordID: accountId,
    });
    const accountData = accountResponse.data[0];

    if(!estimateAddress){
      // Update formData with vendor number
    setFormData(prev => ({
      ...prev,
      vendorNumber: accountData.Vendor_number || ''
    }));
    }

    const addressData = [];

    // Fetch contacts
    const contactsResponse = await window.ZOHO.CRM.API.getRelatedRecords({
      Entity: "Accounts",
      RecordID: accountId,
      RelatedList: "Contacts",
    });

    if (!contactsResponse || !contactsResponse.data || !Array.isArray(contactsResponse.data)) {
      console.warn('No contacts data found or invalid response structure');
      setNewContactOptions([]); // Set empty array if no data
    } else {
      setNewContactOptions(
        contactsResponse.data
          .filter(contact => contact.First_Name || contact.Last_Name)
          .map((contact) => ({
            value: `${contact.First_Name || ''} ${contact.Last_Name || ''}`.trim(),
            label: `${contact.First_Name || ''} ${contact.Last_Name || ''}`.trim(),
          }))
      );
    }

    // 1. Get the main account address
    const mainAddress = {
      name: accountData?.Account_Name,
      Billing_Street: accountData?.Billing_Street,
      Billing_City: accountData?.Billing_City,
      Billing_State: accountData?.Billing_State,
      Billing_Code: accountData?.Billing_Code,
      Shipping_Street: accountData?.Shipping_Street,
      Shipping_City: accountData?.Shipping_City,
      Shipping_State: accountData?.Shipping_State,
      Shipping_Code: accountData?.Shipping_Code,
    };
    
    // Add the main address to the address data
    addressData.push(mainAddress);  
    if(!estimateAddress){
      // Update formData with the main address details
    setFormData(prev => ({
      ...prev,
      locationName: accountData?.Account_Name || '',
      billingAddress: {
        street: accountData?.Billing_Street || '',
        city: accountData?.Billing_City || '',
        state: accountData?.Billing_State || '',
        zip: accountData?.Billing_Code || ''
      },
      shippingAddress: {
        street: accountData?.Shipping_Street || '',
        city: accountData?.Shipping_City || '',
        state: accountData?.Shipping_State || '',
        zip: accountData?.Shipping_Code || ''
      }
    }));
    }
    // Fetch addresses
    const addressesResponse = await window.ZOHO.CRM.API.getRelatedRecords({
      Entity: "Accounts",
      RecordID: accountId,
      RelatedList: "Address",
    });

    if (addressesResponse && addressesResponse.data && Array.isArray(addressesResponse.data)) {
      addressesResponse.data.forEach((address) => {
        if (address.Name || address.Billing_Street || address.Shipping_Street) {
          addressData.push({
            name: address.Name || '',
            Billing_Street: address.Billing_Street || '',
            Billing_City: address.Billing_City || '',
            Billing_State: address.Billing_State || '',
            Billing_Code: address.Billing_Code || '',
            Shipping_Street: address.Shipping_Street || '',
            Shipping_City: address.Shipping_City || '',
            Shipping_State: address.Shipping_State || '',
            Shipping_Code: address.Shipping_Code || '',
          });
        }
      });
    } else {
      console.warn('No valid addresses data found in response');
    }

    setFetchedData(addressData);

    // Set the selected address based on the estimate address if provided
    if (estimateAddress) {
      const selectedAddr = addressData.find(addr => addr.name === estimateAddress);
      console.log(selectedAddr)
      if (selectedAddr) {
        setSelectedAddress(selectedAddr);
      }
    } else {
      setSelectedAddress(mainAddress); // Use main address by default
    }

  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to load account details");
  } finally {
    setLoadingAccountDetails(false);
  }
};

  // Items section
  const [items, setItems] = useState([{
    id: 1,
    Item: "",
    Qty: "",
    Unit: "",
    Description_Rich_Text: "",
    Tiered: false,
    Option: false,
    Product_Type1: "",
    Piece_cost: "",
    Margin: "",
    piecePrice: "0.00",
    amount: "0.00",
    isPieceCostFocused: false,
    isMarkupFocused: false,
    Product_Type_Name:""
  }]);

  // Initialize items with estimate data
  useEffect(() => {
    if (!estimateData?.Item_Details?.length) return;

    const newItems = estimateData.Item_Details.map(item => ({
      id: item.id || Math.random().toString(36).substr(2, 9),
      Item: item.Item || "",
      Qty: item.Qty || "",
      Unit: item.Unit || "",
      Description_Rich_Text: item.Description_Rich_Text || "",
      Tiered: item.Tiered || false,
      Option: item.Option || false,
      Product_Type1: item.Product_Type1 || "",
      Piece_cost: item.Piece_cost || "",
      Margin: item.Margin || "",
      piecePrice: item.piecePrice || "0.00",
      amount: item.amount || "0.00",
      isPieceCostFocused: false,
      isMarkupFocused: false,
      Product_Type_Name:item.Product_Type_Name
    }));

    setItems(prev => shallowEqual(prev, newItems) ? prev : newItems);
  }, [estimateData?.Item_Details]);

  // Reference URLs
  const [referenceUrls, setReferenceUrls] = useState([{ id: 1, url: '', description: '' }]);

  // Initialize reference URLs
  useEffect(() => {
    if (!estimateData?.Reference_URL?.length) return;

    const newUrls = estimateData.Reference_URL.map((url, index) => ({
      id: index + 1,
      url: url.Url?.url || '',
      description: url.Description || ''
    }));

    setReferenceUrls(prev => shallowEqual(prev, newUrls) ? prev : newUrls);
  }, [estimateData?.Reference_URL]);
  const addNewReferenceUrl = () => {
    setReferenceUrls([...referenceUrls, {
      id: referenceUrls.length + 1,
      url: '',
      description: ''
    }]);
  };
  // Accounting summary
  const [accountingSummary, setAccountingSummary] = useState({
    totalCost: 0,
    subTotal: 0,
    jobProfit: 0,
    jobProfitPercent: 0,
    salesTax: 0,
    total: 0,
    pastDue: 0,
    downPaymentPercent: estimateData?.Down_Payment || 0,
    downPaymentAmount: 0,
    creditLimit: 0,
    balanceDue: 0,
    totalReceivable: 0
  });

  // Calculate derived values
  const calculateDerivedValues = (items, taxRate, downPaymentPercent) => {
    const updatedItems = items.map(item => {
      const Piece_cost = parseFloat(item.Piece_cost) || 0;
      const Margin = parseFloat(item.Margin) || 0;
      const qty = parseFloat(item.Qty) || 0;
      
      const piecePrice = Piece_cost * (1 + Margin / 100);
      const amount = piecePrice * qty;
      
      return {
        ...item,
        piecePrice: piecePrice.toFixed(2),
        amount: amount.toFixed(2)
      };
    });
  
    // Calculate summary values
    let subTotal = 0;
    let totalCost = 0;
    let taxableAmount = 0;
    
    updatedItems.forEach(item => {
      const amount = parseFloat(item.amount) || 0;
      const itemCost = (parseFloat(item.Piece_cost) || 0) * (parseFloat(item.Qty) || 0);
      
      // Only add to totals if NOT Tiered and NOT Option
      if (!item.Tiered && !item.Option) {
        subTotal += amount;
        totalCost += itemCost;
        
        // Only add to taxable amount if:
        // 1. Tax rate is 6% AND
        // 2. Product type is taxable
        // 3. NOT Tiered and NOT Option
        if (taxRate === "6%") {
          const productType = productTypeOptions.find(pt => pt.value === item.Product_Type1);
          if (productType?.taxable) {
            taxableAmount += amount;
          }
        }
      }
    });
  
    // Calculate sales tax
    const salesTax = taxRate === "6%" ? taxableAmount * 0.06 : 0;
  
    const total = subTotal + salesTax;
    const jobProfit = subTotal - totalCost;
    const jobProfitPercent = subTotal > 0 ? (jobProfit / subTotal) * 100 : 0;
    const downPaymentAmount = downPaymentPercent > 0 ? total * downPaymentPercent / 100 : 0;
    const balanceDue = total - downPaymentAmount;
  
    return {
      items: updatedItems,
      summary: {
        totalCost: totalCost.toFixed(2),
        subTotal: subTotal.toFixed(2),
        jobProfit: jobProfit.toFixed(2),
        jobProfitPercent: jobProfitPercent.toFixed(2),
        salesTax: salesTax.toFixed(2),
        total: total.toFixed(2),
        downPaymentAmount: downPaymentAmount.toFixed(2),
        balanceDue: balanceDue.toFixed(2),
        totalReceivable: total.toFixed(2),
        taxableAmount: taxableAmount.toFixed(2)
      }
    };
  };
  const productTypeOptions = useMemo(() => 
    data?.allProductTypes?.data?.map(type => ({
      value: type.ID,
      label: type.Type_field,
      taxable: type.Taxable === "true"
    })) || [], 
    [data?.allProductTypes?.data]
  );
  // Memoize calculations
  const derivedValues = useMemo(() => {
    return calculateDerivedValues(items, formData.taxRate, accountingSummary.downPaymentPercent);
  }, [items, formData.taxRate, accountingSummary.downPaymentPercent, forceUpdate]);

  // Update accounting summary
  useEffect(() => {
    setAccountingSummary(prev => ({
      ...prev,
      ...derivedValues.summary
    }));
  }, [derivedValues.summary]);

  // Dropdown options
  const taxRateOptions = [
    { value: "0%", label: "0%" },
    { value: "6%", label: "6%" }
  ];

  const internalApproverOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ];

  const postProductionOptions = [
    { value: "We Deliver (Our Vehicle)", label: "We Deliver (Our Vehicle)" },
    { value: "We Deliver (Rented Truck)", label: "We Deliver (Rented Truck)" },
    { value: "Customer Pickup", label: "Customer Pickup" },
    { value: "Dropship", label: "Dropship" },
    { value: "Send UPS/Fedex (Our Account)", label: "Send UPS/Fedex (Our Account)" },
    { value: "Freight Delivery", label: "Freight Delivery" },
    { value: "Install", label: "Install" },
    { value: "Unknown", label: "Unknown" }
  ];
    const salesTeam = useMemo(() => 
      data?.allEmployees?.data
        ?.filter(employee => employee.Profile?.zc_display_value === "Sales")
        ?.map(employee => ({
          value: employee.ID,
          label: employee.Name_SL || `${employee.Name?.first_name} ${employee.Name?.last_name}`.trim()
        })) || [],
      [data?.allEmployees?.data]
    );
  const hasTieredOrOptionItems = useMemo(() => {
    return items.some(item => item.Tiered || item.Option);
  }, [items]);
  const unitOptions = ['Box', 'Each', 'Feet', 'Pieces', 'Sheet', 'Sq Feet', 'Units'];

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value 
    }));
  };

  const handleDateChange = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      toast.error('Invalid date selected');
      return;
    }
    setFormData(prev => ({
      ...prev,
      quoteDate: date
    }));
  };

  // Item handlers
  const addNewItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: prev.length + 1,
        Item: "",
        Qty: "",
        Unit: "",
        Description_Rich_Text: "",
        Tiered: false,
        Option: false,
        Product_Type1: "",
        Piece_cost: "",
        Margin: "",
        piecePrice: "0.00",
        amount: "0.00",
        isPieceCostFocused: false,
        isMarkupFocused: false 
      }
    ]);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Handler for Product Type change
  const handleProductTypeChange = (id, value) => {
    const selectedProductType = productTypeOptions.find(option => option.value === value);
    setItems(items.map((item) =>
      item.id === id ? { ...item, Product_Type1: value, Product_Type_Name: selectedProductType?.label || "" } : item
    )); 
    // Force recalculation by updating a dummy state
    setForceUpdate(prev => !prev); // Add this state at the top: const [forceUpdate, setForceUpdate] = useState(false);
  };

  const handlePieceCostChange = (id, value) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const Piece_cost = parseFloat(value) || 0;
          const Margin = parseFloat(item.Margin) || 0;
          const qty = parseFloat(item.Qty) || 0;
          const piecePrice = Piece_cost * (1 + Margin / 100);
          const amount = piecePrice * qty;

          return {
            ...item,
            Piece_cost: value,
            piecePrice: piecePrice.toFixed(2),
            amount: amount.toFixed(2)
          };
        }
        return item;
      });
    });
  };

  const handleMarkupChange = (id, value) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const Piece_cost = parseFloat(item.Piece_cost) || 0;
          const Margin = parseFloat(value) || 0;
          const qty = parseFloat(item.Qty) || 0;
          const piecePrice = Piece_cost * (1 + Margin / 100);
          const amount = piecePrice * qty;

          return {
            ...item,
            Margin: value,
            piecePrice: piecePrice.toFixed(2),
            amount: amount.toFixed(2)
          };
        }
        return item;
      });
    });
  };

  const handleQtyChange = (id, value) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const Piece_cost = parseFloat(item.Piece_cost) || 0;
          const Margin = parseFloat(item.Margin) || 0;
          const qty = parseFloat(value) || 0;
          const piecePrice = Piece_cost * (1 + Margin / 100);
          const amount = piecePrice * qty;

          return {
            ...item,
            Qty: value,
            piecePrice: piecePrice.toFixed(2),
            amount: amount.toFixed(2)
          };
        }
        return item;
      });
    });
  };

  const handleTieredChange = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, Tiered: !item.Tiered, Option: false };
      }
      return item;
    }));
  };

  const handleOptionChange = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, Option: !item.Option, Tiered: false };
      }
      return item;
    }));
  };
  const handleMarkupBlur = (id) => {
    setItems(items.map(item => 
      item.id === id ? {...item, isMarkupFocused: false} : item
    ));
  };
  const handlePieceCostFocus = (id) => {
    setItems(items.map(item => 
      item.id === id ? {...item, isPieceCostFocused: true} : item
    ));
  };

  const handlePieceCostBlur = (id) => {
    setItems(items.map(item => 
      item.id === id ? {...item, isPieceCostFocused: false} : item
    ));
  };

  const handleMarkupFocus = (id) => {
    setItems(items.map(item => 
      item.id === id ? {...item, isMarkupFocused: true} : item
    ));
  };
  // Notes editors
  const [showPublicNotes, setShowPublicNotes] = useState(false);
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [openDescriptionEditorId, setOpenDescriptionEditorId] = useState(null);

  const editorPrivate = useRef(null); 
  const editorPublic = useRef(null); 

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typings...',
    height: '600px',
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    removeButtons: ['file','speechRecognize'],
  }), [placeholder]);

  const handlePrivateNotesChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      privateNotes: newContent
    }));
  };

  const handlePublicNotesChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      publicNotes: newContent
    }));
  };

  const handleOpenDescriptionEditor = (id) => {
    setOpenDescriptionEditorId(id);
  };

  const handleCloseDescriptionEditor = () => {
    setOpenDescriptionEditorId(null);
  };

  const handleDescriptionChange = (id, newContent) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, Description_Rich_Text: newContent } : item
    ));
  };

  // Down payment handler
  const handleDownPaymentChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAccountingSummary(prev => ({
      ...prev,
      downPaymentPercent: value
    }));
  };

  // Attachments
  const [customerAttachments, setCustomerAttachments] = useState([]);
  const attachmentFileInputRefs = useRef([]);

  const addNewCustomerAttachment = () => {
    setCustomerAttachments(prev => [
      ...prev,
      {
        id: prev.length + 1,
        file: null,
        fileDescription: '',
      }
    ]);
  };

  const removeCustomerAttachment = (id) => {
    setCustomerAttachments(prev => prev.filter((attachment) => attachment.id !== id));
  };

  const handleCustomerAttachmentFileChange = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setCustomerAttachments(prev => prev.map((attachment) =>
      attachment.id === id ? { 
        ...attachment, 
        file,
        fileName: file.name // Update fileName when file changes
      } : attachment
    ));
  };

  const handleCustomerAttachmentFileClick = (index) => {
    attachmentFileInputRefs.current[index]?.click();
  };

  const [privateAttachments, setPrivateAttachments] = useState([]);
  const privateAttachmentFileInputRefs = useRef([]);

  const addNewPrivateAttachment = () => {
    setPrivateAttachments(prev => [
      ...prev,
      {
        id: prev.length + 1,
        file: null,
        fileDescription: '',
      }
    ]);
  };

  const removePrivateAttachment = (id) => {
    setPrivateAttachments(prev => prev.filter((attachment) => attachment.id !== id));
  };

  const handlePrivateAttachmentFileChange = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setPrivateAttachments(prev => prev.map((attachment) =>
      attachment.id === id ? { 
        ...attachment, 
        file,
        fileName: file.name // Update fileName when file changes
      } : attachment
    ));
  };

  const handlePrivateAttachmentFileClick = (index) => {
    privateAttachmentFileInputRefs.current[index]?.click();
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    console.log(items);
    console.log(customerAttachments);
    console.log(privateAttachments);
    console.log(referenceUrls);

    const requiredFields = {
      quoteName: 'Quote Name',
      postProduction: 'Post Production',
      taxRate: 'Tax Rate',
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !formData[field])
      .map(([_, name]) => name);
      
    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    setEditSpinner(true);   
    const refURLS = referenceUrls
      .map(item => {
          if (item.url) { 
              return { Url: { url: item.url }, Description: item.description };
          }
          return null;
      })
      .filter(item => item !== null);

       // Create the complete data object
       const completeData = {
         data: {
           Tax_rate_dropdown: formData.taxRate,
           Quote_name: formData.quoteName,
           Status: "Draft",
           Source: "Widget",
           Quote_approval: formData.internalApprover,
           Approver1: formData.approver,
           Post_production: formData.postProduction,
           CRM_Account_Name: formData.crmAccountName,
           Lead_time_from_approval_Days: formData.leadTime,
           Salesperson: formData.salesperson,
           Quote_date: formatDate(formData.quoteDate),
           Widget_CRM_Contact_Name: formData.crmContactName,
           Widget_Location_Name: formData.locationName,
           Vendor_Number: formData.vendorNumber,
           Down_Payment: accountingSummary.downPaymentPercent,
           Shipping_Name: formData.locationName,
           Billing_Name: formData.crmAccountNameString || '',
           Ship_To: { 
             address_line_2: formData.shippingAddress.street,
             district_city: formData.shippingAddress.city,
             state_province: formData.shippingAddress.state,
             postal_Code: formData.shippingAddress.zip,
           },
           Bill_To: {
             address_line_1: formData.billingAddress.street,
             postal_Code: formData.billingAddress.zip,
             district_city: formData.billingAddress.city,
             state_province: formData.billingAddress.state,
           },
           Notes_Public_RT: formData.publicNotes,
           Private_Notes_RT: formData.privateNotes,
           Is_Hot_job: formData.isHotJob,
           Item_Details: items,
           Reference_URL: refURLS,
           // Include all other fields you want in the JSON
           Accounting_Summary: accountingSummary,
           Customer_Attachments: customerAttachments.map(att => ({
             file: att.file,
             fileDescription: att.fileDescription,
             fileName: att.fileName // Add this
           })),
           Private_Attachments: privateAttachments.map(att => ({
             file: att.file,
             fileDescription: att.fileDescription,
             fileName: att.fileName // Add this
           })),
           CRM_Account_Name_String: formData.crmAccountNameString, 
           SalespersonName: formData.salespersonName,
           ApproverName: formData.approverName,
           Quote_Rev_int:estimateData?.Quote_Rev_int || null,
           ID:estimateData.ID,
           Quote:estimateData.Quote
         }
       };
     
       // Create the payload with Estimate_Json as stringified complete data
       const payload = {
         data: {
           ...completeData.data, // Spread all the original data
           Estimate_Json: JSON.stringify(completeData) // Add the complete data as JSON string
         }
       };
       console.log("payload",payload)
    try {
      const result = await updateEstimate(id,payload, customerAttachments, privateAttachments);
      if (result.data) {
        toast.success('Updated successfully!');
        await fetchEstimates();
        navigate('/');
      } else {
        console.error('Failed to update estimate:', result);
        toast.error('Failed to update estimate. Please try again.'); 
      }
    } catch (error) {
      console.error('Error updating estimate:', error);
      toast.error('An error occurred while updating the estimate.'); 
    } finally {
      setEditSpinner(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (isLoading || !estimateData) {
    return <div className="flex justify-center items-center h-64">Loading estimate data...</div>;
  }
 // Render spinner if still loading
  if (loadingCreatorData) {
    return <PageSpinner />;
  }
  return (
    <div className='flex bg-gray-25 items-center w-full'>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-6 w-full mb-8">
          <div className="">
            <div>
              <label className="input-label">
                CRM Account <span className="text-red-500">*</span>
              </label>
              <AccountDropdown
                value={formData.crmAccountName}
                initialLabel={formData.crmAccountNameString} // Pass the account name string
                onChange={(value, accountName) => {
                  setFormData(prev => ({
                    ...prev,
                    crmAccountName: value,
                    crmAccountNameString: accountName || ''
                  }));
                  // Call your additional function here
                  fetchAccountDetails(value);
                }}
                searchable={true}  // Changed from string "true" to boolean true
                placeholder="-Select-"
                className="w-full"
              />

            </div>
            <div className='mt-4'>
              <label className="input-label">
                CRM Contact
              </label>
              <CustomDropdown
                options={newContactOptions}
                value={formData.crmContactName}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  crmContactName: value
                }))}
                placeholder="-Select-"
                className="w-full"
                disabled={loadingAccountDetails}
              />
            </div>
            <div className="mt-4">
              <label className="input-label">
                Lead Time From Approval 
              </label>
              <input
                type="number"
                name="leadTime"
                className="input-box"
                value={formData.leadTime}
                onChange={handleChange}
              />
            </div>
            <div className='mt-4'>
              <label className="input-label">
                Post Production <span className="text-red-500">*</span>
              </label>
              <CustomDropdown
                options={postProductionOptions}
                value={formData.postProduction}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  postProduction: value
                }))}
                placeholder="-Select-"
                className="w-56"
              />
            </div>
          </div>
          <div className="">
            <div>
              <label className="input-label">
                Quote Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="quoteName"
                className="input-box"
                value={formData.quoteName}
                onChange={handleChange}
              />
            </div>
            <div className='mt-4'>
              <label className="input-label">
                Quote Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.quoteDate}
                onChange={handleDateChange}
                className="input-box"
                dateFormat="dd-MMM-yyyy"
                placeholderText="-Select-"
              />
            </div>
            <div className='mt-4'>
              <label className="input-label">
                Tax Rate <span className="text-red-500">*</span>
              </label>
              <CustomDropdown
                options={taxRateOptions}
                value={formData.taxRate}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  taxRate: value
                }))}
                placeholder="-Select-"
                className="w-full"
              />
            </div>
            <div className='mt-4'>
              <label className="input-label">
                Salesperson
              </label>
              <CustomDropdown
                options={salesTeam}
                value={formData.salesperson}
                onChange={(value) => {
                  const selected = salesTeam.find(option => option.value === value);
                  setFormData(prev => ({
                    ...prev,
                    salesperson: value,
                    salespersonName: selected?.label || ''
                  }));
                }}
                placeholder="-Select-"
                className="w-full"
              />
            </div>
          </div>
          <div className="">
            <div className="">
              <label className="input-label">
                Internal Approver <span className="text-red-500">*</span>
              </label>
              <CustomDropdown
                options={internalApproverOptions}
                value={formData.internalApprover}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  internalApprover: value
                }))}
                placeholder="-Select-"
                className="w-full"
              />
            </div>
            {formData.internalApprover === "yes" && (
              <div className='mt-4'>
                <label className="input-label">
                  Approver <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  options={salesTeam}
                  value={formData.approver}
                  onChange={(value) => {
                    const selected = salesTeam.find(option => option.value === value);
                    setFormData(prev => ({
                      ...prev,
                      approver: value,
                      approverName: selected?.label || ''
                    }));
                  }}
                  placeholder="-Select-"
                  className="w-full"
                />
              </div>
            )}
            <div className='mt-4'>
              <label className="input-label">
                Vendor Number
              </label>
              <input
                type="text"
                name="vendorNumber"
                className="input-box"
                value={formData.vendorNumber}
                readOnly
                onChange={() => {}}
              />
            </div>
            <div className='mt-4'>
              <label className="text-gray-600 mb-2 block text-sm">Is Hot Job?</label>
              <div className="flex items-center space-x-4 mt-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isHotJob"
                    className="form-radio text-indigo-600 focus:ring-0"
                    value="Yes"
                    checked={formData.isHotJob === "Yes"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isHotJob"
                    className="form-radio text-indigo-600 focus:ring-0"
                    value="No"
                    checked={formData.isHotJob === "No"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">No</span>
                </label>
              </div>
            </div>
          </div>
          <div className="md:w-96">
            <div className="relative">
              <label className="text-gray-600 mb-2 block text-sm">
                Account Address <span className="text-primary">*</span>
              </label>
              <CustomDropdown
                options={fetchedData.map(addr => ({
                  value: addr.name,
                  label: addr.name
                }))}
                value={selectedAddress?.name || ''}
                onChange={handleAddressChange}
                placeholder="Select address"
                className="w-full"
                searchable="true"
              />
              {selectedAddress && (
                <div className="mt-4 flex items-start gap-16">
                  <div>
                    <h2 className="text-sm mb-2 text-gray-400">BILLING ADDRESS</h2>
                    <p className="text-gray-600 text-sm">
                      {selectedAddress.Billing_Street}<br />
                      {selectedAddress.Billing_City}, {selectedAddress.Billing_State} {selectedAddress.Billing_Code}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-sm mb-2 text-gray-400">SHIPPING ADDRESS</h2>
                    <p className="text-gray-600 text-sm">
                      {selectedAddress.Shipping_Street}<br />
                      {selectedAddress.Shipping_City}, {selectedAddress.Shipping_State} {selectedAddress.Shipping_Code}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className=''>
              <button 
                type='button' 
                className="text-indigo-500 mt-2 hover:text-indigo-600 font-medium flex items-center gap-1"
              >
                <span className='text-xl'>+</span>
                Add new address
              </button>
            </div>
          </div>
        </div>
  
        {/* Items Section */}
        <h1 className="mt-4 text-gray-700 font-roboto font-semibold">Item Details</h1>
        <div className="mx-auto overflow-x-auto mt-4 ">
          <div className="min-w-[700px]">
            <div className='flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4'>
              <div className="w-12 ">
                <label className="block text-sm font-medium text-gray-700  mb-1">Tiered</label>
              </div>
              <div className="w-12 ">
                <label className="block text-sm font-medium text-gray-700 mb-1">Option</label>
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type
                </label>
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Details <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-16">
                <label className="block text-sm font-medium text-gray-700 ml-3 mb-1">
                  Qty <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium text-gray-700 ml-3 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
                  Description
                </label>
              </div>
              <div className="w-32 ">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Piece Cost ($)
                </label>
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Markup (%)
                </label>
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Piece Price ($)
                </label>
              </div>
              <div className="w-28 mr-[-20px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
              </div>
            </div>
            {items.map((item) =>(
              <div key={item.id} className="flex gap-4 mb-4 items-start">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className={`mt-2 ${item.id === 1 && hasTieredOrOptionItems ? 
                  'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                disabled={item.id === 1 && hasTieredOrOptionItems}
                title={item.id === 1 && hasTieredOrOptionItems ? 
                  "Cannot remove base item when tiered/option items exist" : ""}
              >
                <span className='text-xs'><i className='fas fa-x'></i></span>
              </button>
                <div className="flex mt-3 items-center gap-12 w-28">
                  <input
                    type="checkbox"
                    checked={item.Tiered}
                    onChange={() => handleTieredChange(item.id)}
                    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-0"
                    disabled={item.id === 1} // Disable for first row
                  />
                  <input
                    type="checkbox"
                    checked={item.Option}
                    onChange={() => handleOptionChange(item.id)}
                    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-0"
                    disabled={item.id === 1}
                  />
                </div>
                <div className="w-44">
                  <CustomDropdown
                    options={productTypeOptions}
                    value={item.Product_Type1}
                    onChange={(value) => handleProductTypeChange(item.id, value)}
                    placeholder="-Select-"
                    className="w-full"
                    searchable="true"
                  />
                </div>
                <div className="w-40">
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Enter item details"
                    value={item.Item}
                    onChange={(e) => setItems(items.map(i =>
                      i.id === item.id ? { ...i, Item: e.target.value } : i
                    ))}
                  />
                </div>
                <div className="w-16">
                  <input
                    type="text"
                    className="input-box"
                    placeholder="######"
                    value={item.Qty}
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                  />
                </div>
                <div className="w-28">
                  <select
                    className="input-box"
                    value={item.Unit}
                    onChange={(e) => setItems(items.map(i =>
                      i.id === item.id ? { ...i, Unit: e.target.value } : i
                    ))}
                  >
                    <option value="" disabled>-Select-</option>
                    {unitOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="w-20">
                  <button
                    type="button"
                    onClick={() => handleOpenDescriptionEditor(item.id)}
                    className="btn2 py-[7px] px-3 text-sm capitalize"
                  >
                    <i className="fa-sharp fa-solid fa-square-plus"></i> Add
                  </button>
                </div>
                <div className="relative w-28">
                  <input 
                    type="number"
                    className="input-box"
                    placeholder="####"
                    value={item.Piece_cost}
                    onChange={(e) => handlePieceCostChange(item.id, e.target.value)}
                    onFocus={() => handlePieceCostFocus(item.id)}
                    onBlur={() => handlePieceCostBlur(item.id)}
                  />
                  <span className={`input-span ${
                    item.isPieceCostFocused ? 'input-span-focus' : ''
                  }`}>
                    $
                  </span>
                </div>
                <div className="w-28 relative">
                  <input
                    type="number"
                    className="input-box"
                    placeholder=""
                    value={item.Margin}
                    onChange={(e) => handleMarkupChange(item.id, e.target.value)}
                    onFocus={() => handleMarkupFocus(item.id)}
                    onBlur={() => handleMarkupBlur(item.id)}
                  />
                  <span className={`input-span ${
                    item.isMarkupFocused ? 'input-span-focus' : ''
                  }`}>
                    %
                  </span>
                </div>
                <div className="w-28 relative">
                  <input
                    type="number"
                    className="input-box"
                    placeholder="0.00"
                    value={item.piecePrice}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
                <div className="w-28 relative">
                  <input
                    type="number"
                    className="input-box"
                    placeholder="0.00"
                    value={item.amount}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>
            ))}

            {openDescriptionEditorId && (
              <div className="fixed inset-0 bg-white z-50 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Item Description</h2>
                  <button
                    type="button"
                    onClick={handleCloseDescriptionEditor}
                  >
                    <i className="fa-solid fa-xmark text-red-500 font-bold text-xl"></i>
                  </button>
                </div>
                <JoditEditor
                  value={items.find(item => item.id === openDescriptionEditorId)?.Description_Rich_Text || ''}
                  config={config}
                  onBlur={(newContent) => handleDescriptionChange(openDescriptionEditorId, newContent)}
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={addNewItem}
                className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
              >
                <span className="text-xl">+</span> Add New
              </button>
            </div>
          </div>
        </div>

        {/* Accounting Summary Section */}
        <div className="">
          <div className="grid grid-cols-3 gap-6">
            {/* First Column */}
            <div className="space-y-4">
              <h1 className="mt-4 text-gray-700 font-roboto font-semibold">Notes</h1>
              <div className="flex flex-col md:flex-row items-center w-full gap-6">
                {!showPublicNotes && (
                  <button
                    type="button"
                    onClick={() => setShowPublicNotes(true)}
                    className="btn capitalize text-xs px-3"
                  >
                    Add Public Notes
                  </button>
                )}
                {!showPrivateNotes && (
                  <button
                    type="button"
                    onClick={() => setShowPrivateNotes(true)}
                    className="btn capitalize text-xs px-3"
                  >
                    Add Private Notes
                  </button>
                )}
              </div>

              {showPublicNotes && (
                <div className="fixed inset-0 bg-white z-50 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Public Notes</h2>
                    <button
                      type="button"
                      onClick={() => setShowPublicNotes(false)}
                    >
                      <i className="fa-solid fa-xmark text-red-500 font-bold text-xl"></i>
                    </button>
                  </div>
                  <JoditEditor
                    ref={editorPublic}
                    value={formData.publicNotes}
                    config={config}
                    onBlur={newContent => handlePublicNotesChange(newContent)}
                  />
                </div>
              )}

              {showPrivateNotes && (
                <div className="fixed inset-0 bg-white z-50 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Private Notes</h2>
                    <button
                      type="button"
                      onClick={() => setShowPrivateNotes(false)}
                    >
                      <i className="fa-solid fa-xmark text-red-500 font-bold text-xl"></i>
                    </button>
                  </div>
                  <JoditEditor
                    ref={editorPrivate}
                    value={formData.privateNotes}
                    config={config}
                    onBlur={newContent => handlePrivateNotesChange(newContent)}
                  />
                </div>
              )}
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Total Cost</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.totalCost === "0.00" ? "" : accountingSummary.totalCost}
                    placeholder={accountingSummary.totalCost === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Job Profit</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.jobProfit === "0.00" ? "" : accountingSummary.jobProfit}
                    placeholder={accountingSummary.jobProfit === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Job Profit %</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.jobProfitPercent === "0.00" ? "" : accountingSummary.jobProfitPercent}
                    placeholder={accountingSummary.jobProfitPercent === "0.00" ? "" : ""}
                    disabled
                  />
                  <span className="input-span">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Past Due</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.pastDue || ""}
                    placeholder={accountingSummary.pastDue ? "" : "#,###,###"}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Total Receivable</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.totalReceivable === "0.00" ? "" : accountingSummary.totalReceivable}
                    placeholder={accountingSummary.totalReceivable === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Credit Limit</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.creditLimit || ""}
                    placeholder={accountingSummary.creditLimit ? "" : "#,###,###"}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>
            </div>

            {/* Third Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Sub-Total</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.subTotal === "0.00" ? "" : accountingSummary.subTotal}
                    placeholder={accountingSummary.subTotal === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Sales Tax</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.salesTax === "0.00" ? "" : accountingSummary.salesTax}
                    placeholder={accountingSummary.salesTax === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Total</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.total === "0.00" ? "" : accountingSummary.total}
                    placeholder={accountingSummary.total === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Down Payment %</label>
                <div className="relative w-40">
                  <input
                    type="number"
                    className="input-box"
                    value={accountingSummary.downPaymentPercent || ""}
                    placeholder=""
                    onChange={handleDownPaymentChange}
                  />
                  <span className="input-span">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Down Payment Amount</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.downPaymentAmount === "0.00" ? "" : accountingSummary.downPaymentAmount}
                    placeholder={accountingSummary.downPaymentAmount === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 text-sm">Balance Due</label>
                <div className="relative w-40">
                  <input
                    type="text"
                    className="input-box"
                    value={accountingSummary.balanceDue === "0.00" ? "" : accountingSummary.balanceDue}
                    placeholder={accountingSummary.balanceDue === "0.00" ? "#,###,###" : ""}
                    disabled
                  />
                  <span className="input-span">$</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Attachments section */}
        <h1 className="mt-4 text-gray-700 font-roboto font-semibold">Customer Attachments</h1>
        <div className="mx-auto overflow-x-auto mt-4 pb-8">
          <div className="w-[500px]">
            <div className="flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4">
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
                  File Description
                </label>
              </div>
            </div>
            {customerAttachments.map((attachment, index) => (
              <div key={`${attachment.id}-${index}`} className="flex gap-4 mb-4 items-start">
                <button
                  type="button"
                  onClick={() => removeCustomerAttachment(attachment.id)}
                  className="mt-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xs"><i className="fas fa-x"></i></span>
                </button>

                <div className="w-40">
                  <div className="relative">
                    <input
                      type="text"
                      className="input-box"
                      placeholder="Select File"
                      readOnly
                      value={attachment.fileName || (attachment.file ? attachment.file.name : '')}
                      onClick={() => handleCustomerAttachmentFileClick(index)}
                    />
                    <input
                      type="file"
                      className="hidden"
                      ref={(el) => (attachmentFileInputRefs.current[index] = el)}
                      onChange={(e) => handleCustomerAttachmentFileChange(attachment.id, e)}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => handleCustomerAttachmentFileClick(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Enter file description"
                    value={attachment.fileDescription}
                    onChange={(e) =>
                      setCustomerAttachments(
                        customerAttachments.map((a) =>
                          a.id === attachment.id ? { ...a, fileDescription: e.target.value } : a
                        )
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={addNewCustomerAttachment}
                className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
              >
                <span className="text-xl">+</span> Add New
              </button>
            </div>
          </div>
        </div>

        {/* Private Attachments section */}
        <h1 className="mt-4 text-gray-700 font-roboto font-semibold">Private Attachments</h1>
        <div className="mx-auto overflow-x-auto mt-4 pb-8">
          <div className="w-[500px]">
            <div className="flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4">
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
                  File Description
                </label>
              </div>
            </div>
            {privateAttachments.map((attachment, index) => (
              <div key={`${attachment.id}-${index}`} className="flex gap-4 mb-4 items-start">
                <button
                  type="button"
                  onClick={() => removePrivateAttachment(attachment.id)}
                  className="mt-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xs"><i className="fas fa-x"></i></span>
                </button>

                <div className="w-40">
                  <div className="relative">
                    <input
                      type="text"
                      className="input-box"
                      placeholder="Select File"
                      readOnly
                      value={attachment.fileName || (attachment.file ? attachment.file.name : '')}
                      onClick={() => handlePrivateAttachmentFileClick(index)}
                    />
                      <input
                      type="file"
                      className="hidden"
                      ref={(el) => (privateAttachmentFileInputRefs.current[index] = el)}
                      onChange={(e) => handlePrivateAttachmentFileChange(attachment.id, e)}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => handlePrivateAttachmentFileClick(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Enter file description"
                    value={attachment.fileDescription}
                    onChange={(e) =>
                      setPrivateAttachments(
                        privateAttachments.map((a) =>
                          a.id === attachment.id ? { ...a, fileDescription: e.target.value } : a
                        )
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={addNewPrivateAttachment}
                className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
              >
                <span className="text-xl">+</span> Add New
              </button>
            </div>
          </div>
        </div>

        {/* Reference URL section */}
        <h1 className="mt-4 text-gray-700 font-roboto font-semibold">Reference URL</h1>
        <div className="mx-auto overflow-x-auto mt-4">
          <div className="w-[500px]">
            <div className='flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4'>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
                  Description
                </label>
              </div>
            </div>
            {referenceUrls.map((reference, index) => (
              <div key={reference.id} className="flex gap-4 mb-4 items-start">
                <button type='button'
                  onClick={() => removeReferenceUrl(reference.id)}
                  className="mt-2 text-gray-400 hover:text-gray-600"
                >
                  <span className='text-xs'><i className='fas fa-x'></i></span>
                </button>

                <div className="flex-1">
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Enter URL"
                    value={reference.url}
                    onChange={(e) => setReferenceUrls(referenceUrls.map(r =>
                      r.id === reference.id ? { ...r, url: e.target.value } : r
                    ))}
                  />
                </div>

                <div className="flex-1">
                  <textarea
                    className="input-box h-24"
                    placeholder="Enter description"
                    value={reference.description}
                    onChange={(e) => setReferenceUrls(referenceUrls.map(r =>
                      r.id === reference.id ? { ...r, description: e.target.value } : r
                    ))}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <button type='button'
                onClick={addNewReferenceUrl}
                className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
              >
                <span className="text-xl">+</span> Add New
              </button>
            </div>
          </div>
        </div>

        {/* Form buttons */}
        {editSpinner || loadingAccountDetails && <PageSpinner />}
        <div className="flex items-center mt-5 py-2 flex-row gap-3">
          <button type="submit" className="btn">
            <span><i className='fas fa-save mr-2'></i></span> 
            Update
          </button>
          
          <button type='button' 
            onClick={handleCancel} 
            className="btn2"
          >
            <span><i className="fas fa-times mr-2"></i></span>Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;