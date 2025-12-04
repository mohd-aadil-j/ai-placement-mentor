import mongoose from 'mongoose';

const classroomMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'technical_assistant', 'coding_assistant', 'aptitude_assistant'],
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

const classroomConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assistantType: {
    type: String,
    enum: ['technical', 'coding', 'aptitude'],
    required: true,
  },
  messages: [classroomMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

classroomConversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ClassroomConversation = mongoose.model('ClassroomConversation', classroomConversationSchema);

export default ClassroomConversation;
