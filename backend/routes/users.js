const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (Admin)
// @access  Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    let query = {};
    
    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get stats
    const stats = {
      total: await User.countDocuments(),
      students: await User.countDocuments({ role: 'student' }),
      admins: await User.countDocuments({ role: 'admin' }),
      activeTrials: await User.countDocuments({ 
        trialEndsAt: { $gt: new Date() },
        'enrolledCourses.isUnlocked': { $ne: true }
      })
    };

    res.json({
      success: true,
      users,
      stats,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin)
// @access  Admin
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title thumbnail price');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin)
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin)
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// @route   PUT /api/users/:id/unlock-course
// @desc    Manually unlock course for user (Admin)
// @access  Admin
router.put('/:id/unlock-course', protect, adminOnly, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already enrolled
    let enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === courseId
    );

    if (enrollment) {
      enrollment.isUnlocked = true;
      enrollment.paymentStatus = 'verified';
    } else {
      user.enrolledCourses.push({
        courseId,
        isUnlocked: true,
        paymentStatus: 'verified'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Course unlocked for user'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unlock course',
      error: error.message
    });
  }
});

// @route   GET /api/users/referrals/stats
// @desc    Get referral stats for current user
// @access  Private
router.get('/referrals/stats', protect, async (req, res) => {
  try {
    const referredUsers = await User.find({ 
      referredBy: req.user.referralCode 
    }).select('name email createdAt enrolledCourses');

    const enrolledReferrals = referredUsers.filter(
      u => u.enrolledCourses.some(e => e.isUnlocked)
    );

    res.json({
      success: true,
      stats: {
        totalReferrals: req.user.referralCount,
        enrolledReferrals: enrolledReferrals.length,
        earnings: req.user.referralEarnings
      },
      referrals: referredUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referral stats',
      error: error.message
    });
  }
});

module.exports = router;
