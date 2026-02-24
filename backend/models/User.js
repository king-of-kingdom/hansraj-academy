const mongoose = require('mongoose');

const enrolledCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  completedVideos: [{
    type: String
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  transactionId: String
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  enrolledCourses: [enrolledCourseSchema],
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: String
  },
  referralCount: {
    type: Number,
    default: 0
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate referral code before saving
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = 'REF' + Date.now().toString(36).toUpperCase();
  }
  next();
});

// Method to check course access
userSchema.methods.hasCourseAccess = function(courseId) {
  const enrollment = this.enrolledCourses.find(
    e => e.courseId.toString() === courseId.toString()
  );
  return enrollment?.isUnlocked || false;
};

module.exports = mongoose.model('User', userSchema);
