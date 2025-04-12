import axios from "axios";

const initializeApp = async () => {
    try {   
        await window.ZOHO.CREATOR.init();

        //fetching product type for items from creator
        const allProductTypes = await window.ZOHO.CREATOR.API.getAllRecords({
          appName: "source-erp",
          reportName: "All_Product_Types",
          page: "1",
          pageSize: "100"
        });
         //fetching product type for items from creator
         const allEmployees = await window.ZOHO.CREATOR.API.getAllRecords({
          appName: "source-erp",
          reportName: "All_Employees",
          page: "1",
          pageSize: "100"
        });

        //freaching account and contact and address from crm using zoho catalyst
        const url = `https://crmcreatorintermediator-875644375.development.catalystserverless.com/server/crm_creator_intermediator_function/accountId`;
        const headers = {
        "Content-Type": "application/json",
        };
        const result = await axios.get(url, {
            headers,
        });
        if(result.data){
          result.data.allProductTypes = allProductTypes;
          result.data.allEmployees = allEmployees;
        }
        console.log(result.data);
        return result.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
}

export default initializeApp