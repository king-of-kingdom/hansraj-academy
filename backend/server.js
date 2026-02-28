const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const User = require('./models/User');
    const Settings = require('./models/Settings');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@hansraj.com' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Amit Sir (Admin)',
        email: 'admin@hansraj.com',
        phone: '+91 79034 21482',
        password: hashedPassword,
        role: 'admin',
        referralCode: 'ADMIN2024'
      });
      
      console.log('✅ Default admin user created');
      console.log('   Email: admin@hansraj.com');
      console.log('   Password: admin123');
    }
    
    // Create default settings if not exists
    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      await Settings.create({
        upiId: 'hansrajeducations@upi',
        upiQrCode: '',
        phoneNumber: '+91 79034 21482',
        bundleDiscounts: {
          1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60
        },
        festivalOffer: {
          enabled: false,
          discountPercentage: 20,
          endDate: new Date()
        }
      });
      console.log('✅ Default settings created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

// Connect to MongoDB and create admin
connectDB().then(() => {
  createDefaultAdmin();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://hansraj-academy.vercel.app', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/daily-quiz', require('./routes/dailyQuiz'));
app.use('/api/live-classes', require('./routes/liveClasses'));
app.use('/api/discussions', require('./routes/discussions'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/settings', require('./routes/settings'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hansraj Academy API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ========================================
    🚀 Hansraj Academy Backend Server
  ========================================
    Environment: ${process.env.NODE_ENV || 'development'}
    Port: ${PORT}
    API URL: http://localhost:${PORT}/api
  ========================================
  `);
});
