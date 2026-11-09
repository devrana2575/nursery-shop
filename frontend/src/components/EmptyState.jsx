export default function EmptyState({ icon = '🪴', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
