import axiosInstance from './axiosInstance';

export const chatApi = {
  sendMessage: async (message, conversationHistory = [], file = null) => {
    if (file) {
      const form = new FormData();
      form.append('message', message);
      form.append('conversationHistory', JSON.stringify(conversationHistory || []));
      form.append('file', file);
      const response = await axiosInstance.post('/chat/send', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: v => v, // prevent axiosInstance JSON transform
      });
      return response.data;
    }
    const response = await axiosInstance.post('/chat/send', {
      message,
      conversationHistory,
    });
    return response.data;
  },
  
  getConversationHistory: async () => {
    const response = await axiosInstance.get('/chat/history');
    return response.data;
  },
};
