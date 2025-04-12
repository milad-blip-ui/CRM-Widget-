const updateEstimate = async (estimateId,payload, customerAttachments, privateAttachments) => {
  try {
    await window.ZOHO.CREATOR.init();
    // Make API call to Zoho Creator
    const response = await window.ZOHO.CREATOR.API.updateRecord({
      appName: "source-erp",
      reportName: "QT_For_CRM_widget_Update",
      id:estimateId,
      data: payload,
    });

    console.log("Main record response", response);
    
    if (response.code === 3000) {
      const mainRecordId = response.data.ID;

      // Handling customer attachments
      for (const item of customerAttachments) {
        if (item.file) {
          const createFileRecordPayload = {
            data: {
              Estimate_2_0_Customer_Attachment: mainRecordId,
              File_Descprition: item.fileDescription || "customer file uploaded",
            },
          };
          
          // Creating upload record for customer attachment
          const result = await ZOHO.CREATOR.API.addRecord({
            appName: "source-erp",
            formName: "Estimate_2_0_File_Upload",
            data: createFileRecordPayload,
          });
          console.log("customerAttach record response", result);
          
          if (result.code === 3000) {
            const uploadRecordId = result.data.ID;
            const uploadResponse = await ZOHO.CREATOR.API.uploadFile({
              appName: "source-erp",
              reportName: "Estimate_2_0_File_Upload_Report",
              id: uploadRecordId,
              fieldName: "File_upload",
              file: item.file,
            });
            console.log("customerAttach Fileupload response:", uploadResponse);
          }
        }
      }

      // Handling private attachments
      for (const item of privateAttachments) {
        if (item.file) {
          const createPrivateFileRecordPayload = {
            data: {
              Estimate_2_0_Private_Attachment: mainRecordId,
              File_Descprition: item.fileDescription || "private file uploaded",
            },
          };
          
          // Creating upload record for private attachment
          const privateResult = await ZOHO.CREATOR.API.addRecord({
            appName: "source-erp",
            formName: "Estimate_2_0_File_Upload",
            data: createPrivateFileRecordPayload,
          });
          console.log("privateAttach record response", privateResult);
          
          if (privateResult.code === 3000) {
            const privateUploadRecordId = privateResult.data.ID;
            const privateUploadResponse = await ZOHO.CREATOR.API.uploadFile({
              appName: "source-erp",
              reportName: "Estimate_2_0_File_Upload_Report",
              id: privateUploadRecordId,
              fieldName: "File_upload",
              file: item.file,
            });
            console.log("privateAttach Fileupload response:", privateUploadResponse);
          }
        }
      }

      return response;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateEstimate;