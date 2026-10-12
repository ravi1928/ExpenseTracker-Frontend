import api from './api';

export const budgetService = {
  getBudgets: async (month, year) => {
    return await api.get('/budgets', { params: { month, year } });
  },

  saveBudget: async (data) => {
    return await api.post('/budgets', data);
  },

  deleteBudget: async (id) => {
    return await api.delete(`/budgets/${id}`);
  },
};
