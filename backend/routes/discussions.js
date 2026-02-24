const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/discussions/course/:courseId
// @desc    Get discussions for a course
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const discussions = await Discussion.find({ courseId: req.params.courseId })
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Discussion.countDocuments({ courseId: req.params.courseId });

    res.json({
      success: true,
      discussions,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussions',
      error: error.message
    });
  }
});

// @route   POST /api/discussions
// @desc    Create a discussion
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { courseId, message } = req.body;

    const discussion = await Discussion.create({
      courseId,
      userId: req.user._id,
      userName: req.user.name,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Discussion posted successfully',
      discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create discussion',
      error: error.message
    });
  }
});

// @route   POST /api/discussions/:id/reply
// @desc    Add reply to discussion
// @access  Private
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const { message } = req.body;

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    discussion.replies.push({
      userId: req.user._id,
      userName: req.user.name,
      message
    });

    await discussion.save();

    res.json({
      success: true,
      message: 'Reply added successfully',
      discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: error.message
    });
  }
});

// @route   PUT /api/discussions/:id/resolve
// @desc    Mark discussion as resolved (Admin)
// @access  Admin
router.put('/:id/resolve', protect, adminOnly, async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { isResolved: true },
      { new: true }
    );

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    res.json({
      success: true,
      message: 'Discussion marked as resolved',
      discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update discussion',
      error: error.message
    });
  }
});

// @route   PUT /api/discussions/:id/pin
// @desc    Pin/Unpin discussion (Admin)
// @access  Admin
router.put('/:id/pin', protect, adminOnly, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.json({
      success: true,
      message: discussion.isPinned ? 'Discussion pinned' : 'Discussion unpinned',
      discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update discussion',
      error: error.message
    });
  }
});

// @route   DELETE /api/discussions/:id
// @desc    Delete discussion (Admin or owner)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Allow deletion by owner or admin
    if (discussion.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion'
      });
    }

    await Discussion.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete discussion',
      error: error.message
    });
  }
});

// @route   GET /api/discussions/all
// @desc    Get all discussions (Admin)
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate('courseId', 'title')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      discussions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discussions',
      error: error.message
    });
  }
});

module.exports = router;
