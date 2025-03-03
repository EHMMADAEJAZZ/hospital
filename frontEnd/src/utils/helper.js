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

//filter data based on given criteria