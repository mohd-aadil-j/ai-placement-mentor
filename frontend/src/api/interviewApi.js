import axiosInstance from './axiosInstance';

export const interviewApi = {
  create: async (data) => {
    const response = await axiosInstance.post('/interview', data);
    return response.data;
  },

  getUserInterviews: async () => {
    const response = await axiosInstance.get('/interview');
    return response.data;
  },

  updateRoundStatus: async (interviewId, roundIndex, status) => {
    const response = await axiosInstance.patch(`/interview/${interviewId}/round`, {
      roundIndex,
      status,
    });
    return response.data;
  },

  delete: async (interviewId) => {
    const response = await axiosInstance.delete(`/interview/${interviewId}`);
    return response.data;
  },
};
