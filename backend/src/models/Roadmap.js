import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  timeframeMonths: {
    type: Number,
    required: true,
  },
  currentSkills: {
    type: [String],
    default: [],
  },
  roadmap: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
