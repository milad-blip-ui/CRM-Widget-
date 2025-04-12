import React, { createContext, useState, useEffect } from 'react';
import initializeApp from '../services/initializeApp';
import {appData} from '../data'
// Create a Context
export const AppContext = createContext();

// Create a Provider Component
export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        account: {},
        contact: {},
        address: {},
        allProductType: {},
        allEmployees: {}
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
               //const newData = await initializeApp();
                const newData = appData;
                setData(newData); 
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AppContext.Provider value={{ data, loading }}>
            {children}
        </AppContext.Provider>
    );
};