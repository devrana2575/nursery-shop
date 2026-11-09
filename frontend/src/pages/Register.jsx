import { useState } from 'react';
import axios from 'axios';

// ── validation rules ──────────────────────────────────────────────────
function validate(form) {
  const errors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.name = 'Name can only contain letters and spaces.';
  }

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
  } else if (!/[A-Za-z]/.test(pwd)) {
    errors.password = 'Password must contain at least one letter.';
  } else if (!/[0-9]/.test(pwd)) {
    errors.password = 'Password must contain at least one number.';
  }

  const confirm = form.confirm;
  if (!confirm) {
    errors.confirm = 'Please confirm your password.';
  } else if (confirm !== pwd) {
    errors.confirm = 'Passwords do not match.';
  }

  return errors;
}

// ── password strength ─────────────────────────────────────────────────
function strength(pwd) {
  if (!pwd) return { level: 0, label: '', color: '#eee' };
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 1, label: 'Weak',   color: '#e74c3c' };
  if (score <= 3) return { level: 2, label: 'Medium', color: '#f39c12' };
  return             { level: 3, label: 'Strong',  color: '#27ae60' };
}

export default function Register({ onRegister, goToLogin }) {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors,  setErrors]  = useState({});
  const [apiErr,  setApiErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [touched, setTouched] = useState({});

  const pwdStr = strength(form.password);

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    const errs = validate(form);
    setErrors(e => ({ ...e, [field]: errs[field] }));
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      const errs = validate(updated);
      setErrors(e => ({ ...e, [field]: errs[field] }));
    }
    // also re-validate confirm when password changes
    if (field === 'password' && touched.confirm) {
      const errs = validate(updated);
      setErrors(e => ({ ...e, confirm: errs.confirm }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    setTouched({ name: true, email: true, password: true, confirm: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/register', {
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password,
      });
      onRegister(res.data);
    } catch (error) {
      setApiErr(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, type = 'text', placeholder, showToggle, show, onToggle }) => (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={showToggle ? s.pwdWrap : {}}>
        <input
          style={{ ...s.input, ...(errors[id] && touched[id] ? s.inputError : {}), ...(showToggle ? s.pwdInput : {}) }}
          type={showToggle ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={form[id]}
          onChange={e => handleChange(id, e.target.value)}
          onBlur={() => handleBlur(id)}
          autoComplete={id === 'confirm' ? 'new-password' : id === 'password' ? 'new-password' : id}
        />
        {showToggle && (
          <button type="button" style={s.eyeBtn} onClick={onToggle} tabIndex={-1}>
            {show ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {errors[id] && touched[id] && (
        <p style={s.fieldError}>❌ {errors[id]}</p>
      )}
    </div>
  );

  return (
    <div style={s.wrap}>
      <div style={s.card}>

        <div style={s.header}>
          <div style={s.logo}>🌱</div>
          <h2 style={s.title}>Create Account</h2>
          <p style={s.subtitle}>Join the nursery community</p>
        </div>

        {apiErr && (
          <div style={s.apiError}>
            <span>⚠️</span> {apiErr}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <Field id="name" label="Full Name" placeholder="Ravi Patel" />

          {/* Email */}
          <Field id="email" label="Email Address" type="email" placeholder="you@email.com" />

          {/* Password */}
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.pwdWrap}>
              <input
                style={{ ...s.input, ...s.pwdInput, ...(errors.password && touched.password ? s.inputError : {}) }}
                type={showPwd ? 'text' : 'password'}
                placeholder="Min. 6 chars, with letter + number"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                autoComplete="new-password"
              />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Strength bar */}
            {form.password && (
              <div style={s.strengthWrap}>
                <div style={s.strengthBar}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ ...s.strengthSeg, background: i <= pwdStr.level ? pwdStr.color : '#e0e0e0' }} />
                  ))}
                </div>
                <span style={{ ...s.strengthLabel, color: pwdStr.color }}>{pwdStr.label}</span>
              </div>
            )}
            {errors.password && touched.password && (
              <p style={s.fieldError}>❌ {errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <div style={s.pwdWrap}>
              <input
                style={{ ...s.input, ...s.pwdInput, ...(errors.confirm && touched.confirm ? s.inputError : {}), ...(form.confirm && !errors.confirm && touched.confirm ? s.inputOk : {}) }}
                type={showCon ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={e => handleChange('confirm', e.target.value)}
                onBlur={() => handleBlur('confirm')}
                autoComplete="new-password"
              />
              <button type="button" style={s.eyeBtn} onClick={() => setShowCon(v => !v)} tabIndex={-1}>
                {showCon ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirm && touched.confirm && (
              <p style={s.fieldError}>❌ {errors.confirm}</p>
            )}
            {form.confirm && !errors.confirm && touched.confirm && (
              <p style={s.fieldOk}>✅ Passwords match!</p>
            )}
          </div>

          {/* Rules hint */}
          <div style={s.rules}>
            <p style={s.rulesTitle}>Password must have:</p>
            <Rule ok={form.password.length >= 6}     text="At least 6 characters" />
            <Rule ok={/[A-Za-z]/.test(form.password)} text="At least one letter" />
            <Rule ok={/[0-9]/.test(form.password)}    text="At least one number" />
          </div>

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? '⏳ Creating account...' : '🌱 Create Account'}
          </button>
        </form>

        <p style={s.link}>
          Already have an account?{' '}
          <span onClick={goToLogin} style={s.anchor}>Login here</span>
        </p>
      </div>
    </div>
  );
}

function Rule({ ok, text }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.2rem' }}>
      <span style={{ fontSize: '0.75rem', color: ok ? '#27ae60' : '#bbb' }}>{ok ? '✅' : '⚪'}</span>
      <span style={{ fontSize: '0.78rem', color: ok ? '#27ae60' : '#999' }}>{text}</span>
    </div>
  );
}

const s = {
  wrap:          { display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '3rem' },
  card:          { background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', width: '100%', maxWidth: '440px' },
  header:        { textAlign: 'center', marginBottom: '1.5rem' },
  logo:          { fontSize: '3rem', marginBottom: '0.4rem' },
  title:         { color: '#2c6e49', margin: '0 0 0.3rem', fontSize: '1.5rem', fontWeight: '800' },
  subtitle:      { color: '#888', fontSize: '0.9rem', margin: 0 },
  apiError:      { background: '#fdf0f0', border: '1px solid #f5c6cb', color: '#721c24', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.2rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' },
  field:         { marginBottom: '1rem' },
  label:         { display: 'block', fontWeight: '600', color: '#444', fontSize: '0.88rem', marginBottom: '0.35rem' },
  input:         { width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' },
  inputError:    { border: '1.5px solid #e74c3c', background: '#fff8f8' },
  inputOk:       { border: '1.5px solid #27ae60', background: '#f0fdf4' },
  fieldError:    { color: '#e74c3c', fontSize: '0.8rem', margin: '0.3rem 0 0', fontWeight: '500' },
  fieldOk:       { color: '#27ae60', fontSize: '0.8rem', margin: '0.3rem 0 0', fontWeight: '500' },
  pwdWrap:       { position: 'relative' },
  pwdInput:      { paddingRight: '2.8rem' },
  eyeBtn:        { position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', padding: '0.2rem' },
  strengthWrap:  { display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem' },
  strengthBar:   { display: 'flex', gap: '4px', flex: 1 },
  strengthSeg:   { height: '4px', flex: 1, borderRadius: '2px', transition: 'background 0.3s' },
  strengthLabel: { fontSize: '0.75rem', fontWeight: '700', minWidth: '42px' },
  rules:         { background: '#f9fbf9', border: '1px solid #e0f0e0', borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1.1rem' },
  rulesTitle:    { fontSize: '0.78rem', fontWeight: '700', color: '#555', margin: '0 0 0.4rem' },
  btn:           { width: '100%', padding: '0.85rem', background: '#2c6e49', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
  link:          { textAlign: 'center', marginTop: '1.2rem', color: '#666', fontSize: '0.9rem' },
  anchor:        { color: '#2c6e49', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' },
};
