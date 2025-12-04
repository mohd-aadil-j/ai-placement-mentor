import axios from 'axios';
import fs from 'fs';
import ClassroomConversation from '../models/ClassroomConversation.js';
import { extractTextFromFile } from '../utils/fileTextExtractor.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Send message to classroom assistant
 */
export const sendMessageToAssistant = async (req, res) => {
  try {
    const { assistantType, message, conversationHistory } = req.body;
    const file = req.file;

    if (!assistantType || !message || !message.trim()) {
      return res.status(400).json({ message: 'Assistant type and message are required' });
    }

    if (!['technical', 'coding', 'aptitude'].includes(assistantType)) {
      return res.status(400).json({ message: 'Invalid assistant type' });
    }

    // Build message with optional attachment context
    let finalMessage = message;
    let attachmentMeta = null;
    if (file) {
      const text = await extractTextFromFile(file.path, file.mimetype, file.originalname);
      const safeText = text ? `\n\n[Attachment: ${file.originalname}]\n${text}` : `\n\n[Attachment: ${file.originalname}] (could not extract text)`;
      finalMessage = `${message}${safeText}`;
      attachmentMeta = {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
    }

    // Parse conversation history if sent as string (multipart)
    let parsedHistory = conversationHistory;
    if (typeof parsedHistory === 'string') {
      try {
        parsedHistory = JSON.parse(parsedHistory);
      } catch (e) {
        parsedHistory = [];
      }
    }

    // Call appropriate AI service endpoint
    const endpoint = `${AI_SERVICE_URL}/ai/classroom/${assistantType}`;
    const aiResponse = await axios.post(endpoint, {
      message: finalMessage,
      conversation_history: parsedHistory || [],
    });

    const assistantResponse = aiResponse.data.response;
    const assistantRole = aiResponse.data.role;

    // Find or create conversation
    let conversation = await ClassroomConversation.findOne({ 
      user: req.user.userId,
      assistantType 
    });

    if (!conversation) {
      conversation = new ClassroomConversation({
        user: req.user.userId,
        assistantType,
        messages: [],
      });
    }

    // Add messages
    conversation.messages.push({
      role: 'user',
      content: message,
      attachment: attachmentMeta || undefined,
    });

    conversation.messages.push({
      role: assistantRole,
      content: assistantResponse,
    });

    await conversation.save();

    // Cleanup uploaded temp file
    if (file && file.path) {
      try { fs.unlinkSync(file.path); } catch (e) {}
    }

    res.json({
      message: 'Message sent successfully',
      response: assistantResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Send classroom message error:', error);
    res.status(500).json({ 
      message: 'Error sending message', 
      error: error.response?.data?.detail || error.message 
    });
  }
};

/**
 * Get conversation history for specific assistant
 */
export const getAssistantConversation = async (req, res) => {
  try {
    const { assistantType } = req.params;

    if (!['technical', 'coding', 'aptitude'].includes(assistantType)) {
      return res.status(400).json({ message: 'Invalid assistant type' });
    }

    const conversation = await ClassroomConversation.findOne({ 
      user: req.user.userId,
      assistantType 
    });

    if (!conversation) {
      return res.json({
        messages: [],
      });
    }

    res.json({
      messages: conversation.messages,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Get classroom conversation error:', error);
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
};

/**
 * Clear conversation history for specific assistant
 */
export const clearAssistantConversation = async (req, res) => {
  try {
    const { assistantType } = req.params;

    if (!['technical', 'coding', 'aptitude'].includes(assistantType)) {
      return res.status(400).json({ message: 'Invalid assistant type' });
    }

    await ClassroomConversation.findOneAndDelete({ 
      user: req.user.userId,
      assistantType 
    });

    res.json({ message: 'Conversation cleared successfully' });
  } catch (error) {
    console.error('Clear classroom conversation error:', error);
    res.status(500).json({ message: 'Error clearing conversation', error: error.message });
  }
};
