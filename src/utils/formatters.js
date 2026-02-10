// Format currency to Indonesian Rupiah
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date to Indonesian locale
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
};

// Format date for input field
export const formatDateInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate months between dates
export const monthsBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  return formatDateInput(new Date());
};

// Format number with thousands separator
export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Format number input with dots (for display in input field)
export const formatInputNumber = (value) => {
  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Format with dots as thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted number back to plain number
export const parseFormattedNumber = (value) => {
  // Remove all dots
  return value.replace(/\./g, '');
};

// Get plain number from formatted input (for saving to DB)
export const getPlainNumber = (formattedValue) => {
  const plain = parseFormattedNumber(formattedValue);
  return plain === '' ? 0 : parseInt(plain, 10);
};
