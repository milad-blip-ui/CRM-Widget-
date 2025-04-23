import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';
import deleteEstimate from '../../services/deleteEstimate';
import { PageSpinner } from "../../components/shared/Spinner";
import updateEstimateStatus from '../../services/updateEstimateStatus';
import SentToCustomerModal from './SentToCustomerModal';
import createEstimateApprovalEmails from '../../services/createEstimateApprovalEmails';
const Kanbanitem = ({item, 
  onDragStart, 
  onDragEnd  }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const { removeEstimateById, updateItemStatus } = useContext(AppContext);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [statusSpinner, setStatusSpinner] = useState(false);

  // State for modal control
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [targetStatus, setTargetStatus] = useState("");
  const emailBody = `<div>
  <p>Hello ${item.Widget_CRM_Contact_Name},</p>
  <br>
  <p>Thank you for contacting us. Your quote for ${item.Quote_name} can be viewed and approved from the link below.</p>
  <br>
  <p>Amount: ${item?.Accounting_Summary?.total}<br>
  Quote #: ${item.Quote}<br>
  Quote Date: ${item.Quote_date}</p>
  <br>
  <p><a style="color:blue; text-decoration: underline;" href="https://creatorapp.zohopublic.com/sst1source/source-erp/form-perma/Estimate_Approval_v2/Wgg5wzDtVjjFhOfKZJPPM4bqagy2Ce41t1RJV9UtqYTwpwn137ez2aA7kz7MsbquNsKWkgKbNZQnvHfrOm7ZtAOsj18sFQ0YdJXp?Estimate_2_0=${item.ID}" target="_blank">Click here to view the Quote</a></p>
  <br>
  <p>Regards,<br>
  ${item.SalespersonName}</p>
  `;
  //Form data of modal
    const [formData, setFormData] = useState({
      additionalRecipient: '',
      subject: `Approval for ${item.Quote_name} (${item.Quote}) for ${item.CRM_Account_Name_String}`,
      body: emailBody
    });
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    // Stable editor change handler
    const handleBodyChange = (content) => {
      setFormData(prev => ({
        ...prev,
        body: content
      }));
    };
  


    /////////////////////////////////////

  const handleClick = () => {
    navigate(`/es-details/${item.ID}`); 
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevents the click event from bubbling up to the parent
    setDropdownVisible(prev => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    //alert(`Edit option clicked for: ${item.ID}`);
    navigate(`/es-edit/${item.ID}`);
    setDropdownVisible(false); // Close dropdown after selection
  };

  const handleDelete = async(e) => {
    e.stopPropagation(); 
    setDeleteSpinner(true);
    const result  = await deleteEstimate(item.ID);
    if(result.ID){
      removeEstimateById(item.ID);
      toast.success(`Deleted Successfully!`); 
    }
    setDeleteSpinner(false);
    setDropdownVisible(false); 
  };
  const handleSentForApproval = async (e) => {
    console.log(item)
    e.stopPropagation(); 
    const targetStatus = "Sent for approval";
    try {
      setStatusSpinner(true);
      const response = await updateEstimateStatus(item.ID, item, targetStatus);
      if (response.ID) {
        updateItemStatus(item.ID, targetStatus);
        toast.success("Successfully sent!");
      }
    } catch (error) {
      console.error("Error in handleSentForApproval:", error);
      toast.error("Operation failed. Please try again.");
    } finally {
      setStatusSpinner(false);
    }
  };
  
  const handleSentToCustomer = async (e) => {
    e.stopPropagation();
    setIsSendModalOpen(true);
    setCurrentItem(item);
    setTargetStatus("Sent to customer");  
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    
    try {
      setStatusSpinner(true);
      
      // First async operation - send email
      const emailResponse = await createEstimateApprovalEmails(formData,item.ID);
      
      if (emailResponse.ID) {
        // Only proceed to second operation if first succeeds
        const statusResponse = await updateEstimateStatus(
          currentItem.ID, 
          currentItem, 
          targetStatus
        );
        
        if (statusResponse) {
          updateItemStatus(currentItem.ID, targetStatus);
          toast.success("Email sent and status updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Operation failed. Please try again.");
    } finally {
      setStatusSpinner(false);
      setIsSendModalOpen(false);
      setCurrentItem(null);
      setTargetStatus("");
    }
  };
  return (
    <> 
      <div
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setDropdownVisible(false); 
        }}
        className={`cursor-pointer mb-2 active:cursor-grabbing w-full bg-white flex flex-col justify-between gap-3 items-start shadow-sm border border-gray-200 rounded-lg p-3`}
      >
        <div className='relative flex items-center w-full justify-between'>
          <h1 className='font-semibold text-indigo-600'>{item.Quote}</h1>

          <button 
            className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={toggleDropdown}
          >
            <i className="fa-regular fa-ellipsis"></i>
          </button>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="absolute right-[-10px] text-gray-700 top-2 mt-2 w-[180px] text-sm bg-white border border-gray-300 rounded shadow-lg z-40">
              <button 
                onClick={handleEdit} 
                className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete} 
                className="w-full text-left px-4 text-sm py-2 hover:bg-gray-100"
              >
                Delete
              </button>

              {(item.Status === "Draft" || item.Status === "Sent for approval" || item.Status === "Internally Approved") && (
                (item.Quote_approval === "yes" || item.Quote_approval === "Yes") && item.Status === "Draft" ? 
                  <button 
                    onClick={handleSentForApproval} 
                    className="w-full text-left px-4 text-sm py-2 hover:bg-gray-100"
                  >
                    Sent for approval
                  </button> 
                  : 
                  <button 
                    onClick={handleSentToCustomer} 
                    className="w-full text-left px-4 text-sm py-2 hover:bg-gray-100"
                  >
                    {item.Status === "Internally Approved" ? "Send to customer" : "Sent to customer"}
                  </button>
              )}

            </div>
          )}
        </div>
        <div className='flex items-center justify-between w-full'>
        <p className="text-xs text-neutral-800">{item.Quote_name}</p>
        {item.Is_Hot_job === "Yes" && <span className='text-xs bg-red-100 px-3 rounded-full text-red-700 font-semibold'>Hot</span>}
        </div>
        <div className='flex items-center w-full justify-between text-neutral-700 text-sm'>
          <p>
            {item.CRM_Account_Name_String 
              ? item.CRM_Account_Name_String.length > 10 
                ? `${item.CRM_Account_Name_String.substring(0, 10)}...` 
                : item.CRM_Account_Name_String 
              : ""}
          </p>
          <p>
            {item.SalespersonName
              ? item.SalespersonName.trim().length > 10 
                ? `${item.SalespersonName.trim().substring(0, 10)}...` 
                : item.SalespersonName.trim() 
              : ""}
          </p>
          <p>{item.Quote_date}</p>
        </div>
      </div>
      {deleteSpinner && <PageSpinner />}
      {statusSpinner && <PageSpinner />}
      

{isSendModalOpen && (
  <SentToCustomerModal 
  item={item} 
  setIsSendModalOpen={setIsSendModalOpen} 
  formData={formData}
  handleChange={handleChange}
  handleSubmit={handleSubmit}
  handleBodyChange={handleBodyChange}
  />
)}
    </>
  );
};

export default Kanbanitem;