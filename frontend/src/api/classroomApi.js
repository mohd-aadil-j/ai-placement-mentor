import axiosInstance from './axiosInstance';

export const classroomApi = {
  sendMessage: async (assistantType, message, conversationHistory = [], file = null) => {
    if (file) {
      const form = new FormData();
      form.append('assistantType', assistantType);
      form.append('message', message);
      form.append('conversationHistory', JSON.stringify(conversationHistory || []));
      form.append('file', file);
      const response = await axiosInstance.post('/classroom/send', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: v => v,
      });
      return response.data;
    }
    const response = await axiosInstance.post('/classroom/send', {
      assistantType,
      message,
      conversationHistory,
    });
    return response.data;
  },
  
  getConversationHistory: async (assistantType) => {
    const response = await axiosInstance.get(`/classroom/${assistantType}`);
    return response.data;
  },

  clearConversation: async (assistantType) => {
    const response = await axiosInstance.delete(`/classroom/${assistantType}`);
    return response.data;
  },
};
