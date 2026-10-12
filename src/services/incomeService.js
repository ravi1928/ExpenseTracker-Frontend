import api from './api';

export const incomeService = {
  getIncomes: async (params = {}) => {
    return await api.get('/income', { params });
  },

  getIncomeById: async (id) => {
    return await api.get(`/income/${id}`);
  },

  createIncome: async (data) => {
    return await api.post('/income', data);
  },

  updateIncome: async (id, data) => {
    return await api.put(`/income/${id}`, data);
  },

  deleteIncome: async (id) => {
    return await api.delete(`/income/${id}`);
  },
};
