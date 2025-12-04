import mongoose from 'mongoose';

const interviewRoundSchema = new mongoose.Schema({
  roundName: {
    type: String,
    required: true,
  },
  roundType: {
    type: String,
    enum: ['technical', 'hr', 'coding', 'system-design', 'behavioral', 'group-discussion', 'case-study', 'other'],
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  rounds: [interviewRoundSchema],
  additionalNotes: {
    type: String,
  },
  preparationPlan: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

interviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
