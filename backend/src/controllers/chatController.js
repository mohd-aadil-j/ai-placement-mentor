import axios from 'axios';
import fs from 'fs';
import ChatConversation from '../models/ChatConversation.js';
import { extractTextFromFile } from '../utils/fileTextExtractor.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Send a message to the AI mentor and save conversation
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const file = req.file;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
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

    // Call AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/chat`, {
      message: finalMessage,
      conversation_history: parsedHistory || [],
    });

    const mentorResponse = aiResponse.data.response;

    // Find or create conversation for user
    let conversation = await ChatConversation.findOne({ user: req.user.userId });

    if (!conversation) {
      conversation = new ChatConversation({
        user: req.user.userId,
        messages: [],
      });
    }

    // Add user message and mentor response
    conversation.messages.push({
      role: 'user',
      content: message,
      attachment: attachmentMeta || undefined,
    });

    conversation.messages.push({
      role: 'mentor',
      content: mentorResponse,
    });

    await conversation.save();

    // Cleanup uploaded temp file
    if (file && file.path) {
      try { fs.unlinkSync(file.path); } catch (e) {}
    }

    res.json({
      message: 'Message sent successfully',
      response: mentorResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      message: 'Error sending message', 
      error: error.response?.data?.detail || error.message 
    });
  }
};

/**
 * Get conversation history for authenticated user
 */
export const getConversationHistory = async (req, res) => {
  try {
    const conversation = await ChatConversation.findOne({ user: req.user.userId });

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
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
};
