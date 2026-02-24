# 🎓 Hansraj Academy - Complete Learning Platform

**Learn Here, Earn Anytime Anywhere**

A full-stack educational platform for online courses with student dashboard, admin panel, video streaming, quiz system, and payment management.

![Hansraj Academy](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop)

---

## ✨ Features

### 🎯 For Students
- ✅ First 2-3 videos free in every course
- ✅ HD video lessons in Hindi
- ✅ First 2-3 videos free per course
- ✅ Progress tracking
- ✅ Quiz & certification system
- ✅ Live classes support
- ✅ Discussion forum
- ✅ Certificate on passing test
- ✅ Referral program
- ✅ WhatsApp support

### 👨‍💼 For Admin
- ✅ Course management (Add/Edit/Delete)
- ✅ Video management
- ✅ Payment verification (UPI QR)
- ✅ Student management
- ✅ Live class scheduling
- ✅ Quiz management
- ✅ Bundle discount settings
- ✅ Festival discount toggle
- ✅ Analytics dashboard

### 💰 Payment System
- ✅ UPI QR Code payment
- ✅ Transaction ID verification
- ✅ Bundle discounts (1-6 courses = 10-60% OFF)
- ✅ Festival discount support
- ✅ Manual admin verification

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite** - Build Tool
- **TypeScript** - Type Safety
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt.js** - Password Hashing

---

## 🚀 Quick Start

### Frontend Only (Demo Mode)

The frontend works standalone with localStorage for demo:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### With Backend (Full Production)

1. **Start Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

2. **Start Frontend:**
```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
hansraj-academy/
├── src/                    # Frontend source
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── context/            # React Context
│   ├── types/              # TypeScript types
│   ├── data/               # Initial data
│   └── utils/              # Utility functions
├── backend/                # Backend API
│   ├── config/             # Database config
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── server.js           # Entry point
├── index.html
├── package.json
└── README.md
```

---

## 🔐 Login Credentials

### Admin Panel
- **Email:** admin@hansraj.com
- **Password:** admin123

### Student
Register as new user to test student features.

---

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/courses` | All courses |
| `/course/:id` | Course details |
| `/cart` | Shopping cart |
| `/login` | Login page |
| `/register` | Registration |
| `/dashboard` | Student dashboard |
| `/admin` | Admin panel |
| `/watch/:courseId/:videoId` | Video player |
| `/quiz/:courseId` | Quiz page |
| `/about` | About page |
| `/contact` | Contact page |

---

## 🎨 Courses Included

1. **MS Excel** - Basic to Advanced
2. **MS Word** - Document Mastery
3. **MS PowerPoint** - Presentations
4. **Adobe Photoshop** - Photo Editing
5. **Python Programming** - Coding
6. **HTML Mastery** - Web Basics
7. **CSS Mastery** - Styling
8. **Computer Hardware** - Repair

---

## 💳 Payment Flow

1. Student selects courses
2. Adds to cart (bundle discount applied)
3. Proceeds to payment
4. Scans UPI QR code
5. Pays via GPay/PhonePe/Paytm
6. Enters Transaction ID (UTR)
7. Admin verifies payment
8. Courses unlocked for student

---

## 🌐 Deployment

### Frontend Deployment

**Vercel (Recommended):**
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy on push

**Netlify:**
1. Build: `npm run build`
2. Publish: `dist` folder

### Backend Deployment

**Railway:**
1. Connect GitHub
2. Add MongoDB plugin
3. Set environment variables
4. Deploy

**Render:**
1. Create Web Service
2. Connect repository
3. Build: `npm install`
4. Start: `npm start`

See `backend/README.md` for detailed deployment instructions.

---

## 📞 Contact

**Hansraj Academy**
- 📧 Email: hansrajeducations@gmail.com
- 📱 WhatsApp: +91 79034 21482
- 📍 Address: Hansrajpur Ekma, Saran (Bihar)
- 🎥 YouTube: [@TheHansrajAcademy](https://www.youtube.com/@TheHansrajAcademy)

---

## 📄 License

© 2024 Hansraj Academy. All rights reserved.

A Unit of Hansraj Edutech Pvt. Ltd.

---

Made with ❤️ by Amit Sir
