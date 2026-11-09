export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;

  const pageNumbers = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i += 1) pageNumbers.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        ← Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          type="button"
          className={number === page ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
      >
        Next →
      </button>
    </nav>
  );
}
