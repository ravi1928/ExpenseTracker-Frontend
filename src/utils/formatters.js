export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Education',
  'Healthcare',
  'Entertainment',
  'Bills and Utilities',
  'Rent',
  'Travel',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelancing',
  'Business',
  'Investments',
  'Allowance',
  'Other',
];

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Cash',
  'UPI / Wallet',
];

export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transportation: '#3b82f6',
  Shopping: '#ec4899',
  Education: '#8b5cf6',
  Healthcare: '#ef4444',
  Entertainment: '#10b981',
  'Bills and Utilities': '#06b6d4',
  Rent: '#6366f1',
  Travel: '#14b8a6',
  Other: '#64748b',

  Salary: '#10b981',
  Freelancing: '#06b6d4',
  Business: '#3b82f6',
  Investments: '#8b5cf6',
  Allowance: '#f59e0b',
};
