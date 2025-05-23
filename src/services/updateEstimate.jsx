const updateEstimate = async (estimateId, payload,reportName) => {
  try {
  const connection = "crmwidgetconnection";
  // Make API call to Zoho Creator
  const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
    parameters: {
      ...payload,
    },
    method: "PATCH",
    url: "https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/"+reportName+"/"+estimateId,
    param_type: 2,
  });
  //Estimate_2_0_Report
  console.log("update response",response);
  return response?.details?.statusMessage;;
  } catch (error) {
  console.error(error);
  throw error;
  }
 };
  
 export default updateEstimate;


// import React from 'react'

// const updateEstimate = () => {
//   return (
//     <div>updateEstimate</div>
//   )
// }

// export default updateEstimate