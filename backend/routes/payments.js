const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/payments/submit
// @desc    Submit payment for courses
// @access  Private
router.post('/submit', protect, async (req, res) => {
  try {
    const { courseIds, transactionId } = req.body;

    if (!courseIds || courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course IDs'
      });
    }

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide transaction ID'
      });
    }

    // Get courses
    const courses = await Course.find({ _id: { $in: courseIds } });
    
    // Calculate total with bundle discount
    const settings = await Settings.findOne();
    const subtotal = courses.reduce((sum, c) => sum + c.price, 0);
    
    const bundleDiscount = settings.bundleDiscounts.find(
      b => b.courseCount === courseIds.length
    );
    let discountPercent = bundleDiscount?.discountPercent || 0;
    
    // Apply festival discount if higher
    if (settings.festivalDiscount.enabled && 
        new Date(settings.festivalDiscount.endDate) > new Date()) {
      discountPercent = Math.max(discountPercent, settings.festivalDiscount.percent);
    }
    
    const discount = (subtotal * discountPercent) / 100;
    const totalAmount = subtotal - discount;

    // Create payment record
    const payment = await Payment.create({
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone,
      courseIds,
      totalAmount,
      discountApplied: discount,
      transactionId,
      status: 'pending'
    });

    // Add courses to user's enrolled courses (locked)
    for (const courseId of courseIds) {
      const alreadyEnrolled = req.user.enrolledCourses.find(
        e => e.courseId.toString() === courseId.toString()
      );

      if (!alreadyEnrolled) {
        req.user.enrolledCourses.push({
          courseId,
          paymentStatus: 'pending',
          transactionId,
          isUnlocked: false
        });
      }
    }

    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully. Waiting for verification.',
      payment: {
        id: payment._id,
        amount: totalAmount,
        transactionId,
        status: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit payment',
      error: error.message
    });
  }
});

// @route   GET /api/payments/my-payments
// @desc    Get user's payment history
// @access  Private
router.get('/my-payments', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('courseIds', 'title thumbnail')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
});

// @route   GET /api/payments/all
// @desc    Get all payments (Admin)
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('courseIds', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    // Get stats
    const stats = {
      pending: await Payment.countDocuments({ status: 'pending' }),
      verified: await Payment.countDocuments({ status: 'verified' }),
      rejected: await Payment.countDocuments({ status: 'rejected' }),
      totalRevenue: await Payment.aggregate([
        { $match: { status: 'verified' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0)
    };

    res.json({
      success: true,
      payments,
      stats,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
});

// @route   PUT /api/payments/:id/verify
// @desc    Verify payment (Admin)
// @access  Admin
router.put('/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Update payment status
    payment.status = 'verified';
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    await payment.save();

    // Unlock courses for user
    const user = await User.findById(payment.userId);
    for (const courseId of payment.courseIds) {
      const enrollment = user.enrolledCourses.find(
        e => e.courseId.toString() === courseId.toString()
      );
      if (enrollment) {
        enrollment.isUnlocked = true;
        enrollment.paymentStatus = 'verified';
      }

      // Increment enrollment count
      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrollmentCount: 1 }
      });
    }
    await user.save();

    res.json({
      success: true,
      message: 'Payment verified successfully. Courses unlocked for user.',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// @route   PUT /api/payments/:id/reject
// @desc    Reject payment (Admin)
// @access  Admin
router.put('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Update payment status
    payment.status = 'rejected';
    payment.rejectionReason = reason;
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    await payment.save();

    // Update user's enrollment status
    const user = await User.findById(payment.userId);
    for (const courseId of payment.courseIds) {
      const enrollment = user.enrolledCourses.find(
        e => e.courseId.toString() === courseId.toString()
      );
      if (enrollment) {
        enrollment.paymentStatus = 'rejected';
      }
    }
    await user.save();

    res.json({
      success: true,
      message: 'Payment rejected',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject payment',
      error: error.message
    });
  }
});

// @route   GET /api/payments/calculate
// @desc    Calculate cart total with discounts
// @access  Public
router.post('/calculate', async (req, res) => {
  try {
    const { courseIds } = req.body;

    const courses = await Course.find({ _id: { $in: courseIds } });
    const settings = await Settings.findOne();
    
    const subtotal = courses.reduce((sum, c) => sum + c.price, 0);
    
    const bundleDiscount = settings.bundleDiscounts.find(
      b => b.courseCount === courseIds.length
    );
    let discountPercent = bundleDiscount?.discountPercent || 0;
    
    // Apply festival discount if higher and active
    if (settings.festivalDiscount.enabled && 
        new Date(settings.festivalDiscount.endDate) > new Date()) {
      discountPercent = Math.max(discountPercent, settings.festivalDiscount.percent);
    }
    
    const discount = (subtotal * discountPercent) / 100;
    const total = subtotal - discount;

    res.json({
      success: true,
      subtotal,
      discountPercent,
      discount,
      total,
      festivalDiscount: settings.festivalDiscount.enabled ? settings.festivalDiscount : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate total',
      error: error.message
    });
  }
});

module.exports = router;
