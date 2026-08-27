export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const CATEGORY_COLORS = [
  "#1fb56d", "#42d187", "#78e5ab", "#0ea5e9", "#6366f1",
  "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#14b8a6",
];
