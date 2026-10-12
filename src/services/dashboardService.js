import api from './api';

export const dashboardService = {
  getSummary: async (range = 'this_month', startDate = null, endDate = null) => {
    const params = { range };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return await api.get('/dashboard/summary', { params });
  },
};
