import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    targetRole: {
      type: String,
      default: '',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
      trim: true,
    },
    leetcodeUsername: {
      type: String,
      default: '',
      trim: true,
    },
    githubUsername: {
      type: String,
      default: '',
      trim: true,
    },
    leetcodeData: {
      type: Object,
      default: {},
    },
    githubData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
