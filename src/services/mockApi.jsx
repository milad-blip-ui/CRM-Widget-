// src/services/mockApi.js
const generateMockData = () => {
    const statuses = [
        'Draft',
        'Sent for approval',
        'Internally Approved',
        'Sent to customer',
        'Accepted by customer',
        'Revised'
    ];

    const mockData = [];

    for (let i = 1; i <= 3000; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const quoteID = (Math.random() * 1e19).toFixed(0); // Generating a large random ID
        const quoteDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
        const quoteDateString = quoteDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        mockData.push({
            ID: quoteID,
            Quote: `QT-${Math.floor(Math.random() * 1e7)}`, // Generating a random quote number
            Quote_name: `Revise of task ${i}`,
            Status: randomStatus,
            Quote_date: quoteDateString,
            CRM_Account_Name_String: `Dummy-${Math.floor(Math.random() * 1000) + 1}`,
            SalespersonName: `Salesperson ${Math.ceil(Math.random() * 10)}` // Generating a random salesperson name
        });
    }

    return mockData;
};

export const fetchAllEstimates = () => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            resolve(generateMockData());
        }, 800);
    });
};