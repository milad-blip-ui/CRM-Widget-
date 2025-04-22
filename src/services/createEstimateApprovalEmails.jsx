const createEstimateApprovalEmails = async (payload, recordId) => {
    try {
      const connection = "crmwidgetconnection";
      // Make API call to Zoho Creator
      const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
        parameters:{
          data:{
            Estimate_2_0:recordId,
            Additional_Email_Receipent: payload.additionalRecipient,
            Subject_field: payload.subject,
            Body:payload.body
          }
        },
        method: "POST",
        url: "https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/form/Estimate_Approval_Emails",
        param_type: 2,
      })
      console.log("createEstimateApprovalEmails response",response)
      if(response.details.statusMessage.code === 3000){
        console.log("Main record response", response.details.statusMessage);
        return response.details.statusMessage.data;
      }
    
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
export default createEstimateApprovalEmails