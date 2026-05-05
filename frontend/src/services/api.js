const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function getStoredAuth() {
  const raw = localStorage.getItem('ethicalTrackerAuth');
  return raw ? JSON.parse(raw) : null;
}

export function saveAuth(auth) {
  localStorage.setItem('ethicalTrackerAuth', JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem('ethicalTrackerAuth');
}

export function loadAuth() {
  return getStoredAuth();
}

async function request(path, options = {}) {
  const auth = getStoredAuth();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getProducts(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== '' && value !== false && value !== null)
    );
    return request(`/products${query.toString() ? `?${query}` : ''}`);
  },
  getProduct(id) {
    return request(`/products/${id}`);
  },
  createProduct(payload) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  addSupplyChainStep(productId, payload) {
    return request(`/products/${productId}/supply-chain`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getDashboard() {
    return request('/dashboard');
  }
};
