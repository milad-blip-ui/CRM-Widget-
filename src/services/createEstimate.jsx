const createEstimate = async (payload,formName) => {
  try {
    const connection = "crmwidgetconnection";
    // Make API call to Zoho Creator
    const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
      parameters: {
        ...payload,
      },
      method: "POST",
      url: "https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/form/"+formName,
      param_type: 2,
    });
    console.log("main record so response", response);
    if (response.details.statusMessage.code === 3000) {
      console.log("Main record response", response.details.statusMessage);
      return response.details.statusMessage;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createEstimate;

// import React from 'react'

// const createEstimate = () => {
//   return (
//     <div>createEstimate</div>
//   )
// }

// export default createEstimate
