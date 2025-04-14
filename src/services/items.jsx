const initializeApp = () => {
    return new Promise(async (resolve, reject) => {
        try {   
            // Initialize the embedded app
           
  
            // Set up the event listener for the "PageLoad" event
            window.ZOHO.embeddedApp.on("PageLoad", async function(data) {
                try {
                    // Resize the CRM UI
                    await ZOHO.CRM.UI.Resize({ height: "1080", width: "1920" });
                    console.log("data", data);
                    // Resolve the promise with the data
                    resolve(data);
                } catch (error) {
                    console.error("Error resizing:", error);
                    reject(error); // Reject the promise if there's an error
                }
            });
            await window.ZOHO.embeddedApp.init();
        } catch (error) {
            // Log initialization errors
            console.error("Error initializing app:", error);
            reject(error); // Re-throwing the error allows handling at a higher level if needed
        }
    });
  }
  
  export default initializeApp;