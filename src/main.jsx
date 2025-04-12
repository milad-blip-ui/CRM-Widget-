import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx';

// window.ZOHO.embeddedApp.on("PageLoad",function(data){
//   ZOHO.CRM.UI.Resize({height:"1080",width:"1920"}).then(function(data){
//     console.log("resize",data);
//   });
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AppProvider>
      <App  />
    </AppProvider>
  </StrictMode>,
)
//})
//window.ZOHO.embeddedApp.init();
