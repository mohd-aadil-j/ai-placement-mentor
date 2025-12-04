import axiosInstance from './axiosInstance';

export const jdApi = {
  create: async (data) => {
    const response = await axiosInstance.post('/jd', data);
    return response.data;
  },

  getUserJobProfiles: async () => {
    const response = await axiosInstance.get('/jd');
    return response.data;
  },

  delete: async (jdId) => {
    const response = await axiosInstance.delete(`/jd/${jdId}`);
    return response.data;
  },
};
