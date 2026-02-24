const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get public settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }

    // Return only public settings
    res.json({
      success: true,
      settings: {
        siteName: settings.siteName,
        tagline: settings.tagline,
        logo: settings.logo,
        upiId: settings.upiId,
        qrCodeImage: settings.qrCodeImage,
        phoneNumber: settings.phoneNumber,
        email: settings.email,
        address: settings.address,
        bundleDiscounts: settings.bundleDiscounts,
        festivalDiscount: settings.festivalDiscount,
        socialLinks: settings.socialLinks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
});

// @route   GET /api/settings/admin
// @desc    Get all settings (Admin)
// @access  Admin
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
});

// @route   PUT /api/settings
// @desc    Update settings (Admin)
// @access  Admin
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true }
      );
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
});

// @route   PUT /api/settings/bundle-discounts
// @desc    Update bundle discounts (Admin)
// @access  Admin
router.put('/bundle-discounts', protect, adminOnly, async (req, res) => {
  try {
    const { bundleDiscounts } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ bundleDiscounts });
    } else {
      settings.bundleDiscounts = bundleDiscounts;
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Bundle discounts updated',
      bundleDiscounts: settings.bundleDiscounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update bundle discounts',
      error: error.message
    });
  }
});

// @route   PUT /api/settings/festival-discount
// @desc    Update festival discount (Admin)
// @access  Admin
router.put('/festival-discount', protect, adminOnly, async (req, res) => {
  try {
    const { enabled, name, percent, endDate } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        festivalDiscount: { enabled, name, percent, endDate }
      });
    } else {
      settings.festivalDiscount = { enabled, name, percent, endDate };
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Festival discount updated',
      festivalDiscount: settings.festivalDiscount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update festival discount',
      error: error.message
    });
  }
});

// @route   PUT /api/settings/payment
// @desc    Update payment settings (Admin)
// @access  Admin
router.put('/payment', protect, adminOnly, async (req, res) => {
  try {
    const { upiId, qrCodeImage, phoneNumber } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ upiId, qrCodeImage, phoneNumber });
    } else {
      settings.upiId = upiId || settings.upiId;
      settings.qrCodeImage = qrCodeImage || settings.qrCodeImage;
      settings.phoneNumber = phoneNumber || settings.phoneNumber;
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Payment settings updated',
      settings: {
        upiId: settings.upiId,
        qrCodeImage: settings.qrCodeImage,
        phoneNumber: settings.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update payment settings',
      error: error.message
    });
  }
});

// @route   PUT /api/settings/social-links
// @desc    Update social links (Admin)
// @access  Admin
router.put('/social-links', protect, adminOnly, async (req, res) => {
  try {
    const { socialLinks } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ socialLinks });
    } else {
      settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Social links updated',
      socialLinks: settings.socialLinks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update social links',
      error: error.message
    });
  }
});

module.exports = router;
