import axiosInstance from './axiosInstance';

export const codingApi = {
  getLeetCode: async (username) => {
    const res = await axiosInstance.get(`/coding/leetcode/${encodeURIComponent(username)}`);
    return res.data;
  },
  getGitHub: async (username) => {
    const res = await axiosInstance.get(`/coding/github/${encodeURIComponent(username)}`);
    return res.data;
  },
};
