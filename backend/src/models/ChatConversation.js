import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'mentor'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachment: {
    filename: String,
    mimetype: String,
    size: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

chatConversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);

export default ChatConversation;
