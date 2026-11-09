import { STATUS_CLASS } from '../utils/format';

export default function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_CLASS[status] || 'badge-neutral'}`}>{status}</span>;
}
