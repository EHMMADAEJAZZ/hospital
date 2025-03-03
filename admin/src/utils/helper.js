export const currencyFormater = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

//date format
export const dateFormat = (date) => {
  const options = { year: 'numeric', month: 'long', day:'2-digit' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

//date format with time
export const dateTimeFormat = (date) => {
  const options = { year: 'numeric', month: 'long', day:'2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

//Example usage