export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <div className="empty-icon" aria-hidden="true">⚠️</div>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
