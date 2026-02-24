# 🚀 Hansraj Academy - Complete Deployment Guide

## ✅ Your Website is Ready!

Frontend and Backend both are **complete and connected**. Follow this guide to publish your website.

---

## 📋 Pre-requisites

1. **GitHub Account** - Free at https://github.com
2. **MongoDB Atlas Account** - Free at https://mongodb.com/atlas
3. **Railway or Render Account** - Free at https://railway.app or https://render.com
4. **Vercel Account** - Free at https://vercel.com

---

## 📦 Step 1: Push Code to GitHub

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `hansraj-academy`
3. Keep it Public or Private
4. Click "Create repository"

### Upload Your Code

**Option A: Using GitHub Web (Easiest)**
1. Download your project files
2. On GitHub repo page, click "uploading an existing file"
3. Drag and drop all files
4. Click "Commit changes"

**Option B: Using Git Command Line**
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hansraj-academy.git
git push -u origin main
```

---

## 🗄️ Step 2: Setup MongoDB Atlas (Free Database)

1. **Go to** https://mongodb.com/atlas
2. **Create free account** (use Google login)
3. **Create a cluster:**
   - Choose FREE tier (M0 Sandbox)
   - Select region nearest to India (Mumbai)
   - Click "Create Cluster"

4. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `hansrajadmin`
   - Password: Create strong password (save it!)
   - Click "Add User"

5. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String:**
   - Go to "Database" > "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `myFirstDatabase` with `hansraj_academy`

Your MongoDB URI will look like:
```
mongodb+srv://hansrajadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hansraj_academy?retryWrites=true&w=majority
```

---

## 🖥️ Step 3: Deploy Backend (API Server)

### Option A: Deploy on Railway (Recommended)

1. **Go to** https://railway.app
2. **Login with GitHub**
3. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

4. **Add Environment Variables:**
   Click on your service > Variables > Add these:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://hansrajadmin:PASSWORD@cluster0.xxxxx.mongodb.net/hansraj_academy
   JWT_SECRET=your_super_secret_key_minimum_32_characters_long
   ADMIN_EMAIL=admin@hansraj.com
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Copy your API URL (e.g., `https://hansraj-api.up.railway.app`)

### Option B: Deploy on Render (Free)

1. **Go to** https://render.com
2. **Login with GitHub**
3. **Create Web Service:**
   - Click "New" > "Web Service"
   - Connect your GitHub repo
   - Name: `hansraj-academy-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables:**
   Same as Railway (see above)

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy your API URL

---

## 🌐 Step 4: Deploy Frontend

### Deploy on Vercel (Recommended)

1. **Go to** https://vercel.com
2. **Login with GitHub**
3. **Import Project:**
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Click "Import"

4. **Configure Build:**
   - Framework Preset: Vite
   - Root Directory: `.` (leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

6. **Deploy:**
   - Click "Deploy"
   - Wait for deployment
   - Your site is live! 🎉

---

## 🔗 Step 5: Connect Frontend & Backend

After both are deployed:

1. **Update Backend CORS:**
   - In Railway/Render, update `FRONTEND_URL` environment variable
   - Set it to your Vercel URL (e.g., `https://hansraj-academy.vercel.app`)
   - Redeploy backend

2. **Update Frontend API URL:**
   - In Vercel, add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Redeploy frontend

---

## ✅ Step 6: Verify Everything Works

1. **Check API Health:**
   - Visit: `https://your-backend-url.railway.app/api/health`
   - Should show: `{"status":"OK","message":"Hansraj Academy API is running!"}`

2. **Check Frontend:**
   - Visit your Vercel URL
   - Try login with admin credentials

3. **Test Admin Panel:**
   - Login: `admin@hansraj.com` / `admin123`
   - Go to Admin Panel
   - Try adding a course

4. **Test Student Flow:**
   - Register as new student
   - Browse courses
   - Watch free videos

---

## 🔧 Troubleshooting

### "MongoDB Connection Error"
- Check MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Check password doesn't have special characters

### "CORS Error"
- Update FRONTEND_URL in backend environment
- Make sure it matches exactly (no trailing slash)

### "API Not Found"
- Check VITE_API_URL in frontend environment
- Include `/api` at the end

### "Login Not Working"
- Check JWT_SECRET is set
- Check MongoDB is connected
- Check admin account exists

---

## 📱 Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as shown

### On Railway:
1. Go to Settings > Domains
2. Add custom domain
3. Update DNS records

---

## 💰 Cost Summary

| Service | Free Tier | Notes |
|---------|-----------|-------|
| MongoDB Atlas | 512MB | Enough for 10,000+ users |
| Railway | $5 credit/month | Usually free |
| Vercel | Unlimited | Free for personal use |
| **Total** | **FREE** | For starting out |

---

## 🔐 Security Checklist

Before going live:

- [ ] Change admin password from `admin123`
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Test all features
- [ ] Backup MongoDB regularly

---

## 📞 Need Help?

- **WhatsApp:** +91 79034 21482
- **Email:** hansrajeducations@gmail.com
- **YouTube:** https://www.youtube.com/@TheHansrajAcademy

---

## 🎉 Congratulations!

Your **Hansraj Academy** website is now LIVE and ready for students!

### What You Can Do Now:

1. ✅ Add real courses from Admin Panel
2. ✅ Upload videos to YouTube (Public/Unlisted)
3. ✅ Set your UPI QR code for payments
4. ✅ Share with students
5. ✅ Verify payments and unlock courses
6. ✅ Create daily quizzes
7. ✅ Schedule live classes

---

**Good Luck! 🚀**

Made with ❤️ for Hansraj Academy
