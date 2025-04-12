const createSalesOrder = async (payload, items) => {
    try {   
        await window.ZOHO.CREATOR.init();
       // const loginUserInfo = window.ZOHO.CREATOR.UTIL.getInitParams();
        //console.log(loginUserInfo);
            // Make API call to Zoho Creator
    const response = await window.ZOHO.CREATOR.API.addRecord({
        appName: "source-erp",
        formName: "Salesorder_2_0",
        data: payload,
      });
      console.log("Main record response",response);
      if (response.code === 3000) {
        const mainRecordId = response.data.ID; //sales order id
        for (const item of items) {
          if (item.file) {
            const createFileRecordPayload = {
              data:{
                Salesorder_2_0_Customer_Attachment:mainRecordId,
                File_Descprition:"file uploaded"
                }
              };
          // createing upload record
           const result = await ZOHO.CREATOR.API.addRecord({ 
              appName : "source-erp",
              formName : "Estimate_2_0_File_Upload", 
              data : createFileRecordPayload 
          })
          console.log("file upload record response",result)
          if(result.code === 3000){
          const uploadRecordId = result.data.ID; // id of upload record in estimte file reomt
          const uploadResponse = await ZOHO.CREATOR.API.uploadFile({
            appName: "source-erp",
            reportName: "Estimate_2_0_File_Upload_Report",
            id: uploadRecordId,
            fieldName: "File_upload",
            file: item.file
          });
          console.log("File upload response:", uploadResponse);
          // if(uploadResponse){
          //   //update
                     
          //   const update = {
          //     data:{
          //       File_Descprition:"file uploaded1"
          //       }
          //     };
          //   const UpdateResponse =  await  ZOHO.CREATOR.API.updateRecord({ 
          //       appName : "source-erp",
          //       reportName : "Estimate_2_0_File_Upload_Report", 
          //       id : uploadRecordId,
          //       data:update
          //       })
          //       console.log("uploade response", UpdateResponse)
          // }
          }
          
          }
        }
        return response;
      }
      } catch (error) {
        console.error(error);
        throw error;
      }
}

export default createSalesOrder
  