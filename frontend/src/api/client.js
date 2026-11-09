import axios from 'axios';

const TOKEN_KEY = 'nursery_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = Boolean(tokenStore.get());
    if (error.response?.status === 401 && hadToken) {
      tokenStore.clear();
      window.dispatchEvent(new Event('nursery:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error.response?.data?.message || error.message || fallback;
}

export function getFieldErrors(error) {
  const errors = error.response?.data?.errors;
  if (!Array.isArray(errors)) return {};
  return errors.reduce((acc, item) => {
    if (item.field && !acc[item.field]) acc[item.field] = item.message;
    return acc;
  }, {});
}

export default api;
