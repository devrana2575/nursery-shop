import { useCallback, useEffect, useState } from 'react';
import { contactApi } from '../api/contact';
import { getErrorMessage } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/format';

export default function Messages() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await contactApi.list();
      setMessages(data.messages);
      setUnread(data.unread);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load messages.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleMarkRead = async (message) => {
    try {
      await contactApi.markRead(message._id);
      setMessages((current) =>
        current.map((item) => (item._id === message._id ? { ...item, read: true } : item))
      );
      setUnread((current) => Math.max(current - 1, 0));
      showToast('Message marked as read.', 'info');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not update the message.'), 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await contactApi.remove(deleteTarget._id);
      setMessages((current) => current.filter((item) => item._id !== deleteTarget._id));
      if (!deleteTarget.read) setUnread((current) => Math.max(current - 1, 0));
      setDeleteTarget(null);
      showToast('Message deleted.', 'info');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not delete the message.'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading messages..." />;
  if (error) return <ErrorState message={error} onRetry={loadMessages} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-heading">✉️ Messages</h1>
          <p className="muted page-subtitle">
            {unread > 0 ? `${unread} unread message${unread === 1 ? '' : 's'}` : 'All messages are read.'}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon="✉️"
          title="No messages yet"
          description="Messages sent through the contact form will appear here."
        />
      ) : (
        <div className="stack">
          {messages.map((message) => (
            <article key={message._id} className={message.read ? 'card message-card' : 'card message-card unread'}>
              <div className="message-header">
                <div>
                  <h2>{message.name}</h2>
                  <p className="muted">
                    {message.email} · {formatDate(message.createdAt)}
                  </p>
                </div>
                <span className={message.read ? 'badge badge-neutral' : 'badge badge-confirmed'}>
                  {message.read ? 'Read' : 'New'}
                </span>
              </div>
              <p className="message-body">{message.message}</p>
              <div className="message-actions">
                {!message.read && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleMarkRead(message)}>
                    Mark as read
                  </button>
                )}
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(message)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this message?"
        description="The message will be permanently removed."
        confirmLabel="Delete message"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
