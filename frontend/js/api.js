const API_BASE = 'http://localhost:5000/api/v1';

class ApiClient {
  constructor(role) {
    this.role = role;
    this.token = localStorage.getItem(`${role}_token`);
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // FIXED: Don't parse JSON on 204 No Content or empty body
      let data;
      const contentType = response.headers.get('content-type');
      if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
        data = { success: true };
      } else {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); }
  patch(endpoint, body) { return this.request(endpoint, { method: 'PATCH', body }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString();
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString();
}

function logout(role) {
  localStorage.removeItem(`${role}_token`);
  localStorage.removeItem(`${role}_user`);
  window.location.href = `/${role}/login.html`;
}

function checkAuth(role) {
  const token = localStorage.getItem(`${role}_token`);
  if (!token) {
    window.location.href = `/${role}/login.html`;
    return null;
  }
  return new ApiClient(role);
}