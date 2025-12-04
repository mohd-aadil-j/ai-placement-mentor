import axiosInstance from './axiosInstance';

export const analysisApi = {
  compare: async (data) => {
    const response = await axiosInstance.post('/analysis/compare', data);
    return response.data;
  },

  getUserAnalyses: async () => {
    const response = await axiosInstance.get('/analysis');
    return response.data;
  },
};
