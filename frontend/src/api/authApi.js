import axiosInstance from './axiosInstance';

export const authApi = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },
};
