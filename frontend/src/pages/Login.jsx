import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { DEMO_CREDENTIALS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateLogin } from '../utils/validation';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const user = await login({
        email: form.email.trim(),
        password: form.password,
      });
      showToast(`Welcome back, ${user.name}!`);
      navigate(redirectTo || (user.role === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (error) {
      setApiError(getErrorMessage(error, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setForm(DEMO_CREDENTIALS[role]);
    setErrors({});
    setApiError('');
  };

  return (
    <div className="auth-wrap">
      <section className="card auth-card">
        <div className="auth-header">
          <div className="auth-logo" aria-hidden="true">🌿</div>
          <h1>Welcome back</h1>
          <p className="muted">Sign in to place orders and track deliveries.</p>
        </div>

        {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
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
            <label className="label" htmlFor="login-password">Password</label>
            <div className="input-with-action">
              <input
                id="login-password"
                className="input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
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
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>

        <div className="demo-box">
          <p><strong>Demo accounts</strong></p>
          <div className="demo-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemo('user')}>
              User demo
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemo('admin')}>
              Admin demo
            </button>
          </div>
          <p className="hint">user@nursery.com / user1234 · admin@nursery.com / admin123</p>
        </div>
      </section>
    </div>
  );
}
