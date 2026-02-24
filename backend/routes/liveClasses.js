const express = require('express');
const router = express.Router();
const LiveClass = require('../models/LiveClass');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/live-classes
// @desc    Get all upcoming live classes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({
      scheduledAt: { $gte: new Date() },
      status: { $in: ['scheduled', 'live'] }
    })
      .populate('courseId', 'title thumbnail')
      .sort({ scheduledAt: 1 });

    res.json({
      success: true,
      liveClasses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live classes',
      error: error.message
    });
  }
});

// @route   GET /api/live-classes/all
// @desc    Get all live classes (Admin)
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const liveClasses = await LiveClass.find()
      .populate('courseId', 'title')
      .sort({ scheduledAt: -1 });

    res.json({
      success: true,
      liveClasses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live classes',
      error: error.message
    });
  }
});

// @route   GET /api/live-classes/course/:courseId
// @desc    Get live classes for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({
      courseId: req.params.courseId,
      scheduledAt: { $gte: new Date() }
    }).sort({ scheduledAt: 1 });

    res.json({
      success: true,
      liveClasses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live classes',
      error: error.message
    });
  }
});

// @route   POST /api/live-classes
// @desc    Create live class (Admin)
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const liveClass = await LiveClass.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Live class scheduled successfully',
      liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create live class',
      error: error.message
    });
  }
});

// @route   PUT /api/live-classes/:id
// @desc    Update live class (Admin)
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    res.json({
      success: true,
      message: 'Live class updated successfully',
      liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update live class',
      error: error.message
    });
  }
});

// @route   DELETE /api/live-classes/:id
// @desc    Delete live class (Admin)
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndDelete(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    res.json({
      success: true,
      message: 'Live class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete live class',
      error: error.message
    });
  }
});

// @route   POST /api/live-classes/:id/join
// @desc    Join live class (record attendance)
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    // Add user to attendees if not already
    if (!liveClass.attendees.includes(req.user._id)) {
      liveClass.attendees.push(req.user._id);
      await liveClass.save();
    }

    res.json({
      success: true,
      message: 'Joined live class',
      meetLink: liveClass.meetLink
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to join live class',
      error: error.message
    });
  }
});

module.exports = router;
