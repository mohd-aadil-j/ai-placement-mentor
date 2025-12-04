import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      default: '',
    },
    filePath: {
      type: String,
      required: true,
    },
    rawText: {
      type: String,
      required: true,
    },
    parsedSkills: {
      type: [String],
      default: [],
    },
    parsedProjects: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
