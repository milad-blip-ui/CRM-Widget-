const createEstimate = async (estimateId,payload, customerAttachments, privateAttachments,payload2) => {
    try {
      const connection = "crmwidgetconnection";
      // Make API call to Zoho Creator
      const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
        parameters:{
          ...payload
        },
        method: "POST",
        url: "https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/form/Estimate_2_0",
        param_type: 2,
      })
      console.log("Main record response", response.details.statusMessage);
      if (response.details.statusMessage.code === 3000) {
        //const mainRecordId = response.data.ID;

        //updating current recrod
      const updateResponse = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
        parameters:{
          ...payload2
        },
        method: "PATCH",
        url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/QT_For_CRM_widget_Update/${estimateId}`,
        param_type: 2,
      });
      if(response.details.statusMessage.code === 3000){
        console.log("Main record response", response.details.statusMessage);
        const recordId = response?.details?.statusMessage?.data?.ID;
        const result = await window.ZOHO.CRM.API.insertRecord({
          Entity: "Upload_File",
          APIData: {
            Name: recordId,
          }
        });
        console.log("UPload file Id",result)
        const CRMID = result?.data[0]?.details?.id;
        for (const item of customerAttachments) {
          if (item.file) {
          const customerAttUpload = await window.ZOHO.CRM.API.attachFile({
              Entity: "Upload_File",
              RecordID: CRMID,
              File: { Name: `CA_${item.fileName}`, Content: item.file },
            })
            console.log("customerAttUpload result",customerAttUpload); 
          }
        }
        for (const item of privateAttachments) {
          if (item.file) {
          const privateAttUpload = await window.ZOHO.CRM.API.attachFile({
              Entity: "Upload_File",
              RecordID: CRMID,
              File: { Name: `PA_${item.fileName}`, Content: item.file },
            })
            console.log("privateAttUpload result",privateAttUpload); 
          }
        }
       const updateAttachment = await window.ZOHO.CRM.API.updateRecord({
        Entity:"Upload_File",
        APIData:{id: CRMID,hasAttachment: true}
      })
      console.log("updateAttachment",updateAttachment)
  
      return response.details.statusMessage;
      }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export default createEstimate;