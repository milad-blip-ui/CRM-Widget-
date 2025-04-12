export const formatDate = (inputDate) => {
  // Check if inputDate is a properly formatted string "DD-MMM-YYYY"
  const formattedDatePattern = /^\d{2}-[A-Za-z]{3}-\d{4}$/;

  if (typeof inputDate === 'string' && formattedDatePattern.test(inputDate)) {
      return inputDate; // Return the formatted date string as is
  }

  // If inputDate is not a string or doesn't match the pattern, proceed with Date object processing
  if (!inputDate || !(inputDate instanceof Date) || isNaN(inputDate)) {
      return ''; // Return empty string for invalid input
  }

  const day = String(inputDate.getDate()).padStart(2, '0'); // 02
  const month = inputDate.toLocaleString('en-GB', { month: 'short' }); // Mar
  const year = inputDate.getFullYear(); // 2025

  return `${day}-${month}-${year}`; // Return in DD-MMM-YYYY format
};