const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    // Basic stats
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const totalCertificates = await Certificate.countDocuments();

    // Revenue stats
    const revenueStats = await Payment.aggregate([
      { $match: { status: 'verified' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent payments
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('courseIds', 'title');

    // Recent users
    const recentUsers = await User.find({ role: 'student' })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'verified',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Popular courses (by enrollment)
    const popularCourses = await Course.find()
      .select('title thumbnail enrollmentCount price')
      .sort({ enrollmentCount: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        publishedCourses,
        pendingPayments,
        totalCertificates,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        totalSales: revenueStats[0]?.count || 0
      },
      recentPayments,
      recentUsers,
      monthlyRevenue,
      popularCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Admin
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Daily signups
    const dailySignups = await User.aggregate([
      { $match: { createdAt: { $gte: startDate }, role: 'student' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily revenue
    const dailyRevenue = await Payment.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'verified' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Course category distribution
    const categoryDistribution = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalEnrollments: { $sum: '$enrollmentCount' }
        }
      }
    ]);

    // Payment method distribution
    const paymentMethods = await Payment.aggregate([
      { $match: { status: 'verified' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // User retention (users with >1 course)
    const retentionStats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $project: {
          courseCount: { $size: { $ifNull: ['$enrolledCourses', []] } }
        }
      },
      {
        $group: {
          _id: null,
          noCourses: { $sum: { $cond: [{ $eq: ['$courseCount', 0] }, 1, 0] } },
          oneCourse: { $sum: { $cond: [{ $eq: ['$courseCount', 1] }, 1, 0] } },
          multipleCourses: { $sum: { $cond: [{ $gt: ['$courseCount', 1] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        dailySignups,
        dailyRevenue,
        categoryDistribution,
        paymentMethods,
        retentionStats: retentionStats[0] || {}
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// @route   POST /api/admin/send-notification
// @desc    Send notification to users
// @access  Admin
router.post('/send-notification', protect, adminOnly, async (req, res) => {
  try {
    const { type, userIds, title, message } = req.body;

    // In production, integrate with email/WhatsApp service
    // For now, just log the notification
    console.log('Notification:', { type, userIds, title, message });

    res.json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

module.exports = router;
