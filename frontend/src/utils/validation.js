export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email address.';
  if (!form.password) errors.password = 'Password is required.';
  return errors;
}

export function validateRegister(form) {
  const errors = {};
  const name = form.name.trim();

  if (!name) errors.name = 'Full name is required.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > 60) errors.name = 'Name cannot exceed 60 characters.';

  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email address.';

  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  else if (!/[A-Za-z]/.test(form.password)) errors.password = 'Password must contain a letter.';
  else if (!/[0-9]/.test(form.password)) errors.password = 'Password must contain a number.';

  if (!form.confirm) errors.confirm = 'Please confirm your password.';
  else if (form.confirm !== form.password) errors.confirm = 'Passwords do not match.';

  return errors;
}

export function passwordStrength(password) {
  if (!password) return { level: 0, label: '', color: '#e5e7eb' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return { level: 1, label: 'Weak', color: '#dc2626' };
  if (score <= 3) return { level: 2, label: 'Medium', color: '#d97706' };
  return { level: 3, label: 'Strong', color: '#16a34a' };
}
