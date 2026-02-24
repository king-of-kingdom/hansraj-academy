const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '10:00'
  },
  isFree: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 1
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },
  instructor: {
    type: String,
    default: 'Amit Sir'
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  originalPrice: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'
  },
  category: {
    type: String,
    required: true,
    enum: ['MS Office', 'Programming', 'Graphics', 'Web Development', 'Hardware', 'Other']
  },
  language: {
    type: String,
    default: 'Hindi'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: String,
    default: '10+ Hours'
  },
  videos: [videoSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.8
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for video count
courseSchema.virtual('videoCount').get(function() {
  return this.videos.length;
});

// Virtual for free video count
courseSchema.virtual('freeVideoCount').get(function() {
  return this.videos.filter(v => v.isFree).length;
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Course', courseSchema);
