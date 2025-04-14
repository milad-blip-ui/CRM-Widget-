const initializeApp = async () => {
  try {
    await window.ZOHO.embeddedApp.init();
    const connection = "crmwidgetconnection";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default initializeApp;
