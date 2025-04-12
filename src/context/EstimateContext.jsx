import React, { createContext, useState, useEffect, useContext } from 'react';
import fetchEstimate from '../services/fetchEstimate';
import { AppContext } from '../context/AppContext'; 
import { jsonData } from '../data';
// Create a Context
export const EstimatesContext = createContext();

// Create a Provider Component
export const EstimatesProvider = ({ children }) => {
    const { data } = useContext(AppContext);
    const accountId = data?.account?.id;

    const [loading, setLoading] = useState(true);
    const [estimates, setEstimates] = useState([]);

    // Fetch estimates
    const fetchEstimates = async () => {
        if (!accountId) {
            setLoading(false);
            return;
        } 
        try {
            setLoading(true);
            //const newData = await fetchEstimate(accountId);
            const newData = jsonData;

            const parsedData = newData.map(row =>{
                const result = JSON.parse(row.Estimate_Json);
                return result.data;
            });
            setEstimates(parsedData); 

        } catch (error) {
            console.error("Error fetching Estimate data:", error);
        } finally {
            setLoading(false);
        }
    };

    // // Add a new estimate
    // const addEstimateToContext = (newEstimate) => {
    //     setEstimates(prev => [...prev, newEstimate]);
    // };

    // // Update an existing estimate
    // const updateEstimateInContext = (updatedEstimate) => {
    //     setEstimates(prev => prev.map(estimate => 
    //         estimate.id === updatedEstimate.id ? updatedEstimate : estimate
    //     ));
    // };

    // // Delete an estimate
    // const deleteEstimateFromContext = (estimateId) => {
    //     setEstimates(prev => prev.filter(estimate => estimate.id !== estimateId));
    // };

    useEffect(() => {
        fetchEstimates();
    }, [accountId]);

    return (
        <EstimatesContext.Provider value={{ 
            estimates, 
            loading,
            fetchEstimates, // in case you want to manually refetch
            // addEstimateToContext,
            // updateEstimateInContext,
            // deleteEstimateFromContext
        }}>
            {children}
        </EstimatesContext.Provider>
    );
};