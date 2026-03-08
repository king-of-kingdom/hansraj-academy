const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Create default data
const createDefaultData = async () => {
  try {
    const User = require('./models/User');
    const Settings = require('./models/Settings');
    const Course = require('./models/Course');
    
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
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
      console.log('✅ Default settings created');
    }
    
    // Delete existing courses and recreate (temporary fix for corrupted data)
    await Course.deleteMany({});
    console.log('🗑️ Cleared existing courses');
    
    // Create default courses
    const courseCount = 0; // Force create
    if (courseCount === 0) {
      const defaultCourses = [
        {
          title: 'MS Excel - Basic to Advanced',
          description: 'Complete Excel course covering formulas, pivot tables, charts, macros, and data analysis. Perfect for students, job seekers, and professionals.',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
          category: 'MS Office',
          price: 499,
          originalPrice: 999,
          level: 'Beginner to Advanced',
          duration: '15+ Hours',
          instructor: 'Amit Sir',
          isPublished: true,
          enrollmentCount: 150,
          rating: 4.9,
          videos: [
            { title: 'Introduction to Excel', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '15:00', isFree: true, order: 1 },
            { title: 'Basic Formulas', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 2 },
            { title: 'Cell Formatting', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '18:00', isFree: true, order: 3 },
            { title: 'Advanced Formulas', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: false, order: 4 },
            { title: 'Pivot Tables', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '30:00', isFree: false, order: 5 }
          ]
        },
        {
          title: 'MS Word Complete Course',
          description: 'Master Microsoft Word from basics to advanced. Learn document formatting, mail merge, tables, and professional document creation.',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
          category: 'MS Office',
          price: 399,
          originalPrice: 799,
          level: 'Beginner',
          duration: '10+ Hours',
          instructor: 'Amit Sir',
          isPublished: true,
          enrollmentCount: 120,
          rating: 4.8,
          videos: [
            { title: 'Getting Started with Word', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '12:00', isFree: true, order: 1 },
            { title: 'Document Formatting', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '18:00', isFree: true, order: 2 },
            { title: 'Tables and Graphics', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '22:00', isFree: false, order: 3 }
          ]
        },
        {
          title: 'MS PowerPoint Mastery',
          description: 'Create stunning presentations with PowerPoint. Learn animations, transitions, design principles, and professional presentation skills.',
          thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
          category: 'MS Office',
          price: 349,
          originalPrice: 699,
          level: 'Beginner',
          duration: '8+ Hours',
          instructor: 'Amit Sir',
          isPublished: true,
          enrollmentCount: 90,
          rating: 4.7,
          videos: [
            { title: 'PowerPoint Basics', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '14:00', isFree: true, order: 1 },
            { title: 'Slide Design', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 2 },
            { title: 'Animations & Transitions', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: false, order: 3 }
          ]
        },
        {
          title: 'Adobe Photoshop for Beginners',
          description: 'Learn Photoshop from scratch. Photo editing, graphic design, manipulation, and creating stunning visuals for any purpose.',
          thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500',
          category: 'Graphics',
          price: 749,
          originalPrice: 1499,
          level: 'Beginner to Advanced',
          duration: '20+ Hours',
          instructor: 'Amit Sir',
          isPublished: true,
          enrollmentCount: 200,
          rating: 4.9,
          videos: [
            { title: 'Photoshop Interface', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '16:00', isFree: true, order: 1 },
            { title: 'Basic Tools', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '22:00', isFree: true, order: 2 },
            { title: 'Layers Explained', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 3 },
            { title: 'Photo Editing', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '28:00', isFree: false, order: 4 }
          ]
        },
        {
          title: 'Python Programming',
          description: 'Start your coding journey with Python. Learn programming fundamentals, data structures, and build real projects.',
          thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500',
          category: 'Programming',
          price: 999,
          originalPrice: 1999,
          level: 'Beginner to Advanced',
          duration: '25+ Hours',
          instructor: 'Amit Sir',
          isPublished: true,
          enrollmentCount: 180,
          rating: 4.9,
          videos: [
            { title: 'Why Learn Python', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '10:00', isFree: true, order: 1 },
            { title: 'Installing Python', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '12:00', isFree: true, order: 2 },
            { title: 'Variables & Data Types', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 3 },
            { title: 'Control Flow', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '30:00', isFree: false, order: 4 }
          ]
        },
        {
          title: 'HTML & CSS Mastery',
          description: 'Build beautiful websites from scratch. Learn HTML5, CSS3, responsive design, and modern web development techniques.',
          thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500',
          category: 'Web Development',
          price: 649,
          originalPrice: 1299,
          level: 'Beginner',
          duration: '18+ Hours',
          instructor: 'Amit Sir',
          isPublished: true,
          enrollmentCount: 160,
          rating: 4.8,
          videos: [
            { title: 'What is Web Development', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '8:00', isFree: true, order: 1 },
            { title: 'HTML Basics', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 2 },
            { title: 'CSS Introduction', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '22:00', isFree: true, order: 3 },
            { title: 'CSS Flexbox', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '28:00', isFree: false, order: 4 }
          ]
        },
        {
          title: 'Computer Hardware Basics',
          description: 'Understand computer hardware components, assembly, troubleshooting, and maintenance. Perfect for IT beginners.',
          thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
          category: 'Hardware',
          price: 449,
          originalPrice: 899,
          level: 'Beginner',
          duration: '12+ Hours',
          instructor: 'Amit Sir',
          isPublished: true,
          enrollmentCount: 80,
          rating: 4.7,
          videos: [
            { title: 'Computer Components', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '18:00', isFree: true, order: 1 },
            { title: 'CPU Explained', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '15:00', isFree: true, order: 2 },
            { title: 'RAM & Storage', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: false, order: 3 }
          ]
        }
      ];
      
      await Course.insertMany(defaultCourses);
      console.log('✅ Default courses created (7 courses)');
    }
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('Error creating default data:', error.message);
  }
};

// Connect to MongoDB and create default data
connectDB().then(() => {
  createDefaultData();
});

// Middleware - Allow all origins for now
app.use(cors({
  origin: true,
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
