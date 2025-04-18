import React, { createContext, useState, useEffect } from "react";
import initializeApp from "../services/initializeApp";
import { fetchAllEstimates } from "../services/mockApi";
// Create a Context
export const AppContext = createContext();

// Create a Provider Component
export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await initializeApp();
        const estimates = data.map((item) => {
            if (item.Estimate_Json && item.Estimate_Json.trim() !== '') {
                const result = JSON.parse(item.Estimate_Json);
                return result.data
            }
            return undefined;
        }).filter((estimate) => estimate !== undefined);
      console.log(estimates)
        //const data = await fetchAllEstimates();
        setAllItems(estimates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const updateItemStatus = (itemId, newStatus) => {
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.ID === itemId ? { ...item, Status: newStatus } : item
      )
    );
  };
  return (
    <AppContext.Provider
      value={{
        loading,
        allItems,
        updateItemStatus,
        showSearchPanel,
        setShowSearchPanel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
