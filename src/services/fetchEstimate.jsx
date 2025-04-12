const estimates = async (accountId) => {
    try {
      await window.ZOHO.CREATOR.init();
      let allestimates = [];
      let page = 1;
      let pageSize = 200;
      let isMoreDataAvailable = true;
  
      while (isMoreDataAvailable) {
      try{
        const estimateResponse = await window.ZOHO.CREATOR.API.getAllRecords({
          appName: "source-erp",
          reportName: "QT_For_CRM_widget_Update",
          criteria:`CRM_Account_Name == "${accountId}"`,
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
  
        console.log("Estiamte response", estimateResponse);
  
        if (estimateResponse.code === 3000) {
          allestimates = allestimates.concat(estimateResponse.data);
          if (estimateResponse.data.length < pageSize) {
            isMoreDataAvailable = false; 
          } else {
            page++; 
          }
        } else {
          isMoreDataAvailable = false; 
        }
      } catch (error) {
        // Handle network errors or API failures
        console.error("Error during API call:", error);
        isMoreDataAvailable = false; 
      }
      }
      return allestimates;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export default estimates;