const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    let query = { isPublished: true };

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
});

// @route   GET /api/courses/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });
    res.json({
      success: true,
      categories: ['All', ...categories]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has access
    let hasAccess = false;
    let enrollment = null;

    if (req.user) {
      enrollment = req.user.enrolledCourses.find(
        e => e.courseId.toString() === course._id.toString()
      );
      hasAccess = enrollment?.isUnlocked || req.user.hasTrialAccess();
    }

    res.json({
      success: true,
      course,
      hasAccess,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
});

// @route   POST /api/courses/:id/videos
// @desc    Add video to course
// @access  Admin
router.post('/:id/videos', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const { title, youtubeUrl, duration, isFree } = req.body;

    course.videos.push({
      title,
      youtubeUrl,
      duration,
      isFree,
      order: course.videos.length + 1
    });

    await course.save();

    res.json({
      success: true,
      message: 'Video added successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add video',
      error: error.message
    });
  }
});

// @route   DELETE /api/courses/:courseId/videos/:videoId
// @desc    Remove video from course
// @access  Admin
router.delete('/:courseId/videos/:videoId', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.videos = course.videos.filter(
      v => v._id.toString() !== req.params.videoId
    );

    // Reorder remaining videos
    course.videos.forEach((video, index) => {
      video.order = index + 1;
    });

    await course.save();

    res.json({
      success: true,
      message: 'Video removed successfully',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove video',
      error: error.message
    });
  }
});

// @route   PUT /api/courses/:id/progress
// @desc    Update video progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { videoId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollment = req.user.enrolledCourses.find(
      e => e.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Add video to completed if not already
    if (!enrollment.completedVideos.includes(videoId)) {
      enrollment.completedVideos.push(videoId);
    }

    // Calculate progress
    enrollment.progress = Math.round(
      (enrollment.completedVideos.length / course.videos.length) * 100
    );

    await req.user.save();

    res.json({
      success: true,
      message: 'Progress updated',
      progress: enrollment.progress,
      completedVideos: enrollment.completedVideos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
});

module.exports = router;
