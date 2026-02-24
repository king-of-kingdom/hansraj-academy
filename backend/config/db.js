const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hansraj_academy');
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes
    await createIndexes();
    
    // Create default admin if not exists
    await createDefaultAdmin();
    
    // Create default settings if not exists
    await createDefaultSettings();
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  // Indexes will be created automatically by Mongoose schemas
  console.log('📋 Database indexes ready');
};

const createDefaultAdmin = async () => {
  const User = require('../models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@hansraj.com' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
      
      await User.create({
        name: process.env.ADMIN_NAME || 'Amit Sir',
        email: process.env.ADMIN_EMAIL || 'admin@hansraj.com',
        password: hashedPassword,
        phone: process.env.WHATSAPP_NUMBER || '+91 79034 21482',
        role: 'admin',
        referralCode: 'ADMIN',
        isEmailVerified: true
      });
      
      console.log('👤 Default admin account created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

const createDefaultSettings = async () => {
  const Settings = require('../models/Settings');
  
  try {
    const settingsExist = await Settings.findOne();
    
    if (!settingsExist) {
      await Settings.create({
        siteName: 'Hansraj Academy',
        tagline: 'Learn Here Earn Anytime Anywhere',
        upiId: process.env.UPI_ID || 'hansrajeducations@upi',
        phoneNumber: process.env.PHONE_NUMBER || '+91 79034 21482',
        email: 'hansrajeducations@gmail.com',
        address: 'Hansrajpur Ekma, Saran (Bihar)',
        bundleDiscounts: [
          { courseCount: 1, discountPercent: 10 },
          { courseCount: 2, discountPercent: 20 },
          { courseCount: 3, discountPercent: 30 },
          { courseCount: 4, discountPercent: 40 },
          { courseCount: 5, discountPercent: 50 },
          { courseCount: 6, discountPercent: 60 }
        ],
        festivalDiscount: {
          enabled: false,
          name: 'New Year Sale',
          percent: 25,
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        socialLinks: {
          youtube: 'https://www.youtube.com/@TheHansrajAcademy',
          facebook: 'https://www.facebook.com/',
          instagram: 'https://www.instagram.com/',
          linkedin: 'https://www.linkedin.com/',
          twitter: 'https://x.com/'
        }
      });
      
      console.log('⚙️ Default settings created');
    }
  } catch (error) {
    console.error('Error creating default settings:', error.message);
  }
};

module.exports = connectDB;
