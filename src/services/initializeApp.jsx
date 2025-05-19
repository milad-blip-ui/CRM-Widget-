const initializeApp = async () => {
  try {
    await window.ZOHO.embeddedApp.init();
    const connection = "crmwidgetconnection";
    let allRecords = [];
    let recordCursor = null; // Initialize cursor as null (first fetch)
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const headers = {
        "Content-Type": "application/json",
      };

      // Add record_cursor to headers if it exists (for subsequent fetches)
      if (recordCursor) {
        headers.record_cursor = recordCursor;
      }

      const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
        parameters: {
          max_records: 200, // Fetch max allowed per request
        },
        headers: headers,
        method: "GET",
        url: "https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/SO_For_CRM_widget_Update",
        param_type: 1,
      });
      console.log("Total records fetched:", response);
      // Check if response is valid
      if (response && response.details && response.details.statusMessage) {
        const currentRecords = response.details.statusMessage.data;
        allRecords = allRecords.concat(currentRecords);

        // Check for next cursor in response headers
        if (response.headers && response.headers.record_cursor) {
          recordCursor = response.headers.record_cursor;
        } else {
          hasMoreRecords = false; // No more records
        }
      } else {
        console.error("Invalid API response structure", response);
        break;
      }
    }
    console.log("Total records fetched:", allRecords.length);
    return allRecords;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default initializeApp;
