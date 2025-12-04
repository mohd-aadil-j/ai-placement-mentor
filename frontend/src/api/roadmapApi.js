import axiosInstance from './axiosInstance';

export const roadmapApi = {
  generate: async (data) => {
    const response = await axiosInstance.post('/roadmap/generate', data);
    return response.data;
  },
  getUserRoadmaps: async () => {
    const response = await axiosInstance.get('/roadmap');
    return response.data;
  },
  delete: async (roadmapId) => {
    const response = await axiosInstance.delete(`/roadmap/${roadmapId}`);
    return response.data;
  },
};
