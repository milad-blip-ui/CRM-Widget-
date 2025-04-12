import React, {useState,useEffect,useRef,useMemo,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext'; 
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CustomDropdown from '../../components/shared/CustomDropdown';
import { formatDate } from '../../utils/dateUtils';
import createEstimate from '../../services/createEstimate';
import { PageSpinner } from '../../components/shared/Spinner';
import {EstimatesContext} from '../../context/EstimateContext'

const Create = ({placeholder }) => {  
  const { data } = useContext(AppContext);
  const { fetchEstimates} = useContext(EstimatesContext);
  const navigate = useNavigate();
  const  [createSpinner, setCreateSpinner] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
   
  // 1. Define your tax rate options array
  const taxRateOptions = [
    { value: "0%", label: "0%" },
    { value: "6%", label: "6%" }
    // Add other tax rate options as needed
  ];

  // 1. Define your options array
  const internalApproverOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
    // Add other options if needed
  ];

  // 1. First define your options array
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

  //Product Type Data
  // Memoize productTypeOptions since it doesn't change often
const productTypeOptions = useMemo(() => 
  data?.allProductTypes?.data?.map(type => ({
    value: type.ID,
    label: type.Type_field,
    taxable: type.Taxable === "true"
  })) || [], 
  [data?.allProductTypes?.data]
);

  //Contact options
  const contactOptions = data?.contact?.data?.length 
  ? data.contact.data.map(contact => ({
      value: `${contact.First_Name} ${contact.Last_Name}`,
      label: `${contact.First_Name} ${contact.Last_Name}`,
    }))
  : [];
  //account name
const accountObject = data?.account?.id ? { 
  value: data.account.id, 
  label: data.account.Account_Name || 'Unnamed Account' 
} : null;
  // 1. Filter employees with Sales profile and transform data
  const salesTeam = data?.allEmployees?.data
  ?.filter(employee => employee.Profile?.display_value === "Sales")
  ?.map(employee => ({
    value: employee.ID,
    label: employee.Name_SL || `${employee.Name?.first_name} ${employee.Name?.last_name}`.trim()
  })) || [];

  //account address 
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // Prepare address data and set default selection
useEffect(() => {
  const addressData = [];
  
  // 1. Add main account address if exists
  if (data?.account) {
    const mainAddress = {
      name: data.account.Account_Name,
      Billing_Street: data.account.Billing_Street,
      Billing_City: data.account.Billing_City,
      Billing_State: data.account.Billing_State,
      Billing_Code: data.account.Billing_Code,
      Shipping_Street: data.account.Shipping_Street,
      Shipping_City: data.account.Shipping_City,
      Shipping_State: data.account.Shipping_State,
      Shipping_Code: data.account.Shipping_Code,
    };
    
    addressData.push(mainAddress);
    setSelectedAddress(mainAddress); // Set as default selected
  }

  // 2. Add additional addresses if exist
  if (data?.address?.data?.length > 0) {
    data.address.data.forEach(address => {
      addressData.push({
        name: address.Name,
        Billing_Street: address.Billing_Street,
        Billing_City: address.Billing_City,
        Billing_State: address.Billing_State,
        Billing_Code: address.Billing_Code,
        Shipping_Street: address.Shipping_Street,
        Shipping_City: address.Shipping_City,
        Shipping_State: address.Shipping_State,
        Shipping_Code: address.Shipping_Code,
      });
    });
  }

  setFetchedData(addressData);
}, [data]);
// Handle address selection change
const handleAddressChange = (selectedName) => {
  const selected = fetchedData.find(addr => addr.name === selectedName);
  setSelectedAddress(selected);
  // Update billing/shipping addresses in form state if needed
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
  //End address section

  //Note section
  // State to control visibility of editors
  const [showPublicNotes, setShowPublicNotes] = useState(false);
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [openDescriptionEditorId, setOpenDescriptionEditorId] = useState(null);

  // Refs for editors
  const editorPrivate = useRef(null); 
  const editorPublic = useRef(null); 
  // Editor configuration
  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: 'Start typings...',
    height:'600px',
    showCharsCounter: false, // Hide character counter
    showWordsCounter: false, // Hide word counter
    showXPathInStatusbar: false, // Hide XPath in status bar
    removeButtons: ['file','speechRecognize'],
  }),
  [placeholder]
  );
 
  //Form data
  const [formData, setFormData] = useState({
    quoteDate: new Date(),
    quoteName: '',
    crmAccountName: accountObject?.value,
    crmAccountNameString: accountObject?.label || '',
    postProduction: '',
    leadTime: '',
    taxRate: '',
    locationName: data?.account?.Account_Name || '',
    approver: '',
    approverName: '' ,
    salesperson: '',
    salespersonName: '', // Add this
    vendorNumber: data?.account?.Vendor_number || '',
    crmContactName: '',
    internalApprover: '',
    privateNotes:'',
    publicNotes:'',
    isHotJob:'',
    billingAddress: {
      street: data?.account?.Billing_Street || '',
      city: data?.account?.Billing_City || '',
      state: data?.account?.Billing_State || '',
      zip: data?.account?.Billing_Code || ''
    },
    shippingAddress: {
      street: data?.account?.Shipping_Street || '',
      city: data?.account?.Shipping_City || '',
      state: data?.account?.Shipping_State || '',
      zip: data?.account?.Shipping_Code || ''
    }

  });

  //Handler for form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value 
    }));
  };

  // Handler for date picker
  const handleDateChange = (date) => {
    // Check if date is valid
    if (!date || isNaN(new Date(date).getTime())) {
      toast.error('Invalid date selected');
      return;
    }
    setFormData(prev => ({
      ...prev,
      quoteDate: date
    }));
  };

  // Handler for private notes editor
  const handlePrivateNotesChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      privateNotes: newContent
    }));
  };

  // Handler for public notes editor
  const handlePublicNotesChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      publicNotes: newContent
    }));
  };


  // Items section
  const [items, setItems] = useState([
    {
      id: 1,
      Item: "",
      Qty: "",
      Unit: "",
      Description_Rich_Text: "",
      Tiered: false,
      Option: false,
      Product_Type1: "", // New field for Product Type
      Piece_cost: "", // New field for Piece Cost
      Margin: "", // New field for Markup
      piecePrice: "0.00", // Initialize as string
      amount: "0.00", // Initialize as string
    },
  ]);

  const addNewItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        Item: "",
        Qty: "",
        Unit: "",
        Description_Rich_Text: "",
        Tiered: false,
        Option: false,
        Product_Type1: "",
        Piece_cost: "",
        Margin: "",
        piecePrice: "0.00", // Initialize as string
        amount: "0.00", // Initialize as string
        isPieceCostFocused: false, // Add this
        isMarkupFocused: false 
      },
    ]);
  };
  const hasTieredOrOptionItems = useMemo(() => {
    return items.some(item => item.Tiered || item.Option);
  }, [items]);

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
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
  
// Handler for Piece Cost change
const handlePieceCostChange = (id, value) => {
  setItems(prevItems => {
    const newItems = prevItems.map(item => {
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
    return newItems;
  });
};

// Handler for Markup change
const handleMarkupChange = (id, value) => {
  setItems(prevItems => {
    const newItems = prevItems.map(item => {
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
    return newItems;
  });
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

  const handleMarkupBlur = (id) => {
    setItems(items.map(item => 
      item.id === id ? {...item, isMarkupFocused: false} : item
    ));
  };

// Handler for Quantity change
const handleQtyChange = (id, value) => {
  setItems(prevItems => {
    const newItems = prevItems.map(item => {
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
    return newItems;
  });
};
  
  // Handler for Tiered checkbox
  const handleTieredChange = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, Tiered: !item.Tiered, Option: false };
      }
      return item;
    }));
  };

  // Handler for Option checkbox
  const handleOptionChange = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, Option: !item.Option, Tiered: false };
      }
      return item;
    }));
  };

  // Unit options
  const unitOptions = ['Box', 'Each', 'Feet', 'Pieces', 'Sheet', 'Sq Feet', 'Units'];

  // Handler for opening the description editor for a specific item
  const handleOpenDescriptionEditor = (id) => {
    setOpenDescriptionEditorId(id);
  };

  // Handler for closing the description editor
  const handleCloseDescriptionEditor = () => {
    setOpenDescriptionEditorId(null);
  };

  // Handler for updating the description of an item
  const handleDescriptionChange = (id, newContent) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, Description_Rich_Text: newContent } : item
    ));
  };

  // Add these state variables at the top of your component
const [accountingSummary, setAccountingSummary] = useState({
  totalCost: 0,
  subTotal: 0,
  jobProfit: 0,
  jobProfitPercent: 0,
  salesTax: 0,
  total: 0,
  pastDue: 0,
  downPaymentPercent: 0,
  downPaymentAmount: 0,
  creditLimit: 0,
  balanceDue: 0,
  totalReceivable: 0
});
// 1. First, calculate derived values without setting state
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

// 2. Use useMemo to memoize the calculations
const derivedValues = useMemo(() => {
  return calculateDerivedValues(items, formData.taxRate, accountingSummary.downPaymentPercent);
}, [items, formData.taxRate, accountingSummary.downPaymentPercent, forceUpdate]);

// Call this whenever items, tax rate, or down payment changes
useEffect(() => {
  setAccountingSummary(prev => ({
    ...prev,
    ...derivedValues.summary
  }));
}, [derivedValues.summary]);

// Update your Down Payment % input to handle changes
const handleDownPaymentChange = (e) => {
  const value = parseFloat(e.target.value) || 0;
  setAccountingSummary(prev => ({
    ...prev,
    downPaymentPercent: value
  }));
};
  //Items section ended

  // Customer Attachments section
  const [customerAttachments, setCustomerAttachments] = useState([{ id: 1, file: null, fileDescription: '',fileName: '' }]);
  const attachmentFileInputRefs = useRef([]);

  const addNewCustomerAttachment = () => {
    setCustomerAttachments([
      ...customerAttachments,
      {
        id: customerAttachments.length + 1,
        file: null,
        fileDescription: '',
         fileName: '',
      },
    ]);
  };

  const removeCustomerAttachment = (id) => {
    setCustomerAttachments(customerAttachments.filter((attachment) => attachment.id !== id));
  };

  const handleCustomerAttachmentFileChange = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setCustomerAttachments(
      customerAttachments.map((attachment) =>
        attachment.id === id ? { ...attachment, file,fileName: file.name } : attachment
      )
    );
  };

  const handleCustomerAttachmentFileClick = (index) => {
    attachmentFileInputRefs.current[index]?.click();
  };

  // Private Attachments section
  const [privateAttachments, setPrivateAttachments] = useState([{ id: 1, file: null, fileDescription: '',fileName: '' }]);
  const privateAttachmentFileInputRefs = useRef([]);

  const addNewPrivateAttachment = () => {
    setPrivateAttachments([
      ...privateAttachments,
      {
        id: privateAttachments.length + 1,
        file: null,
        fileDescription: '',
         fileName: '',
      },
    ]);
  };

  const removePrivateAttachment = (id) => {
    setPrivateAttachments(privateAttachments.filter((attachment) => attachment.id !== id));
  };

  const handlePrivateAttachmentFileChange = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setPrivateAttachments(
      privateAttachments.map((attachment) =>
        attachment.id === id ? { ...attachment, file, fileName: file.name } : attachment
      )
    );
  };

  const handlePrivateAttachmentFileClick = (index) => {
    privateAttachmentFileInputRefs.current[index]?.click();
  };

      // Reference URL section
  const [referenceUrls, setReferenceUrls] = useState([{ id: 1, url: '', description: '' }]);

  const addNewReferenceUrl = () => {
    setReferenceUrls([...referenceUrls, {
      id: referenceUrls.length + 1,
      url: '',
      description: ''
    }]);
  };

  const removeReferenceUrl = (id) => {
    setReferenceUrls(referenceUrls.filter(reference => reference.id !== id));
  };
  
  // Create a separate function for resetting the form
  const resetFormToDefault = () => {

    // Reset the form if using a form ref
    if (formRef.current) {
      formRef.current.reset();
    }

    setFormData({
      quoteDate: new Date(),
      quoteName: '',
      crmAccountName: accountObject?.value,
      crmAccountNameString: accountObject?.label || '',
      postProduction: '',
      leadTime: '',
      taxRate: '',
      locationName: data?.account?.Account_Name || '',
      approver: '',
      approverName: '',
      salesperson: '',
      salespersonName: '', 
      vendorNumber: data?.account?.Vendor_number || '',
      crmContactName: '',
      internalApprover: '',
      privateNotes: '',
      publicNotes: '',
      isHotJob: '',
      billingAddress: {
        street: data?.account?.Billing_Street || '',
        city: data?.account?.Billing_City || '',
        state: data?.account?.Billing_State || '',
        zip: data?.account?.Billing_Code || ''
      },
      shippingAddress: {
        street: data?.account?.Shipping_Street || '',
        city: data?.account?.Shipping_City || '',
        state: data?.account?.Shipping_State || '',
        zip: data?.account?.Shipping_Code || ''
      }
      
    });
  
    // Reset items to initial state
    setItems([{
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
      amount: "0.00"
    }]);
  
    // Reset attachments and URLs
    setCustomerAttachments([{ id: 1, file: null, fileDescription: '',fileName: '' }]);
    setPrivateAttachments([{ id: 1, file: null, fileDescription: '',fileName: '' }]);
    setReferenceUrls([{ id: 1, url: '', description: '' }]);
  
    // Reset notes editors visibility
    setShowPublicNotes(false);
    setShowPrivateNotes(false);
    setOpenDescriptionEditorId(null);
  
    // Reset accounting summary
    setAccountingSummary({
      totalCost: 0,
      subTotal: 0,
      jobProfit: 0,
      jobProfitPercent: 0,
      salesTax: 0,
      total: 0,
      pastDue: 0,
      downPaymentPercent: 0,
      downPaymentAmount: 0,
      creditLimit: 0,
      balanceDue: 0,
      totalReceivable: 0
    });
  };
  const generateRichNotePDF = async (htmlContent, title, filename) => {
    // Create a temporary container for the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '190mm'; // A4 width
    tempDiv.style.padding = '20px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.backgroundColor = '#ffffff';
    
    // Add title and content with basic styling
    tempDiv.innerHTML = `
      <div style="max-width: 100%; word-wrap: break-word;">
        <h1 style="font-size: 18px; color: #333; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
          ${title}
        </h1>
        <div style="font-size: 14px; line-height: 1.5;">
          ${htmlContent}
        </div>
      </div>
    `;
  
    document.body.appendChild(tempDiv);
  
    try {
      // Convert the HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight
      });
  
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to maintain aspect ratio
      const pageWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm margins on each side
      const pageHeight = pdf.internal.pageSize.getHeight() - 20;
      const imgRatio = canvas.width / canvas.height;
      let imgWidth = pageWidth;
      let imgHeight = imgWidth / imgRatio;
  
      // If content is too tall, scale down
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = imgHeight * imgRatio;
      }
  
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Convert to File object with proper metadata
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], filename, {
        type: 'application/pdf',
        lastModified: Date.now()
      });
  
      return pdfFile;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
      // Clean up temporary element
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    }
  };
  // Handler for Form Submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  // Required fields check
  const requiredFields = {
    quoteName: 'Quote Name',
    postProduction: 'Post Production',
    taxRate: 'Tax Rate',
    // Add other required fields
  };
  
  const missingFields = Object.entries(requiredFields)
    .filter(([field]) => !formData[field])
    .map(([_, name]) => name);
    
  if (missingFields.length > 0) {
    toast.error(`Missing required fields: ${missingFields.join(', ')}`);
    return;
  }

    setCreateSpinner(true);   

    // Create copies of attachments arrays to modify
    let finalCustomerAttachments = [...customerAttachments];
    let finalPrivateAttachments = [...privateAttachments];

        // Generate PDF for public notes
  if (formData.publicNotes && formData.publicNotes.trim() !== '') {
    const publicNotesPDF = await generateRichNotePDF(
      formData.publicNotes, 
      'Public Notes',
      'Public_Notes.pdf' // Explicit filename
    );
    finalCustomerAttachments.push({
      id: finalCustomerAttachments.length + 1,
      file: publicNotesPDF, // Now a File object
      fileDescription: 'Public Notes',
      fileName: 'Public_Notes.pdf'
    });
  }

  // Same for private notes
  if (formData.privateNotes && formData.privateNotes.trim() !== '') {
    const privateNotesPDF = await generateRichNotePDF(
      formData.privateNotes,
      'Private Notes',
      'Private_Notes.pdf' // Explicit filename
    );
    finalPrivateAttachments.push({
      id: finalPrivateAttachments.length + 1,
      file: privateNotesPDF, // Now a File object
      fileDescription: 'Private Notes',
      fileName: 'Private_Notes.pdf'
    });
  }

    const refURLS = referenceUrls
    .map(item => {
        if (item.url) { 
            return { Url: { url: item.url },Description:item.description };
        }
    }).filter(item => item !== undefined);
    console.log(formData);
    console.log(items);
    console.log(customerAttachments);
    console.log(privateAttachments);
    console.log(referenceUrls);
 
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
        Billing_Name: data?.account?.Account_Name || '',
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
        Customer_Attachments: finalCustomerAttachments.map(att => ({
          file: att.file,
          fileDescription: att.fileDescription,
          fileName: att.fileName // Add this
        })),
        Private_Attachments: finalPrivateAttachments.map(att => ({
          file: att.file,
          fileDescription: att.fileDescription,
          fileName: att.fileName // Add this
        })),
        CRM_Account_Name_String: formData.crmAccountNameString, 
        SalespersonName: formData.salespersonName,
        ApproverName: formData.approverName,
        Quote_Rev_int:null,
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
    const result = await createEstimate(payload, finalCustomerAttachments, finalPrivateAttachments);
    if (result.data) {
      toast.success('Record created successfully!');
      resetFormToDefault();
      await fetchEstimates();
      navigate('/');
    } else {
      // Log the result in case of failure for debugging
      console.error('Failed to create record:', result);
      toast.error('Failed to create record. Please try again.'); 
    }
  } catch (error) {
    console.error('Error creating estimate:', error);
    toast.error('An error occurred while creating the record.'); 
  } finally {
    setCreateSpinner(false);
  }
  }

  //Handler for Form Reset
  const formRef = useRef(null);
  const handleReset = () => {
    resetFormToDefault();
  };
  return (
    <div className='flex bg-gray-25 items-center w-full'>
      <form onSubmit={handleSubmit} ref={formRef} className="p-6  space-y-4 w-full">
      <div className=" flex flex-col md:flex-row gap-6 w-full mb-8">
        <div className=" ">
          <div>
              <label className="input-label">
                CRM Account <span className="text-red-500">*</span>
              </label>
              <select
                name="crmAccountName"
                className="input-box"
                value={formData.crmAccountName}
                readOnly
              >
                  <option>{accountObject?.label}</option>
              </select>
            </div>
            {/* <div className='mt-4'>
              <label className="input-label">
                CRM Contact
              </label>
              <select
                name="crmContactName"
                className="input-box"
                value={formData.crmContactName}
                onChange={handleChange}
              >
                <option value="">CRM Contact</option>
               
              </select>
            </div> */}
            <div className='mt-4'>
            <label className="input-label">
              CRM Contact
            </label>
            <CustomDropdown
              options={contactOptions}
              value={formData.crmContactName}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                crmContactName: value
              }))}
              placeholder="-Select-"
              className="w-full"
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
             
            </div>
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
        <div className=" ">
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
        <div className=" ">
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
          {/* Conditionally render Approver dropdown if internalApprover is "yes" */}
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
                className="input-box" // Gray background indicates readonly
                value={data?.account?.Vendor_number || ''} // Directly use account data
                readOnly // Makes the field non-editable
                onChange={() => {}} // Empty handler to prevent warnings
              />
          </div>
          {/* Is Hot Job */}
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
        <div className=" md:w-96">
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
        
        {/* Display selected address details */}
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
          {/* {!loading &&( */}
            <div className=''>
        
            {/* Add New Addresses Button */}
          <button 
            // onClick={handleAddNew} 
          type='button' className="text-indigo-500 mt-2 hover:text-indigo-600 font-medium flex items-center gap-1"
          >
           <span className='text-xl'>+</span>
            Add new address
          </button>
          </div>
        {/* )} */}

        </div>
      </div>
  
     {/* Items Section */}
        <h1 className="mt-4 text-gray-700 font-roboto font-semibold">Item Details</h1>
        <div className="mx-auto overflow-x-auto mt-4 ">
          <div className="min-w-[700px]">
          {/* Header Section */}
          <div className='flex gap-4 items-start bg-gray-100 p-2 rounded-sm px-7 mb-4'>
            {/* Tiered Header */}
            <div className="w-12 ">
              <label className="block text-sm font-medium text-gray-700  mb-1">Tiered</label>
            </div>
            {/* Option Header */}
            <div className="w-12 ">
              <label className="block text-sm font-medium text-gray-700 mb-1">Option</label>
            </div>

            {/* Product Type Header */}
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Type
              </label>
            </div>

            {/* Item Details Header */}
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Details <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Quantity Header */}
            <div className="w-16">
              <label className="block text-sm font-medium text-gray-700 ml-3 mb-1">
                Qty <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Unit Header */}
            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 ml-3 mb-1">
                Unit <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Description Header */}
            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">
                Description
              </label>
            </div>
             {/* Piece Cost Header */}
        <div className="w-32 ">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Piece Cost ($)
          </label>
        </div>
  
        {/* Markup Header */}
        <div className="w-28">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Markup (%)
          </label>
        </div>
  
        {/* Piece Price Header */}
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Piece Price ($)
          </label>
        </div>
  
        {/* Amount Header */}
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
                {/* Tiered and Option Checkboxes */}
                <div className="flex mt-3 items-center  gap-12 w-28">
                  <input
                    type="checkbox"
                    checked={item.Tiered}
                    onChange={() => handleTieredChange(item.id)}
                    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-0"
                    disabled={item.id === 1}
                  />
                  <input
                    type="checkbox"
                    checked={item.Option}
                    onChange={() => handleOptionChange(item.id)}
                    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-0"
                    disabled={item.id === 1}
                  />
                </div>

                 {/* Product Type */}
                 <div className="w-44">
                  {/* <select
                    className="input-box"
                    value={item.productType}
                    onChange={(e) => handleProductTypeChange(item.id, e.target.value)}
                  >
                    <option value="" disabled>-Select-</option>
                    {productTypes.map((type) => (
                      <option key={type.ID} value={type.ID}>
                        {type.Type_field}
                      </option>
                    ))}
                  </select> */}
                  <CustomDropdown
                    options={productTypeOptions}
                    value={item.Product_Type1}
                    onChange={(value) => handleProductTypeChange(item.id, value)}
                    placeholder="-Select-"
                    className="w-full"
                    searchable="true"
                  />
                </div>

                {/* Item Details */}
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
                {/* Quantity */}      
                <div className="w-16">
                <input
                  type="text"
                  className="input-box"
                  placeholder="######"
                  value={item.Qty}
                  onChange={(e) => handleQtyChange(item.id, e.target.value)}
                />
              </div>
                {/* Unit */}
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
                {/* Description */}
                <div className="w-20">
                  <button
                    type="button"
                    onClick={() => handleOpenDescriptionEditor(item.id)}
                    className="btn2 py-[7px] px-3 text-sm capitalize"
                  >
                   <i className="fa-sharp fa-solid fa-square-plus"></i> Add
                  </button>
                </div>

                {/* Piece Cost Input */}
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

                {/* Markup Input */}
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
        
                {/* Piece Price */}
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
        
                {/* Amount */}
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

            {/* Full-Screen Description Editor */}
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
    {/* end items */}

      {/* Accounting Summary Section */}
      <div className="">
        {/* <h1 className="text-gray-700 font-roboto font-semibold mb-4">Accounting Summary</h1>
         */}
        <div className="grid grid-cols-3 gap-6">
          {/* First Column */}
          <div className="space-y-4">
        {/* Public Notes and Private Notes Section */}
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

        {/* Public Notes Editor */}
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

        {/* Private Notes Editor */}
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
      {/*ENd Public Notes and Private Notes Section */}
          </div>
        {/* Second Column */}
        <div className="space-y-4">
          {/* Total Cost */}
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

          {/* Job Profit ($) */}
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

          {/* Job Profit (%) */}
          <div className="flex items-center justify-between">
            <label className="text-gray-600 text-sm">Job Profit %</label>
            <div className="relative w-40">
              <input
                type="text"
                className="input-box"
                value={accountingSummary.jobProfitPercent === "0.00" ? "" : accountingSummary.jobProfitPercent}
                placeholder={accountingSummary.jobProfitPercent  === "0.00" ? "" : ""}
                disabled
              />
              <span className="input-span">%</span>
            </div>
          </div>

          {/* Past Due - This one works as is */}
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

          {/* Total Receivable */}
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

          {/* Credit Limit - This one works as is */}
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
          {/* Sub-Total */}
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

          {/* Sales Tax */}
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

          {/* Total */}
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

          {/* Down Payment % - This one works as is */}
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

          {/* Down Payment Amount */}
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

          {/* Balance Due */}
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
              <div key={attachment.id} className="flex gap-4 mb-4 items-start">
                <button
                  type="button"
                  onClick={() => removeCustomerAttachment(attachment.id)}
                  className="mt-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xs">
                    <i className="fas fa-x"></i>
                  </span>
                </button>

                <div className="w-40">
                  <div className="relative">
                    <input
                      type="text"
                      className="input-box"
                      placeholder="Select File"
                      readOnly
                      value={attachment.file ? attachment.file.name : ''}
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
        {/* END Customer Attachments section */}

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
              <div key={attachment.id} className="flex gap-4 mb-4 items-start">
                <button
                  type="button"
                  onClick={() => removePrivateAttachment(attachment.id)}
                  className="mt-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xs">
                    <i className="fas fa-x"></i>
                  </span>
                </button>

                <div className="w-40">
                  <div className="relative">
                    <input
                      type="text"
                      className="input-box"
                      placeholder="Select File"
                      readOnly
                      value={attachment.file ? attachment.file.name : ''}
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
        {/* END Private Attachments section */}
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
      {/* end refrence url */}
      {/* create reset button */}
      {createSpinner && <PageSpinner />}
      <div className="flex items-center mt-5 py-2 flex-row gap-3">
              <button type="submit"
                className="btn"
              >
                <span><i className='fas fa-save mr-2'></i></span> 
                Save
                {/* {createSpinner&&(
                  <svg width="20" height="20" fill="currentColor" className="ml-2 mt-[2px] animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                </path>
              </svg>
              )} */}
              </button>
              
              <button type='button' 
                 onClick={handleReset} 
                className="btn2"
              >
                <span><i className="fas fa-refresh mr-2"></i></span>Reset
              </button>
      </div>
      </form>
    </div>
  )
}

export default Create; // Also ensure this matches the new component name


