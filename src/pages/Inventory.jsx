import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import PageSpinner from "../components/Shared/PageSpinner";
import fetchInventory from "../services/fetchInventory";
import InventoryTable from "../components/Inventory/InventoryTable";
import toast from "react-hot-toast";
const Inventory = () => {
  const { loginUser, setLoginUser } = useContext(AppContext);
  const [iSpinner, setISpinner] = useState(false);
    const [data, setData] = useState([]);
   const accountId = loginUser.CRM_Account_Name.ID;
  // const accountType = loginUser["Customer_Accounts.Account_Type"];
   const isInventoryActive = loginUser["Customer_Accounts.Is_Inventory_Active"];
    useEffect(() => {
      const fetchData = async () => {
        setISpinner(true);
          try {
              const result = await fetchInventory(accountId);
            setData(result);
          } catch (error) {
              console.error("Error fetching Inventory:", error);
              const {message} = JSON.parse(error.responseText);
              toast.error(message);
              setData([]);
          }finally{
            setISpinner(false);
          }
      };
     isInventoryActive === "true" && fetchData();
  }, []);
  return (
    <div>
      {iSpinner && <PageSpinner />}
     { isInventoryActive === "false" ?
    <div className='flex items-center justify-center'>
        <h1 className='text-gray-700'>Sorry, inventory is not activated for your account. Please ask the administrator.</h1>
    </div> :
      <div className="max-w-full overflow-x-auto">
        <InventoryTable data={data} />
      </div>
      }
    </div>
  );
};

export default Inventory;
