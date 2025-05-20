import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { ReceivingProvider } from "./context/ReceivingContext.jsx";
import { ShippingProvider } from "./context/ShippingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <ReceivingProvider>
        <ShippingProvider>
          <App />
        </ShippingProvider>
      </ReceivingProvider>
    </AppProvider>
  </StrictMode>
);
