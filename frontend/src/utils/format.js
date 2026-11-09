export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

export const ORDER_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: [],
};

export const STATUS_CLASS = {
  Pending: 'badge-pending',
  Confirmed: 'badge-confirmed',
  Delivered: 'badge-delivered',
  Cancelled: 'badge-cancelled',
};

export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export function shortOrderId(id) {
  return `#${String(id).slice(-8).toUpperCase()}`;
}
