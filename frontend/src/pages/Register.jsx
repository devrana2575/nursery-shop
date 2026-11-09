import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { passwordStrength, validateRegister } from '../utils/validation';

const EMPTY_FORM = { name: '', email: '', password: '', confirm: '' };

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = passwordStrength(form.password);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    const nextErrors = validateRegister(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      showToast(`Welcome, ${user.name}! Your account is ready.`);
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (error) {
      setApiError(getErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <section className="card auth-card">
        <div className="auth-header">
          <div className="auth-logo" aria-hidden="true">🌱</div>
          <h1>Create your account</h1>
          <p className="muted">Save your cart, place orders and track deliveries.</p>
        </div>

        {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="label" htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              className="input"
              autoComplete="name"
              placeholder="Ravi Patel"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="field">
            <label className="label" htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="field">
            <label className="label" htmlFor="register-password">Password</label>
            <div className="input-with-action">
              <input
                id="register-password"
                className="input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {form.password && (
              <div className="strength">
                <div className="strength-bar">
                  {[1, 2, 3].map((segment) => (
                    <span
                      key={segment}
                      style={{ background: segment <= strength.level ? strength.color : '#e5e7eb' }}
                    />
                  ))}
                </div>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="field">
            <label className="label" htmlFor="register-confirm">Confirm password</label>
            <input
              id="register-confirm"
              className="input"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={(event) => handleChange('confirm', event.target.value)}
              aria-invalid={Boolean(errors.confirm)}
            />
            {errors.confirm && <p className="field-error">{errors.confirm}</p>}
          </div>

          <ul className="rules">
            <li className={form.password.length >= 6 ? 'ok' : ''}>At least 6 characters</li>
            <li className={/[A-Za-z]/.test(form.password) ? 'ok' : ''}>At least one letter</li>
            <li className={/[0-9]/.test(form.password) ? 'ok' : ''}>At least one number</li>
          </ul>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
}
