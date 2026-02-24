# 🚀 Hansraj Academy - Step by Step Publishing Guide

## Complete Guide to Publish Your Website (FREE)

---

## 📋 Overview - What We Will Do

| Step | Platform | Purpose | Time |
|------|----------|---------|------|
| 1 | GitHub | Store your code | 10 min |
| 2 | MongoDB Atlas | Database (store data) | 10 min |
| 3 | Render | Host Backend API | 10 min |
| 4 | Vercel | Host Frontend Website | 5 min |

**Total Time: ~35 minutes**
**Total Cost: ₹0 (FREE)**

---

# STEP 1: GitHub Setup 🐙

## 1.1 Create GitHub Account (Skip if already have)

1. Go to: **https://github.com**
2. Click **"Sign up"** (top right)
3. Enter:
   - Email address
   - Create password
   - Choose username
4. Verify email
5. Done! ✅

## 1.2 Download & Install Git

1. Go to: **https://git-scm.com/downloads**
2. Download for your OS (Windows/Mac/Linux)
3. Install with default settings
4. Done! ✅

## 1.3 Download & Install VS Code

1. Go to: **https://code.visualstudio.com**
2. Download for your OS
3. Install
4. Done! ✅

## 1.4 Download Project Files

You need to download your project files. If you're using this in a web editor:
1. Download/Export all files as ZIP
2. Extract to a folder like `C:\hansraj-academy` or `~/hansraj-academy`

## 1.5 Open Project in VS Code

1. Open VS Code
2. Click **File → Open Folder**
3. Select your project folder (`hansraj-academy`)
4. Done! ✅

## 1.6 Create GitHub Repository

### Method A: Using GitHub Website

1. Go to: **https://github.com/new**
2. Fill details:
   - Repository name: `hansraj-academy`
   - Description: `Hansraj Academy - Online Learning Platform`
   - Select: **Public**
   - DON'T check "Add README" (we already have)
3. Click **"Create repository"**
4. You'll see a page with instructions - keep it open

### Method B: Push Code to GitHub

1. Open **Terminal** in VS Code (View → Terminal)
2. Run these commands one by one:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Hansraj Academy"

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hansraj-academy.git

# Push to GitHub
git branch -M main
git push -u origin main
```

3. Enter GitHub username and password when asked
   - Note: For password, use **Personal Access Token** (not your actual password)

## 1.7 Create Personal Access Token (for pushing code)

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token (classic)"**
3. Give it a name: `hansraj-academy`
4. Select scopes: Check **"repo"** (full control)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as password when pushing

## 1.8 Verify Upload

1. Go to: `https://github.com/YOUR_USERNAME/hansraj-academy`
2. You should see all your files
3. Done! ✅

---

# STEP 2: MongoDB Atlas Setup 🍃

## 2.1 Create MongoDB Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Google account (easiest), OR
   - Email and password
3. Done! ✅

## 2.2 Create Free Cluster

1. After login, click **"Build a Database"**
2. Select **"M0 FREE"** (Shared - Free Forever)
3. Choose cloud provider: **AWS**
4. Choose region: **Mumbai (ap-south-1)** or nearest to you
5. Cluster name: `hansraj-academy` (or keep default)
6. Click **"Create"**
7. Wait 2-3 minutes for cluster to create
8. Done! ✅

## 2.3 Create Database User

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Enter:
   - Username: `hansrajadmin`
   - Password: `YourSecurePassword123` (use strong password!)
5. Database User Privileges: **"Read and write to any database"**
6. Click **"Add User"**
7. Done! ✅

## 2.4 Allow Network Access

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**
5. Done! ✅

## 2.5 Get Connection String

1. In left sidebar, click **"Database"**
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string. It looks like:
   ```
   mongodb+srv://hansrajadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before `?`:
   ```
   mongodb+srv://hansrajadmin:YourSecurePassword123@cluster0.xxxxx.mongodb.net/hansraj_academy?retryWrites=true&w=majority
   ```
8. **SAVE THIS STRING** - we need it later!
9. Done! ✅

---

# STEP 3: Deploy Backend on Render 🚀

## 3.1 Create Render Account

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest - click "GitHub" button)
4. Authorize Render to access your GitHub
5. Done! ✅

## 3.2 Create Backend Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Find `hansraj-academy` and click **"Connect"**
4. Fill details:
   - **Name:** `hansraj-academy-api`
   - **Region:** Singapore or nearest
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Select **"Free"** instance type
6. Done! ✅

## 3.3 Add Environment Variables

1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string from Step 2.5 |
| `JWT_SECRET` | `hansraj_academy_super_secret_key_2024` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

4. Click **"Create Web Service"**
5. Wait 5-10 minutes for deployment
6. Done! ✅

## 3.4 Get Backend URL

1. After deployment, you'll see your URL:
   ```
   https://hansraj-academy-api.onrender.com
   ```
2. **SAVE THIS URL** - we need it for frontend!
3. Test it: Open `https://your-url.onrender.com/api/courses`
4. You should see: `[]` or list of courses
5. Done! ✅

---

# STEP 4: Deploy Frontend on Vercel 🌐

## 4.1 Create Vercel Account

1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Select **"Continue with GitHub"**
4. Authorize Vercel
5. Done! ✅

## 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find `hansraj-academy` repository
3. Click **"Import"**
4. Done! ✅

## 4.3 Configure Project

1. **Framework Preset:** Vite
2. **Root Directory:** `./` (leave as is)
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Done! ✅

## 4.4 Add Environment Variable

1. Expand **"Environment Variables"**
2. Add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://hansraj-academy-api.onrender.com` |

(Use your actual Render backend URL from Step 3.4)

3. Done! ✅

## 4.5 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get URL like: `https://hansraj-academy.vercel.app`
4. Done! ✅

---

# STEP 5: Final Setup & Testing 🧪

## 5.1 Create Admin Account

1. Open your frontend URL
2. Click **"Sign Up"** / **"Register"**
3. Create account with:
   - Name: Amit Sir
   - Email: `admin@hansraj.com`
   - Password: `admin123`
   - Phone: `+91 79034 21482`

## 5.2 Make Yourself Admin (Database)

1. Go to MongoDB Atlas
2. Click **"Database"** → **"Browse Collections"**
3. Find `users` collection
4. Find your user
5. Click **"Edit"**
6. Change `"role": "student"` to `"role": "admin"`
7. Click **"Update"**
8. Done! ✅

## 5.3 Test Everything

### Test Admin Panel:
1. Login with admin account
2. Go to `/admin`
3. Try adding a course
4. Try adding quiz questions

### Test Student Flow:
1. Register new student account
2. Browse courses
3. Try payment flow
4. Take quiz

### Test Features:
- [ ] Course listing works
- [ ] Video player works
- [ ] Payment page shows QR
- [ ] Admin can verify payments
- [ ] Quiz works
- [ ] Daily quiz works
- [ ] Live class scheduling works

---

# 🎉 CONGRATULATIONS!

Your website is now LIVE at:
- **Frontend:** `https://hansraj-academy.vercel.app`
- **Backend:** `https://hansraj-academy-api.onrender.com`

---

# 📝 Important Notes

## Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain (e.g., `hansrajacademy.com`)
3. Update DNS records as shown

### For Render (Backend):
1. Go to Service Settings → Custom Domains
2. Add subdomain (e.g., `api.hansrajacademy.com`)

## Keeping Backend Active

Free Render services sleep after 15 min of inactivity. To keep it active:
1. Use https://uptimerobot.com (free)
2. Add monitor for your backend URL
3. Set interval: 14 minutes

## Updating Website

When you make changes:
1. Make changes in VS Code
2. Run:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel & Render will auto-deploy!

---

# 🆘 Troubleshooting

## Backend not working?
- Check Render logs for errors
- Verify MongoDB URI is correct
- Make sure all env variables are set

## Frontend not connecting to backend?
- Check VITE_API_URL is correct
- Make sure backend is running
- Check browser console for errors

## Database connection failed?
- Verify MongoDB password is correct
- Check Network Access allows 0.0.0.0/0
- Make sure cluster is running

---

# 📞 Need Help?

If you face any issues:
1. Check error messages in browser console (F12)
2. Check Render logs for backend errors
3. Check Vercel logs for frontend errors

Good luck! 🚀
