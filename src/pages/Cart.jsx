import React, {useState,useEffect,useRef} from 'react';
import {useContext} from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import fetchAccountAddress from '../services/fetchAccountAddress';
import createRFQ from '../services/createRFQ';
import createSalesOrder from '../services/createSalesOrder';
import { formatDate } from '../utils/dateUtils'
import { AppContext } from '../context/AppContext'; 
import { accountData } from '../data'
import AddressModal from '../components/Quote/AddressModal'
const Cart = () => { 
    const { loginUser, setLoginUser, cartItems,setCartItems, addToCart, removeFromCart } = useContext(AppContext);
    console.log(cartItems)
    const accountId = loginUser?.CRM_Account_Name?.ID;
    const accountType = loginUser["Customer_Accounts.Account_Type"];
    const isItemApprovalRequired = loginUser["Customer_Accounts.is_approval_required"];
///////////////////////////////////////////////////////////////
 const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const  [createSpinner, setCreateSpinner] = useState(false);
  const [mainBillingAddress, setMainBillingAddress] = useState('');
  const [shippingAddressName, setShippingAddressName] = useState('');
  const [crmAccountId, setCRMAccountId] = useState('');
  const postProductionOptions = ['Post Production','We Deliver (Our Vehicle)', 'We Deliver (Rented Truck)', 'Customer Pickup','Dropship','Send UPS/Fedex (Our Account)','Send UPS/Fedex (Customer Account)','Freight Delivery','Install','Unknown'];
  const [selectedPostProductionOption, setSelectedPostProductionOption] = useState(postProductionOptions[0]);
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  })
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  })
  useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await fetchAccountAddress(accountId);
            const addressData = [];
          addressData.push({
            name: result.data.account.Account_Name,
            Billing_Street: result.data.account.Billing_Street,
            Billing_City:result.data.account.Billing_City,
            Billing_State:result.data.account.Billing_State,
            Billing_Code:result.data.account.Billing_Code,
            Shipping_Street:result.data.account.Shipping_Street,
            Shipping_City:result.data.account.Shipping_City,
            Shipping_State:result.data.account.Shipping_State,
            Shipping_Code:result.data.account.Shipping_Code,
          });
         // Check if result.data.address is an array and has items
        //  console.log(result.data.address)
        //  console.log(result.data.address.data.length)
if (result.data.address !== "") {
  result.data.address.data.forEach(address => {
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
} else {
  // Handle the case where address is an empty string or not an array
  console.log('No address data available');
  // Optionally, you could add default values or leave addressData empty
}
          setBillingAddress({
            street: result.data.account.Billing_Street,
            city:result.data.account.Billing_City,
            state: result.data.account.Billing_State,
            zip: result.data.account.Billing_Code,
          })
          setShippingAddress({
            street: result.data.account.Shipping_Street,
            city: result.data.account.Shipping_City,
            state: result.data.account.Shipping_State,
            zip: result.data.account.Shipping_Code,
          })
          setMainBillingAddress(result.data.account.Account_Name);
          setCRMAccountId(result.data.account.id)
          setFetchedData(addressData);
          setLoading(false)
        } catch (error) {
            console.error("Error fetching address:", error);
            // if (error.status === 404) {
            //   setItemNotFound(true);
            //   setItems([]);
            // }
        }finally{
          //setISpinner(false);
        }
    };
if(cartItems.length !== 0){
  fetchData(); 
}
}, []);

const [errors, setErrors] = useState({});
const [formData, setFormData] = useState({
    quoteName: '',
    postProduction:'',
    quoteDescription:'',
});
const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'postProduction'){
      setSelectedPostProductionOption(e.target.value)
    }
if(name === "accountAddress"){
  fetchedData.forEach(address => {
    if(address.name === e.target.value){
      setBillingAddress({
        street: address.Billing_Street,
        city: address.Billing_City,
        state: address.Billing_State,
        zip: address.Billing_Code
      })
      setShippingAddress({
        street: address.Shipping_Street,
        city: address.Shipping_City,
        state: address.Shipping_State,
        zip: address.Shipping_Code
      })
    }
  })
  if(mainBillingAddress !== e.target.value){
    setShippingAddressName(e.target.value);
  }
}

    setFormData({
        ...formData,
        [name]: value,
    });
    // Clear the error for the field being changed
    setErrors({
        ...errors,
        [name]: '',
      });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};
  if (!formData.quoteName) {
    newErrors.quoteName = "Quote name is required";
  }
  if (!formData.postProduction) {
    newErrors.postProduction = "Post production is required";
  }
  // If there are errors, set them and do not submit
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  setCreateSpinner(true);
  try {
    const currentDate = new Date();
    const formattedCurrentDateString = currentDate.toISOString().split("T")[0];
    const items = cartItems.map(item => {
      // Dynamically construct the Description string from the property object
      let description = Object.entries(item.property)
          .filter(([key]) => !key.includes('file_upload')) // Filter out keys containing 'file_upload'
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n'); // Join each key-value pair with a newline
        //  if(accountType === "Customer Specific"){
            description = `${item.overview}\n${description}`;
         // }
      // Get the file_upload object directly
      const file = Object.entries(item.property)
          .filter(([key]) => key.includes('file_upload')) // Only include keys containing 'file_upload'
          .map(([_, value]) => value)[0]; // Get the first file object (assuming there's only one)
  
      return {
          Item: `${item.name}`,
          Qty: item.quantity,
          Description: `${item.description} \n ${description}`,
          file: file || null,
          Piece_cost:item.price,
          Margin:0
      };
  });
  //first check if isItemApprovalRequired then we create estimate if isItemApprovalRequired is false we cretae so
  if(isItemApprovalRequired === "true"){
        // Prepare data for Zoho Creator
        const payload = {
          data: {
            Tax_rate_dropdown: "0%",
            Quote_name: formData.quoteName,
            Quote_approval: "No",
            Status: "",
            Archived:"true",
            Source: "Portal",
            Post_production: selectedPostProductionOption,
            Shipping_Name: shippingAddressName,
            Billing_Name: mainBillingAddress,
            Ship_To: {
              //address_line_1: shippingAddress.street,
              address_line_2: shippingAddress.street,
              district_city: shippingAddress.city,
              state_province: shippingAddress.state,
              postal_Code: shippingAddress.zip,
            },
            Bill_To: {
              address_line_1: billingAddress.street,
              postal_Code: billingAddress.zip,
              district_city: billingAddress.city,
              state_province: billingAddress.state,
            },
            Item_Details: items,
            Notes: formData.quoteDescription,
            CRM_Account_Name: crmAccountId,
            Quote_date: formatDate(formattedCurrentDateString),
          },
        };
       const result = await createRFQ(payload, items)
       console.log(result.data)
  }
  if(isItemApprovalRequired === "false"){
    // Prepare data for Zoho Creator
    const payload = {
      data: {
        Tax_rate: "0%",
        SO_name: formData.quoteName,
       // Quote_approval: "No",
        Status: "Draft",//Sent to design
        Source: "Portal",
        Post_production: selectedPostProductionOption,
        Shipping_Name: shippingAddressName,
        Billing_Name: mainBillingAddress,
        Portal_Status:"Received",
        Ship_To: {
          //address_line_1: shippingAddress.street,
          address_line_2: shippingAddress.street,
          district_city: shippingAddress.city,
          state_province: shippingAddress.state,
          postal_Code: shippingAddress.zip,
        },
        Bill_To: {
          address_line_1: billingAddress.street,
          postal_Code: billingAddress.zip,
          district_city: billingAddress.city,
          state_province: billingAddress.state,
        },
        Item_Details: items,
        Notes: formData.quoteDescription,
        CRM_Account_Name: crmAccountId,
        SO_Date: formatDate(formattedCurrentDateString),
      },
    };
   const result = await createSalesOrder(payload, items)
   console.log(result.data)
}

//////notifeaction and reset part///////////////////////////////////////////////////////////////
// Show success notification
    toast.success('Record created successfully!');    
// Reset cart
setCartItems([])
//off create spinner
    setCreateSpinner(false);
    setShippingAddressName("");
// Reset form data
    setSelectedPostProductionOption(postProductionOptions[0])
    setFormData({
      quoteName: "",
      quoteDescription: "",
    });
  } catch (error) {
    console.error("Error sending data to Zoho Creator:", error);
  }
};
const formRef = useRef(null);
const handleReset = () => {
    if (formRef.current) {
        formRef.current.reset();
        setFormData({
          quoteName:'',
          quoteDescription:'',
        })
        setSelectedPostProductionOption(postProductionOptions[0]);
        //setItems([{ id: 1, Item: '', Qty: '', Description: '', file: null }]);
    }
    setBillingAddress({
      street: '',
      city: '',
      state: '',
      zip: ''
    })
  
    setShippingAddress({
      street: '',
      city: '',
      state: '',
      zip: ''
    })
    
}
////// adding new address///////
const [isModalOpen, setIsModalOpen] = useState(false)
//const [selectedAddress, setSelectedAddress] = useState(null)
const handleAddNew = () => {
  // setSelectedAddress(null)
  setIsModalOpen(true)
}
////////////////////////////////////////////////
const incrementCount = (id) => {
  setCartItems((prevCartItems) =>
    prevCartItems.map((item) => {
      if (item.id === id) {
        // Check if item has stock defined
        if (item.Stock !== "") {
          // Only allow increment if current quantity is less than stock
          if (item.quantity < item.Stock) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            toast.error('Quantity exceeded stock.');
            return item; // Return the item unchanged
          }
        } else {
          // If Stock is not defined, allow increment
          return { ...item, quantity: item.quantity + 1 };
        }
      }
      return item; // Return unchanged item if id does not match
    })
  );
};
const decrementCount = (id) => {
  setCartItems((prevCartItems) =>
    prevCartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    )
  );
};
    return (
     
      <div>
        {cartItems.length === 0 ? (
          <div className='flex items-center justify-center '>
          <div className=' text-center p-4 text-gray-800'>
              <img className='w-24 md:w-32 mx-auto' src='https://cdn-icons-png.flaticon.com/512/9374/9374328.png' alt="Cart Icon" />
              <h1 className='mt-4 text-xl mb-1 '>Your cart is empty.</h1>
              <p className='text-sm mb-6'>Looks like you haven't made your choice yet.</p>
              <Link
                to="/"
                className="bg-primary border border-primary text-white px-6 py-2 rounded  hover:bg-transparent hover:text-primary transition duration-500 hover:border-primary"
              >
                Start Shopping
              </Link>
          </div>
      </div>
        ) : (
            
        <>
        <form onSubmit={handleSubmit} ref={formRef}>
          {/* main top aria */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 ">
              <div>
                      <label htmlFor="quoteName" className="text-gray-600 mb-2 block text-sm" >Name <span className="text-primary">*</span></label>
                      <input type="text" onChange={handleChange} value={formData.quoteName} placeholder="Name" className="input-box" name='quoteName' id="quoteName" />
                      {errors.quoteName && <span className="text-red-500 text-xs">{errors.quoteName}</span>}
              </div>
              <div className='mt-4'>
                      <label className="text-gray-600 mb-2 block text-sm" htmlFor="postProduction">Post Production <span className="text-primary">*</span></label>
                      <select id='postProduction' name='postProduction' value={selectedPostProductionOption} className='input-box' onChange={handleChange}>
                      {postProductionOptions.map((option, index) => (
                          <option key={index} value={option}>
                              {option}
                          </option>
                      ))}
                      </select>
                      {errors.postProduction && <span className="text-red-500 text-xs">{errors.postProduction}</span>}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className='relative'>
                      <label className="text-gray-600 mb-2 block text-sm" htmlFor="accountAddress">Account Address <span className="text-primary">*</span></label>
                      <div>
                      <select id='accountAddress' name='accountAddress' className='input-box' onChange={handleChange}>
                        {/* <option>Select Address</option> */}
                        {fetchedData.map((option) => (
                          <option key={option.name} value={option.name}> 
                            {option.name} 
                          </option>
                        ))}
                      </select>
                      {loading && (<div role="status" className='absolute top-9 left-3'>
                        <svg width="20" height="20" fill="currentColor" className="ml-2 mt-1 animate-spin color-primary" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                          </path>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>)}
                      </div>
                      {/* {errors.accountAddress && <span className="text-red-500 text-xs">{errors.accountAddress}</span>} */}
              </div>
              {!loading &&(<div className=''>
              <div className='mt-4 flex items-center justify-start gap-16'>
                  <div>
                  <h2 className="text-sm mb-2 text-gray-400">BILLING ADDRESS</h2>
                  <p className="text-gray-800 text-sm font-poppins">{billingAddress.street}</p>
                  <p className="text-gray-800 text-sm font-poppins">
                    {billingAddress.city}, {billingAddress.state}, {billingAddress.zip}
                  </p>
                  </div>
                  <div>
                  <h2 className="text-sm mb-2 text-gray-400">SHIPPING ADDRESS</h2>
                  <p className="text-gray-800 text-sm font-poppins">{shippingAddress.street}</p>
                  <p className="text-gray-800 text-sm font-poppins">
                    {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zip}
                  </p>
                  </div>
              </div>
                {/* Add New Addresses Button */}
              <button 
                onClick={handleAddNew} 
              type='button' className="mt-2 flex text-sm items-center  text-primary hover:text-primary"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add new address
              </button>
              </div>)}

            </div>
            <div className="col-span-1 ">
            <div className=''>
                  <label className="text-gray-600 mb-2 block text-sm" htmlFor="quoteDescription">Notes</label>
                    <textarea name='quoteDescription' onChange={handleChange} placeholder='Notes' id='quoteDescription' value={formData.quoteDescription} className='w-full border border-gray-200 input-box text-gray-600 h-40'></textarea>
                  </div>
            </div>
          </div>
          {/* line items */}
          <div className='mt-3'>
              <div className="hidden lg:flex mb-2 bg-gray-100 rounded-sm items-center justify-between py-2 px-5 text-gray-800">
              <span></span>
              <span>Item Details</span>
              {accountType !== "Generic" ? <span>Overview</span> : ""}
              <span>Property</span>
              <span className="mr-12">Quantity</span>
          </div>
          {/* one item */}
          {cartItems.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-center mb-4 gap-2 p-4 px-6 border border-gray-200 rounded">
              {/* <!-- cart image --> */}
              <div className="w-28 flex-shrink-0">
                  <img src={item.image} className="w-full" />
              </div>
              {/* <!-- end cart image -->

              <!-- cart content --> */}
              <div className={accountType !=="Generic" ? "w-1/3" : "w-full "}>
                  <h5 className="text-gray-800 font-medium uppercase">{item.name}</h5>
                  <p className="text-gray-800 ">{item.description}</p>
              </div>

          <div className="flex-row w-full flex items-center justify-between gap-4">
                  
                  {/* <!-- overview --> */}
                  {accountType !== "Generic" ? 
                  <div className="text-gray-800 text-sm w-1/2">
                      {item.overview}
                  </div>
                  : ""}
                  
                  {/* property */}
                  <div className="text-gray-800 text-sm w-1/2">
                  {Object.entries(item.property).map(([key, value]) => (
                      !key.includes('file_upload') && (
                          <div key={key}>
                              {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                          </div>
                      )
                  ))}
                  </div>
                  {/* <!-- Quantity control --> */}
                  <div className="mt-2">
                      
                      <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                          <button type='button' onClick={() => decrementCount(item.id)} className="w-8 h-8 text-xl flex items-center justify-center cursor-pointer select-none hover:bg-gray-300 transition">-</button>
                          <div className="w-10 h-8 text-base flex items-center justify-center">{item.quantity}</div>
                          <button type='button' onClick={() => incrementCount(item.id)} className="w-8 h-8 text-xl flex items-center justify-center cursor-pointer select-none hover:bg-gray-300 transition">+</button>
                      </div>
                  </div>
                  {/* <!-- Remove button --> */}
                  <button type='button' onClick={() => removeFromCart(item.id)} className="cursor-pointer text-gray-600 hover:text-primary transition">
                      <i className="fas fa-trash"></i>
                  </button>
              </div>
          </div>
          ))}
          </div>
          {/* create reset button */}
          <div className="flex items-center mt-5 py-2 flex-row gap-3">
              <button type="submit"
                className="bg-primary border flex border-primary text-white px-6 py-2 font-medium rounded uppercase hover:bg-transparent hover:text-primary transition duration-500 hover:border-primary"
              >
                <span><i className='fas fa-save mr-2'></i></span> 
                Place Order
                {createSpinner&&(<svg width="20" height="20" fill="currentColor" className="ml-2 mt-[2px] animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                </path>
              </svg> )}
              </button>
              
              <button type='button' 
                onClick={handleReset} 
                className="bg-transparent border border-primary text-primary px-6 py-2 font-medium rounded uppercase hover:bg-primary hover:text-white transition duration-500 hover:border-primary"
              >
                <span><i className="fas fa-refresh mr-2"></i></span>Reset
              </button>
          </div>
        </form>
          {/* Modal (View Details or Add New) */}
          {isModalOpen && (
          <AddressModal setIsModalOpen={setIsModalOpen} fetchedData={fetchedData} crmAccountId={crmAccountId}/>
        )}
        </>
            
        )}
      </div>
      
    );
};

export default Cart;