import React, { createContext, useState, useEffect } from "react";
import initializeApp from "../services/initializeApp";
import fetchEstimateById from '../services/fetchEstimateById';
import { fetchAllEstimates } from "../services/mockApi";
import { DEFAULT_CARDS } from '../data';
// Create a Context
export const AppContext = createContext();

// Create a Provider Component
export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        //const data = await fetchAllEstimates();
       const data = await initializeApp();
        const estimates = data
          .map((item) => {
            if (item.Estimate_Json && item.Estimate_Json.trim() !== "") {
              const result = JSON.parse(item.Estimate_Json);
              return result.data;
            }
            return undefined;
          })
          .filter((estimate) => estimate !== undefined);
        setAllItems(estimates);
        //setAllItems(DEFAULT_CARDS)
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to add a new estimate by fetching it from the API
  const addEstimateById = async (estimateId) => {
    try {
      const newEstimate = await fetchEstimateById(estimateId);
      if (newEstimate.Estimate_Json && newEstimate.Estimate_Json.trim() !== "") {
        const result = JSON.parse(newEstimate.Estimate_Json);
         setAllItems((prevItems) => [...prevItems, result.data]);
      }
    } catch (err) {
      console.error("Error adding estimate:", err.message);
    }
  };

  // Function to update an existing estimate by fetching it from the API
  const updateEstimateById = async (estimateId) => {
    try {
      const updatedEstimate = await fetchEstimateById(estimateId);
      if (updatedEstimate.Estimate_Json && updatedEstimate.Estimate_Json.trim() !== "") {
        const result = JSON.parse(updatedEstimate.Estimate_Json);
         setAllItems((prevItems) =>
          prevItems.map((item) =>
            item.ID === estimateId ? result.data : item
          )
        );
      }
    } catch (err) {
      console.error("Error updating estimate:", err.message);
    }
  };

  // Function to remove an estimate by its ID
  const removeEstimateById = (estimateId) => {
    setAllItems((prevItems) =>
      prevItems.filter((item) => item.ID !== estimateId)
    );
  };

  // Function to update the status of an item
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
        addEstimateById, // Add this function to the context
        updateEstimateById, // Add this function to the context
        removeEstimateById, // Add this function to the context
      }}
    >
      {children}
    </AppContext.Provider>
  );
};