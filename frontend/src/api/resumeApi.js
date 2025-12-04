import axiosInstance from './axiosInstance';

export const resumeApi = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axiosInstance.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  analyze: async (resumeId) => {
    const response = await axiosInstance.post(`/resume/analyze/${resumeId}`);
    return response.data;
  },

  getUserResumes: async () => {
    const response = await axiosInstance.get('/resume');
    return response.data;
  },

  delete: async (resumeId) => {
    const response = await axiosInstance.delete(`/resume/${resumeId}`);
    return response.data;
  },

  download: async (resumeId) => {
    const response = await axiosInstance.get(`/resume/${resumeId}/download`, {
      responseType: 'blob',
    });
    return response;
  },
};
