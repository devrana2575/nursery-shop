import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real project this would call an API
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>📞 Contact Us</h2>
      <p style={s.sub}>Have a question? We'd love to hear from you.</p>

      <div style={s.grid}>

        {/* Info cards */}
        <div style={s.infoCol}>
          {[
            { icon: '📍', label: 'Address',       value: '12, Garden View Road, Anand, Gujarat - 388001' },
            { icon: '📞', label: 'Phone',          value: '+91 98765 43210' },
            { icon: '✉️', label: 'Email',          value: 'hello@greenplants.in' },
            { icon: '🕐', label: 'Working Hours',  value: 'Mon–Sat: 9am – 7pm\nSunday: 10am – 5pm' },
          ].map(item => (
            <div key={item.label} style={s.infoCard}>
              <span style={s.infoIcon}>{item.icon}</span>
              <div>
                <div style={s.infoLabel}>{item.label}</div>
                <div style={s.infoValue}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div style={s.formBox}>
          <h3 style={s.formTitle}>Send a Message</h3>
          {sent ? (
            <div style={s.successMsg}>
              ✅ Message sent! We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Your Name</label>
                <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ravi Patel" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email Address</label>
                <input style={s.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ravi@email.com" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Message</label>
                <textarea style={{ ...s.input, resize: 'vertical' }} rows={4} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..." required />
              </div>
              <button type="submit" style={s.btn}>Send Message</button>
            </form>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div style={s.mapBox}>
        <div style={s.mapPlaceholder}>
          🗺️ Google Map — Anand, Gujarat
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.3rem' }}>
            (Embed Google Maps iframe here for live deployment)
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap:         { },
  heading:      { color: '#2c6e49', marginBottom: '0.3rem', fontSize: '1.5rem' },
  sub:          { color: '#888', marginBottom: '1.8rem', fontSize: '0.95rem' },
  grid:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
  infoCol:      { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
  infoCard:     { display: 'flex', gap: '0.9rem', alignItems: 'flex-start', background: '#fff', borderRadius: '10px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  infoIcon:     { fontSize: '1.6rem', lineHeight: 1, marginTop: '0.1rem' },
  infoLabel:    { fontSize: '0.78rem', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue:    { fontSize: '0.9rem', color: '#333', fontWeight: '500', marginTop: '0.2rem', whiteSpace: 'pre-line' },
  formBox:      { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  formTitle:    { color: '#2c6e49', marginBottom: '1.2rem', fontSize: '1.1rem' },
  form:         { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
  field:        { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label:        { fontSize: '0.85rem', fontWeight: '600', color: '#444' },
  input:        { padding: '0.6rem 0.9rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', width: '100%', fontFamily: 'inherit' },
  btn:          { padding: '0.7rem', background: '#2c6e49', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem' },
  successMsg:   { background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: '600' },
  mapBox:       { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  mapPlaceholder:{ background: '#e8f5e9', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2c6e49', fontSize: '1.1rem', fontWeight: '600' },
};
