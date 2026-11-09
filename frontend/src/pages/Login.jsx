import { useState } from 'react';
import axios from 'axios';

// ── inline validation rules ──────────────────────────────────────────
function validate(form) {
  const errors = {};

  const email = form.email.trim();
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  const pwd = form.password;
  if (!pwd) {
    errors.password = 'Password is required.';
  } else if (pwd.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export default function Login({ onLogin, goToRegister }) {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});          // field-level errors
  const [apiErr,  setApiErr]  = useState('');           // server error
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState({});           // track blurred fields

  // validate one field on blur
  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    const errs = validate(form);
    setErrors(e => ({ ...e, [field]: errs[field] }));
  };

  // clear field error while typing
  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (touched[field]) {
      const errs = validate({ ...form, [field]: value });
      setErrors(e => ({ ...e, [field]: errs[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');

    // mark all fields touched, run full validation
    setTouched({ email: true, password: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/login', {
        email: form.email.trim(),
        password: form.password,
      });
      onLogin(res.data);
    } catch (error) {
      setApiErr(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.logo}>🌿</div>
          <h2 style={s.title}>Welcome Back</h2>
          <p style={s.subtitle}>Login to your nursery account</p>
        </div>

        {/* API / server error */}
        {apiErr && (
          <div style={s.apiError}>
            <span>⚠️</span> {apiErr}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input
              style={{ ...s.input, ...(errors.email && touched.email ? s.inputError : {}) }}
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              autoComplete="email"
            />
            {errors.email && touched.email && (
              <p style={s.fieldError}>❌ {errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.pwdWrap}>
              <input
                style={{ ...s.input, ...s.pwdInput, ...(errors.password && touched.password ? s.inputError : {}) }}
                type={showPwd ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                autoComplete="current-password"
              />
              <button
                type="button"
                style={s.eyeBtn}
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && touched.password && (
              <p style={s.fieldError}>❌ {errors.password}</p>
            )}
          </div>

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>

        <p style={s.link}>
          Don't have an account?{' '}
          <span onClick={goToRegister} style={s.anchor}>Register here</span>
        </p>

        {/* Demo hint for examiner */}
        <div style={s.hint}>
          <strong>Demo:</strong> admin@nursery.com / admin123
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap:       { display: 'flex', justifyContent: 'center', paddingTop: '3rem', paddingBottom: '3rem' },
  card:       { background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', width: '100%', maxWidth: '420px' },
  header:     { textAlign: 'center', marginBottom: '1.8rem' },
  logo:       { fontSize: '3rem', marginBottom: '0.4rem' },
  title:      { color: '#2c6e49', margin: '0 0 0.3rem', fontSize: '1.5rem', fontWeight: '800' },
  subtitle:   { color: '#888', fontSize: '0.9rem', margin: 0 },
  apiError:   { background: '#fdf0f0', border: '1px solid #f5c6cb', color: '#721c24', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.2rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' },
  field:      { marginBottom: '1.1rem' },
  label:      { display: 'block', fontWeight: '600', color: '#444', fontSize: '0.88rem', marginBottom: '0.35rem' },
  input:      { width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
  inputError: { border: '1.5px solid #e74c3c', background: '#fff8f8' },
  fieldError: { color: '#e74c3c', fontSize: '0.8rem', margin: '0.3rem 0 0', fontWeight: '500' },
  pwdWrap:    { position: 'relative' },
  pwdInput:   { paddingRight: '2.8rem' },
  eyeBtn:     { position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', padding: '0.2rem' },
  btn:        { width: '100%', padding: '0.85rem', background: '#2c6e49', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', marginTop: '0.4rem', cursor: 'pointer', opacity: 1 },
  link:       { textAlign: 'center', marginTop: '1.2rem', color: '#666', fontSize: '0.9rem' },
  anchor:     { color: '#2c6e49', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' },
  hint:       { marginTop: '1rem', background: '#f0faf0', border: '1px dashed #a8d8a8', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#555', textAlign: 'center' },
};
