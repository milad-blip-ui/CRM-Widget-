const updateEstimateStatus = async(estimateId, draggedItem, targetStatus) => {
    try {
      const connection = "crmwidgetconnection";
      draggedItem.Status = targetStatus;
      console.log("draggedItem",draggedItem)
      const payload = {
        data:{
          ...draggedItem
        }
      }
      console.log("payload",payload)
      // Make API call to Zoho Creator
      const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
        parameters:{
          data: {
            ...draggedItem,
            Estimate_Json: JSON.stringify(payload)
          }
        },
        method: "PATCH",
        url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/QT_For_CRM_widget_Update/${estimateId}`,
        param_type: 2,
      })
      //Estimate_2_0_Report
      console.log("update status response",response);
      if(response.details.statusMessage.code === 3000){
        console.log("Main record response", response.details.statusMessage);
        return response.details.statusMessage.data;
      }
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export default updateEstimateStatus;