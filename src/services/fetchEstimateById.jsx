const fetchEstimateById = async (estimateId) => {
  try {
    const connection = "crmwidgetconnection";

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
      parameters: {},
      headers: headers,
      method: "GET",
      url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/QT_For_CRM_widget_Update/${estimateId}`,
      param_type: 1,
    });

    console.log("estimate by id:", response);
    if (response && response.details && response.details.statusMessage) {

      return response.details.statusMessage.data;

    } else {
      console.error("Invalid API response structure", response);
    }
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchEstimateById;
