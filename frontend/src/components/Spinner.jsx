export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="spinner-text">{label}</p>
    </div>
  );
}
