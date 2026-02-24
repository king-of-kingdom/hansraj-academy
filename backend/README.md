# Hansraj Academy - Backend API

Complete Node.js/Express backend for Hansraj Academy Learning Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn

### Installation Steps

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Edit .env file with your settings:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hansraj_academy
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@hansraj.com
ADMIN_PASSWORD=admin123
```

5. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

6. **Server will start at:** `http://localhost:5000`

---

## 📦 MongoDB Setup Options

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Use this in .env:
MONGODB_URI=mongodb://localhost:27017/hansraj_academy
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create a new cluster (free tier available)
4. Create database user
5. Get connection string
6. Use in .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hansraj_academy?retryWrites=true&w=majority
```

---

## 🔐 Default Admin Credentials

After first run, admin account is automatically created:
- **Email:** admin@hansraj.com
- **Password:** admin123

⚠️ **Change these in production!**

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get single course |
| POST | `/api/courses` | Create course (Admin) |
| PUT | `/api/courses/:id` | Update course (Admin) |
| DELETE | `/api/courses/:id` | Delete course (Admin) |
| POST | `/api/courses/:id/videos` | Add video (Admin) |
| PUT | `/api/courses/:id/progress` | Update progress |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/submit` | Submit payment |
| GET | `/api/payments/my-payments` | Get user's payments |
| GET | `/api/payments/all` | Get all payments (Admin) |
| PUT | `/api/payments/:id/verify` | Verify payment (Admin) |
| PUT | `/api/payments/:id/reject` | Reject payment (Admin) |
| POST | `/api/payments/calculate` | Calculate cart total |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz/course/:courseId` | Get quiz for course |
| POST | `/api/quiz/:quizId/submit` | Submit quiz answers |
| POST | `/api/quiz` | Create quiz (Admin) |
| PUT | `/api/quiz/:id` | Update quiz (Admin) |
| DELETE | `/api/quiz/:id` | Delete quiz (Admin) |

### Certificates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/certificates/my` | Get user's certificates |
| GET | `/api/certificates/verify/:certId` | Verify certificate |
| GET | `/api/certificates/all` | Get all certificates (Admin) |

### Live Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/live-classes` | Get upcoming classes |
| POST | `/api/live-classes` | Schedule class (Admin) |
| PUT | `/api/live-classes/:id` | Update class (Admin) |
| DELETE | `/api/live-classes/:id` | Delete class (Admin) |

### Discussions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/discussions/course/:courseId` | Get discussions |
| POST | `/api/discussions` | Create discussion |
| POST | `/api/discussions/:id/reply` | Add reply |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get public settings |
| GET | `/api/settings/admin` | Get all settings (Admin) |
| PUT | `/api/settings` | Update settings (Admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get dashboard stats |
| GET | `/api/admin/analytics` | Get detailed analytics |
| GET | `/api/users` | Get all users |

---

## 🌐 Deployment

### Deploy to Railway (Recommended)
1. Create account at https://railway.app
2. Connect GitHub repository
3. Add MongoDB plugin or use Atlas
4. Set environment variables
5. Deploy!

### Deploy to Render
1. Create account at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Build command: `npm install`
6. Start command: `npm start`

### Deploy to Heroku
```bash
heroku create hansraj-academy-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Deploy to VPS (DigitalOcean, AWS EC2, etc.)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd backend

# Install PM2 globally
npm install -g pm2

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name hansraj-api
pm2 save
pm2 startup
```

---

## 🔧 Frontend Configuration

Update frontend to use backend API:

Create `src/config/api.ts`:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Add to `.env` in frontend:
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## 📧 Email Notifications (Optional)

To enable email notifications:

1. Get Gmail App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Create new app password

2. Add to .env:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=hansrajeducations@gmail.com
EMAIL_PASS=your_app_password
```

---

## 📱 WhatsApp Integration (Optional)

For WhatsApp notifications, you can integrate:
- Twilio WhatsApp API
- WhatsApp Business API
- Third-party services like Interakt, Wati

---

## 🛡️ Security Recommendations for Production

1. Use strong JWT_SECRET (32+ characters)
2. Enable HTTPS
3. Set proper CORS origins
4. Use rate limiting
5. Implement input validation
6. Use helmet.js for security headers
7. Regular security updates

Add to server.js for production:
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

---

## 📞 Support

- **Email:** hansrajeducations@gmail.com
- **WhatsApp:** +91 79034 21482
- **YouTube:** https://www.youtube.com/@TheHansrajAcademy

---

Made with ❤️ by Hansraj Academy Team
