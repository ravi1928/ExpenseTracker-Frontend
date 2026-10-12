import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.accessToken) {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: res.data.id,
        fullName: res.data.fullName,
        email: res.data.email,
      }));
    }
    return res;
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getProfile: async () => {
    return await api.get('/users/profile');
  },
};
