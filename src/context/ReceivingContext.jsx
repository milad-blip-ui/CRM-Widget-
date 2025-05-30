// ReceivingContext.js
import { createContext, useContext, useState } from "react";

const ReceivingContext = createContext();

export function ReceivingProvider({ children }) {
  const [receivings, setReceivings] = useState([]);

  const addReceiving = (data) => {
    // setReceivings([...receivings, { ...data, id: Date.now() }]);
    setReceivings(data);
  };

  const updateReceiving = (id, updatedData) => {
    setReceivings(
      receivings.map((item) => (item.ID === id ? { ...updatedData, id } : item))
    );
  };

  const deleteReceiving = (id) => {
    setReceivings(receivings.filter((item) => item.ID !== id));
  };

  return (
    <ReceivingContext.Provider
      value={{ receivings, addReceiving, updateReceiving, deleteReceiving }}
    >
      {children}
    </ReceivingContext.Provider>
  );
}

export function useReceivings() {
  return useContext(ReceivingContext);
}
