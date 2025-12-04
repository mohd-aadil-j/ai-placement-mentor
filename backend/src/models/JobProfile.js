import mongoose from 'mongoose';

const jobProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jdText: {
      type: String,
      required: [true, 'Job description text is required'],
    },
  },
  {
    timestamps: true,
  }
);

const JobProfile = mongoose.model('JobProfile', jobProfileSchema);

export default JobProfile;
