const ICONS = {
  success: '✅',
  error: '⚠️',
  warning: '⚠️',
  info: 'ℹ️',
};

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
          <span aria-hidden="true">{ICONS[toast.type] || ICONS.info}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
