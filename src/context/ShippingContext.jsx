// ShippingContext.js
import { createContext, useContext, useState } from "react";

const ShippingContext = createContext();

export function ShippingProvider({ children }) {
  const [shippings, setShippings] = useState([]);

  const addShipping = (data) => {
    // setShippings([...shippings, { ...data, id: Date.now() }]);
    setShippings(data);
  };

  const updateShipping = (id, updatedData) => {
    setShippings(
      shippings.map((item) => (item.ID === id ? { ...updatedData, id } : item))
    );
  };

  const deleteShipping = (id) => {
    setShippings(shippings.filter((item) => item.ID !== id));
  };

  return (
    <ShippingContext.Provider
      value={{ shippings, addShipping, updateShipping, deleteShipping }}
    >
      {children}
    </ShippingContext.Provider>
  );
}

export function useShippings() {
  return useContext(ShippingContext);
}
