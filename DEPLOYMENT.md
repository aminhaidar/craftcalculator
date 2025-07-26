# 🚀 Deployment Guide - Render

This guide will help you deploy the Ribbon Calculator to Render with a PostgreSQL database.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Database**: We'll create a PostgreSQL database on Render

## 🗄️ Step 1: Create PostgreSQL Database

1. **Log into Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Sign in with your account

2. **Create New Database**
   - Click "New +" button
   - Select "PostgreSQL"
   - Choose "Free" plan
   - Name: `ribbon-calculator-db`
   - Database: `ribbon_calculator`
   - User: `ribbon_calculator_user`
   - Click "Create Database"

3. **Save Database Details**
   - Copy the "External Database URL"
   - Save it for the next step

## 🌐 Step 2: Deploy Web Service

1. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository: `aminhaidar/craftcalculator`

2. **Configure Service**
   - **Name**: `ribbon-calculator`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add these environment variables:
   ```
   DATABASE_URL = [Your PostgreSQL URL from Step 1]
   NODE_ENV = production
   NEXTAUTH_SECRET = [Generate a random string]
   NEXTAUTH_URL = https://your-app-name.onrender.com
   ```

4. **Advanced Settings**
   - **Auto-Deploy**: Yes
   - **Health Check Path**: `/`
   - **Health Check Timeout**: 180

5. **Click "Create Web Service"**

## 🔧 Step 3: Database Setup

1. **Wait for First Deployment**
   - The service will build and deploy
   - This may take 5-10 minutes

2. **Run Database Migrations**
   - Go to your web service dashboard
   - Click "Shell" tab
   - Run these commands:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Verify Database**
   - Check the logs to ensure no errors
   - The seed script should create sample data

## ✅ Step 4: Verify Deployment

1. **Check Application**
   - Visit your app URL: `https://your-app-name.onrender.com`
   - Verify all pages load correctly
   - Test creating a recipe and adding ribbons

2. **Check Database**
   - Go to your database dashboard
   - Verify tables are created
   - Check that sample data exists

## 🔄 Step 5: Continuous Deployment

- **Automatic Deploys**: Enabled by default
- **Manual Deploys**: Available from dashboard
- **Rollback**: Can revert to previous versions

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   - Check build logs for errors
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check database is running
   - Ensure IP allowlist includes Render

3. **Application Errors**
   - Check application logs
   - Verify environment variables
   - Test locally first

### Useful Commands

```bash
# Check application status
curl https://your-app-name.onrender.com

# View logs
# Use Render dashboard logs section

# Restart service
# Use Render dashboard restart button
```

## 📊 Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: CPU, memory, and response times
- **Health Checks**: Automatic monitoring
- **Alerts**: Configure for downtime

## 🔒 Security

- **HTTPS**: Automatically enabled
- **Environment Variables**: Securely stored
- **Database**: Isolated and secure
- **Updates**: Automatic security patches

## 💰 Costs

- **Free Tier**: $0/month (with limitations)
- **Paid Plans**: Start at $7/month
- **Database**: Free tier available
- **Bandwidth**: Included in plan

## 🎉 Success!

Your Ribbon Calculator is now live and ready for your wife to use!

**App URL**: `https://your-app-name.onrender.com`

---

**Need Help?**
- Render Documentation: [docs.render.com](https://docs.render.com)
- GitHub Issues: [github.com/aminhaidar/craftcalculator/issues](https://github.com/aminhaidar/craftcalculator/issues) 