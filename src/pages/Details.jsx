// import React, { useEffect, useState,useContext ,useRef} from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { DEFAULT_CARDS } from '../data';
// import AccordionItem from '../components/detailpage/AccordionItem';
// import { AppContext } from '../context/AppContext';
// import ItemDetails from '../components/detailpage/ItemDetails';
// import LineItemsTable from '../components/detailpage/LineItemsTable';
// import AttachmentsTab from '../components/detailpage/AttachmentsTab';
// import PdfModal from '../components/detailpage/PdfModal';
// import CommentSection from '../components/detailpage/CommentSection';
// const DetailPage = () => {
//   const { id } = useParams();
//   const { allItems, error, updateItemStatus,  } = useContext(AppContext);
//   const [estimate, setEstimate] = useState(null);
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('customer');
//   const stages = [
//     "Draft",
//     "In Process",
//     "Sent to design"
//   ];

//   // State to manage the currently open accordion
//   const [openIndex, setOpenIndex] = useState(null);

//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);

// //pdf modal
// const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
// const [printContent, setPrintContent] = useState('');
//  // State for dropdown visibility
//  // Ref for the dropdown
//  const dropdownRef = useRef(null);
//  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

//    // New state for PDF controls
//    const [pdfSettings, setPdfSettings] = useState({
//     scale: 0.9,
//     showHeaderFooter: true,
//     includeTerms: true,
//     includeContactInfo: true,
//     pageSize: 'letter',
//     orientation: 'portrait',
//     marginTop: 0.5,
//     marginBottom: 0.5,
//     marginLeft: 0.5,
//     marginRight: 0.5,
//     watermark: {
//       enabled: false,
//       text: 'DRAFT',
//       opacity: 0.2
//     }
//   });

//   useEffect(() => {
//     // const estimateData = DEFAULT_CARDS.find(rec => rec.ID === id);
//     // setEstimate(estimateData);
//     const estimateData = allItems.find(item => item.ID === id);
//       setEstimate(estimateData);

//     // Set the open index according to the status of the fetched data
//     if (estimateData) {
//       const statusIndex = stages.indexOf(estimateData.Status);
//       if (statusIndex !== -1) {
//         setOpenIndex(statusIndex);
//       }
//     }
//   }, [id]); // Add id to the dependency array
//   // Effect to detect clicks outside the dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownVisible(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
//     ///////comment////////////////////////

//     const [comments, setComments] = useState([]);
//     const [currentUser, setCurrentUser] = useState();
//     useEffect(() => {
//       const fetchUsers = async () => {
//         try {
//           const response = await window.ZOHO.CRM.CONFIG.getCurrentUser();
//           setCurrentUser(
//             response.users[0]
//           );
//           //setCurrentUser(currentUserData);
//         } catch (error) {
//           console.error("Error fetching users:", error);
//           toast.error("Failed to load users");
//         } finally {
//           //setLoadingCreatorData(false);
//         }
//       };
//       fetchUsers();
//     }, []);
//     // Fetch comments from API
//     useEffect(() => {
//       // Replace this with your actual API call
//       const fetchComments = async () => {
//         // Example API response
//         const connection = "crmwidgetconnection";
//         //const criteria = `(Module == "Estimate" && Module_Record_Id == "${id}")`;
//         console.log("id",id);
//         const criteriaSO = encodeURIComponent(
//           `(Record_Id == "${id}")`
//         );
//           const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
//             method: "GET",
//             url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/All_Comments?criteria=${criteriaSO}`,
//             param_type: 1,
//           });
//           console.log("Total comments fetched:", response);
//           // Check if response is valid
//           if (response && response.details && response.details.statusMessage) {
//             const currentRecords = response.details.statusMessage.data;
//             setComments(currentRecords);
//           }
//         // const response = [
//         //   {
//         //     Module: "Estimate",
//         //     Module_Record_Id: "4599841000005308023",
//         //     Parent_Comment_Id: "",
//         //     Body: "@dana Hello this is great!",
//         //     User_Id: "3357575763525252",
//         //     Username: "Sarah",
//         //     ID: "4599841000005353016",
//         //     Avatar:"https://contacts.zoho.com/file?ID=875356860&fs=thumb"
//         //   },
//         //   {
//         //     Module: "Estimate",
//         //     Module_Record_Id: "4599841000005308023",
//         //     Parent_Comment_Id: "4599841000005353016",
//         //     Body: "ok got it.",
//         //     User_Id: "3357575763525252",
//         //     Username: "farzan",
//         //     ID: "4599841000005353020",
//         //     Avatar:"https://contacts.zoho.com/file?ID=875356860&fs=thumb"
//         //   }
//         // ];

//         // setComments(response);
//       };

//       fetchComments();
//     }, [id]);

//   /////////end comment////////////////////
//   if (!estimate) {
//     return <div>No data found for ID: {id}</div>; // Handle case where no data was found
//   }

//   const handleClose = () => {
//     navigate(`/`);
//   };

//   const handleToggle = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };
// // New function to handle sidebar toggle
// const handleSidebarToggle = () => {
//   setIsSidebarVisible(!isSidebarVisible);
// };
//   // New function to toggle dropdown visibility
//   const handleDropdownToggle = () => {
//     setIsDropdownVisible(!isDropdownVisible);
//   };

//   // New function to handle PDF option click
//   const handlePDFClick = () => {
//     setIsDropdownVisible(false);
//     setPrintContent(document.getElementById('print')?.innerHTML || '');
//     setIsPdfModalVisible(true);
//   };

//   // New function to handle Print option click
//   const handlePrintClick = () => {
//     setIsDropdownVisible(false);

//     const printContent = document.getElementById('print').innerHTML;
//     const printWindow = window.open('', '_blank');

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print Quote #${estimate.Salesorder}</title>
//           <!-- Load Tailwind CSS -->
//           <script src="https://cdn.tailwindcss.com"></script>
//             <style>
//           @media print {
//             body {
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//             }
//             .force-print-bg {
//               background: #000 !important;
//               color: #fff !important;
//               box-shadow: inset 0 0 0 1000px #000 !important;
//             }
//           }
//         </style>
//           <style type="text/tailwindcss">
//             @layer utilities {
//               @media print {
//                 .print\:hidden {
//                   display: none !important;
//                 }
//                 .print\:block {
//                   display: block !important;
//                 }
//                 .print\:w-full {
//                   width: 100% !important;
//                 }
//                 .print\:break-inside-avoid {
//                   page-break-inside: avoid;
//                 }
//               }
//             }
//           </style>
//         </head>
//         <body class="p-5">
//           <div class="print-container">
//             ${printContent}
//           </div>
//           <script>
//             // Automatically trigger print when window loads
//             window.onload = function() {
//               setTimeout(function() {
//                 window.print();
//                 // Don't close immediately to allow cancel
//                 setTimeout(function() {
//                   window.close();
//                 }, 1000);
//               }, 200);
//             };
//           </script>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//   };
//   ////////////////////////////////////////////////

//     // Function to handle PDF setting changes
//     const handlePdfSettingChange = (setting, value) => {
//       setPdfSettings(prev => {
//         if (setting.includes('.')) {
//           // Handle nested properties like watermark.enabled
//           const [parent, child] = setting.split('.');
//           return {
//             ...prev,
//             [parent]: {
//               ...prev[parent],
//               [child]: value
//             }
//           };
//         }
//         return {
//           ...prev,
//           [setting]: value
//         };
//       });
//     };

//     // Function to generate the PDF
//     const handleGeneratePdf = async () => {
//       try {
//         const { jsPDF } = await import('jspdf');

//         const element = document.getElementById('farzan');
//         const doc = new jsPDF({
//           orientation: pdfSettings.orientation,
//           unit: pdfSettings.unit,
//           format: pdfSettings.pageSize
//         });

//         await doc.html(element, {
//           margin: 0,
//           autoPaging: 'text',
//           width: doc.internal.pageSize.getWidth(),
//           windowWidth: element.scrollWidth,
//           callback: (doc) => {
//             if (pdfSettings.watermark.enabled) {
//               const pageCount = doc.getNumberOfPages();

//               for (let i = 1; i <= pageCount; i++) {
//                 doc.setPage(i);

//                 // Set watermark style - Lighter appearance
//                 doc.setFont('helvetica', 'bold');
//                 doc.setFontSize(60);

//                 // Use RGBA with lower opacity (0.1 to 0.3 range) and lighter gray
//                 doc.setTextColor(160, 160, 160); // Light gray base color
//                 doc.setGState(new doc.GState({ opacity: pdfSettings.watermark.opacity * 0.5 })); // Additional opacity control

//                 // Calculate center position
//                 const pageWidth = doc.internal.pageSize.getWidth();
//                 const pageHeight = doc.internal.pageSize.getHeight();
//                 const text = pdfSettings.watermark.text;
//                 const textWidth = doc.getTextWidth(text);
//                 const x = (pageWidth - textWidth) / 2;
//                 const y = pageHeight / 2;

//                 // Add rotated watermark
//                 doc.text(text, x, y, { angle: 45 });
//               }
//             }

//             doc.save(`quote-${estimate.Salesorder}.pdf`);
//           }
//         });

//       } catch (error) {
//         console.error('Error generating PDF:', error);
//         alert('Error generating PDF. Please try again.');
//       }
//     };

//     // Function to download the PDF
//     const handleDownloadPdf = () => {
//       // Implement PDF download functionality
//       alert('PDF download functionality would be implemented here');
//     };

//   return (
//     <div className="bg-gray-100 p-4">
//       <div className="">
//         {/* Main div */}
//         <div className="flex flex-row bg-white overflow-hidden">
//           {/* Left column (fixed 400px width) */}
//           {isSidebarVisible && (<div className="w-[400px] border-r border-gray-200 flex flex-col bg-gray-100">
//               <div className='overflow-y-auto h-[87vh] p-2'>
//                 <div className="p-2 text-sm">
//                   {stages.map((stage, index) => {
//                     const records = allItems.filter(item => item.Status === stage);
//                     return (
//                       <AccordionItem
//                         key={index}
//                         title={stage}
//                         records={records}
//                         isOpen={openIndex === index}
//                         onToggle={() => handleToggle(index)}
//                         currentActiveId={estimate.ID}
//                       />
//                     );
//                   })}
//                 </div>
//               </div>
//           </div>)}

//           {/* Right column (flexible width) */}
//           <div className="flex-1 flex flex-col">
//             <div
//                 id="fixbar"
//                 className='border-b text-sm shadow-sm border-b-gray-200 px-4 h-12 flex items-center justify-end gap-2 sticky top-0 z-10'
//               >
//                 <button onClick={handleSidebarToggle} className='border border-gray-300 px-2 py-[3px] hover:bg-black hover:text-white transition-all duration-500'>
//                   {isSidebarVisible ? (
//                     <>
//                       <i className="fa-solid fa-up-right-and-down-left-from-center mr-[2px]"></i> Expand
//                     </>
//                   ) : (
//                     <>
//                       <i className="fa-solid fa-down-left-and-up-right-to-center mr-[2px]"></i> Collapse
//                     </>
//                   )}
//                 </button>
//                 <button onClick={() => navigate(`/es-edit/${estimate.ID}`)} className='border border-gray-300 px-2 py-[3px] hover:bg-black hover:text-white transition-all duration-500'>
//                   <i className='fa fa-light fa-pencil mr-[2px]'></i> Edit
//                 </button>
//                 {/* <button onClick={() => navigate(`/es-revise/${estimate.ID}`)} className='border border-gray-300 px-2 py-[3px] hover:bg-black hover:text-white transition-all duration-500'>
//                   Revise
//                 </button> */}
//                 <div className="relative" ref={dropdownRef}>
//                   <button onClick={handleDropdownToggle} className='border border-gray-300 px-2 py-[3px] hover:bg-black hover:text-white transition-all duration-500'>
//                     More <i className="fa-solid fa-chevron-down text-xs"></i>
//                   </button>
//                   {isDropdownVisible && (
//                     <div className="absolute right-0 w-32 bg-white border border-gray-300 shadow-lg z-10">
//                       {/* <button onClick={handlePDFClick} className="block w-full text-left px-4 py-2 hover:bg-gray-100">PDF</button> */}
//                       <button onClick={handlePrintClick} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Print Preview</button>
//                     </div>
//                   )}
//                 </div>
//                 <button onClick={handleClose}>
//                   <i className='fa fa-x text-sm hover:text-red-500 font-bold'></i>
//                 </button>
//               </div>
//             <div className='overflow-y-auto  h-[80vh] p-4'>
//               <div className='px-6 print:p-0' id="print">
//                 <div className='flex items-center justify-center bg-gray-50 p-2'>
//                   <img className='w-1/3' src='https://creatorapp.zohopublic.com/sst1source/source-erp/report/All_Brands/4599841000000958005/Logo/download-file/QThHrb7wD3fTJUPXBRwtZH4d7PmRzJyDK8DNeO9EvN0ewxJMQPJTav3N3AW1vmq6FVszHVg9zpnZZNfBQDPFd4ej4CbNj49Rnapa?filepath=/1726822583522_1SourceLogo.jpg&mediaType=1&digestValue=eyJkaWdlc3RWYWx1ZSI6MTcyNTY1MzE3MzY4NCwibGFuZ3VhZ2UiOiJlbiJ9' alt='the1source'/>
//                 </div>
//                 <div className='flex items-center justify-center text-xs font-semibold text-gray-800'>
//                   <p>A family of companies: Screen Works | Michigan Custom Signs | Signtext | Printnology | King Graphic Systems | CA Marketing</p>
//                 </div>
//                 <div className='flex flex-col justify-end items-end px-10'>
//                   <h1 className='text-3xl'>Salesorder</h1>
//                   <p># {estimate.Salesorder}</p>
//                 </div>
//                 <ItemDetails estimate={estimate} />
//                 <h1 className='mt-2'>SO Name: {estimate.SO_name}</h1>
//                 <LineItemsTable
//                   lineItems={estimate.Item_Details}
//                   accountingSummary={estimate.Accounting_Summary}
//                 />
//                 <hr className='mt-4 border-b-0 border-gray-800' />
//                 <div className='text-xs text-gray-900 mt-1 pl-3'>
//                   <a href='' className=''>Click Here For Terms & Conditions</a>< br /><br/>
//                   26600 Heyn Drive, Novi, MI, 48374, United States | +12487359999 | www.the1source.com
//                   <p className='mt-6'>ISO 9001 Registered| Minority Business Enterprise</p>
//                   <br /><br /><br />
//                 </div>
//               </div>
//               <CommentSection apiComments={comments} estimateId={id} currentUser={currentUser}/>
//               <AttachmentsTab estimate={estimate} />
//               <br /><br /><br />
//             </div>
//           </div>
//         </div>
//       </div>
//         {/* pdf modal */}
//   <PdfModal
//     isVisible={isPdfModalVisible}
//     onClose={() => setIsPdfModalVisible(false)}
//     printContent={printContent}
//     quoteNumber={estimate.Salesorder}
//     pdfSettings={pdfSettings}
//     onPdfSettingChange={handlePdfSettingChange}
//     onGeneratePdf={handleGeneratePdf}
//     onDownloadPdf={handleDownloadPdf}
//   />
//     </div>
//   );
// };

// export default DetailPage;

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReceivings } from "../context/ReceivingContext";

const Details = () => {
  const { id } = useParams();
  const { receivings } = useReceivings();
  const navigate = useNavigate();

  const receiving = receivings.find((item) => item.ID === id);

  if (!receiving) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-500">Receiving not found</div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"></h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/es-edit/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Receiving ID:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {receiving.Receiving_ID}
            </p>
          </div>
          <div>
            <label className="block font-medium">Receiving Date:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {new Date(receiving.Receiving_Date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block font-medium">Purchase Order:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {receiving.Purchase_Order.PO_ID}
            </p>
          </div>
          <div>
            <label className="block font-medium">Supplier:</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">
              {receiving.Supplier.Name}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Received Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Material</th>
                  <th className="px-4 py-2 text-left">Qty Ordered</th>
                  <th className="px-4 py-2 text-left">Qty Received</th>
                  <th className="px-4 py-2 text-left">Source</th>
                  <th className="px-4 py-2 text-left">Received Same</th>
                </tr>
              </thead>
              <tbody>
                {receiving.Receiving_Items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.Material.Search_Name}</td>
                    <td className="px-4 py-2">{item.Qty}</td>
                    <td className="px-4 py-2">{item.Qty_Received}</td>
                    <td className="px-4 py-2">{item.Source}</td>
                    <td className="px-4 py-2">
                      {item.Received_same_as_Ordered ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
