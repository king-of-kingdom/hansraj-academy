const mongoose = require('mongoose');

const bundleDiscountSchema = new mongoose.Schema({
  courseCount: {
    type: Number,
    required: true
  },
  discountPercent: {
    type: Number,
    required: true
  }
});

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Hansraj Academy'
  },
  tagline: {
    type: String,
    default: 'Learn Here Earn Anytime Anywhere'
  },
  logo: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    default: 'hansrajeducations@upi'
  },
  qrCodeImage: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: '+91 79034 21482'
  },
  email: {
    type: String,
    default: 'hansrajeducations@gmail.com'
  },
  address: {
    type: String,
    default: 'Hansrajpur Ekma, Saran (Bihar)'
  },
  bundleDiscounts: [bundleDiscountSchema],
  festivalDiscount: {
    enabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'Festival Sale'
    },
    percent: {
      type: Number,
      default: 25
    },
    endDate: {
      type: Date
    }
  },
  socialLinks: {
    youtube: {
      type: String,
      default: 'https://www.youtube.com/@TheHansrajAcademy'
    },
    facebook: {
      type: String,
      default: 'https://www.facebook.com/'
    },
    instagram: {
      type: String,
      default: 'https://www.instagram.com/'
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/'
    },
    twitter: {
      type: String,
      default: 'https://x.com/'
    }
  },
  aboutContent: {
    type: String,
    default: ''
  },
  termsAndConditions: {
    type: String,
    default: ''
  },
  privacyPolicy: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
