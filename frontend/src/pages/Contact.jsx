import { useState } from 'react';
import { contactApi } from '../api/contact';
import { getErrorMessage } from '../api/client';

const EMPTY = { name: '', email: '', message: '' };

const INFO = [
  { icon: '📍', label: 'Address', value: '12, Garden View Road, Anand, Gujarat 388001' },
  { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
  { icon: '✉️', label: 'Email', value: 'hello@greenplants.in' },
  { icon: '🕐', label: 'Working hours', value: 'Mon–Sat: 9am – 7pm · Sunday: 10am – 5pm' },
];

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Your name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (form.message.trim().length < 10) {
      next.message = 'Please write at least 10 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    setSuccess('');
    if (!validate()) return;

    setSending(true);
    try {
      const { data } = await contactApi.send({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSuccess(data.message);
      setForm(EMPTY);
    } catch (err) {
      setApiError(getErrorMessage(err, 'Could not send your message. Please try again.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h1 className="page-heading">📞 Contact us</h1>
      <p className="muted page-subtitle">Questions about a plant or an order? Send us a note.</p>

      <div className="contact-grid">
        <div className="stack">
          {INFO.map((item) => (
            <div key={item.label} className="card info-card">
              <span className="info-icon" aria-hidden="true">{item.icon}</span>
              <div>
                <p className="info-label">{item.label}</p>
                <p className="info-value">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="card form-card">
          <h2>Send a message</h2>
          <p className="muted">We usually reply within one business day.</p>

          {success && <div className="alert alert-success" role="status">{success}</div>}
          {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="label" htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                className="input"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Ravi Patel"
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="field">
              <label className="label" htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="ravi@email.com"
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="field">
              <label className="label" htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                className="textarea"
                rows={5}
                maxLength={1000}
                value={form.message}
                onChange={(event) => handleChange('message', event.target.value)}
                placeholder="How can we help?"
              />
              <p className="hint">{form.message.length}/1000 characters</p>
              {errors.message && <p className="field-error">{errors.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
