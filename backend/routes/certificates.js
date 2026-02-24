const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/certificates/my
// @desc    Get user's certificates
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail')
      .sort({ issuedAt: -1 });

    res.json({
      success: true,
      certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/verify/:certId
// @desc    Verify certificate by ID
// @access  Public
router.get('/verify/:certId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certId 
    }).populate('courseId', 'title');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid'
      });
    }

    res.json({
      success: true,
      certificate: {
        certificateId: certificate.certificateId,
        userName: certificate.userName,
        courseName: certificate.courseName,
        score: certificate.score,
        issuedAt: certificate.issuedAt,
        isValid: certificate.isValid
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/all
// @desc    Get all certificates (Admin)
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const certificates = await Certificate.find()
      .populate('courseId', 'title')
      .populate('userId', 'name email')
      .sort({ issuedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments();

    res.json({
      success: true,
      certificates,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
});

// @route   PUT /api/certificates/:id/revoke
// @desc    Revoke certificate (Admin)
// @access  Admin
router.put('/:id/revoke', protect, adminOnly, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { isValid: false },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      message: 'Certificate revoked',
      certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to revoke certificate',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/stats
// @desc    Get certificate stats (Admin)
// @access  Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalCertificates = await Certificate.countDocuments();
    const validCertificates = await Certificate.countDocuments({ isValid: true });
    
    const courseWiseStats = await Certificate.aggregate([
      {
        $group: {
          _id: '$courseId',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseTitle: '$course.title',
          count: 1,
          avgScore: { $round: ['$avgScore', 1] }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalCertificates,
        validCertificates,
        revokedCertificates: totalCertificates - validCertificates,
        courseWiseStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate stats',
      error: error.message
    });
  }
});

module.exports = router;
