import axiosInstance from './axiosInstance';

export const profileApi = {
  getProfile: async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await axiosInstance.put('/auth/me', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await axiosInstance.put('/auth/change-password', data);
    return res.data;
  },
  uploadAvatar: async (file) => {
    const form = new FormData();
    form.append('avatar', file);
    const res = await axiosInstance.put('/auth/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  syncLeetCode: async () => {
    const res = await axiosInstance.put('/auth/sync-leetcode');
    return res.data;
  },
  syncGitHub: async () => {
    const res = await axiosInstance.put('/auth/sync-github');
    return res.data;
  },
};
