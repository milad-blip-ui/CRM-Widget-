import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import PageSpinner from "../components/Shared/PageSpinner";
import fetchAccountEsORSo from "../services/fetchAccountEsORSo";
// import Quote from "../components/order/Quote";
import Salesorder from "../components/order/Salesorder";
import toast from "react-hot-toast";
const Order = () => {
  const { loginUser, setLoginUser } = useContext(AppContext);
  const [iSpinner, setISpinner] = useState(false);
    const [data, setData] = useState([]);
   const accountId = loginUser.CRM_Account_Name.ID;
   const accountType = loginUser["Customer_Accounts.Account_Type"];
  //const accountType = "Customer Specific";
    useEffect(() => {
      const fetchData = async () => {
        setISpinner(true);
          try {
              const result = await fetchAccountEsORSo(accountId, accountType);
            console.log("farzan")
            console.log(result);
            setData(result);
          } catch (error) {
              console.error("Error fetching address:", error);
              const {message} = JSON.parse(error.responseText);
              toast.error(message);
              setData([]);
          }finally{
            setISpinner(false);
          }
      };
      fetchData();
  }, []);
  return (
    <div>
      {iSpinner && <PageSpinner />}

      <div className="max-w-full overflow-x-auto">
        {accountType && accountType === "Generic" && <Quote data={data} />}
        {accountType && accountType === "Customer Specific" && <Salesorder data={data} />}
      </div>
    </div>
  );
};

export default Order;
