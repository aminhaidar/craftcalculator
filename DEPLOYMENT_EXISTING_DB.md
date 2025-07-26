# Deployment Guide - Using Existing PostgreSQL Database

## Overview
This guide explains how to deploy the ribbon calculator app using your existing PostgreSQL database on Render instead of creating a new one.

## Prerequisites
- Existing PostgreSQL database on Render (already set up)
- Git repository with the ribbon calculator code

## Database Configuration

### Your Existing Database Details
- **Database Name**: `craftprofitoptimizer`
- **Username**: `craftprofitoptimizer_user`
- **Host**: `dpg-d22gsae3jp1c738tmkrg-a.oregon-postgres.render.com`
- **Port**: `5432`
- **Connection String**: `postgresql://craftprofitoptimizer_user:b8r0V9NvfvYsyBuekNmKCLjQJwsFWAGm@dpg-d22gsae3jp1c738tmkrg-a.oregon-postgres.render.com/craftprofitoptimizer`

## Deployment Steps

### 1. Update Environment Variables
The `render.yaml` file has been updated to use your existing database connection string instead of creating a new database.

### 2. Deploy to Render

#### Option A: Using Render Dashboard
1. Go to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `ribbon-calculator`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Option B: Using Blueprint (Recommended)
1. Push your code to GitHub
2. In Render dashboard, click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Review the configuration and deploy

### 3. Environment Variables
The following environment variables will be automatically set:
- `DATABASE_URL`: Your existing PostgreSQL connection string
- `NODE_ENV`: `production`
- `NEXTAUTH_SECRET`: Auto-generated
- `NEXTAUTH_URL`: `https://ribbon-calculator.onrender.com`

### 4. Database Migration
After deployment, you may need to run database migrations:

```bash
# Connect to your Render service and run:
npm run db:deploy
```

Or manually run:
```bash
npx prisma db push
```

## Important Notes

### Database Schema
- The app will use your existing `craftprofitoptimizer` database
- New tables will be created for ribbons, bows, and recipes
- Existing data in your database will be preserved

### Security
- The database connection string is stored securely in Render environment variables
- The connection uses SSL by default
- Access is restricted to Render services

### Monitoring
- Monitor your database usage in the Render dashboard
- Check the service logs for any database connection issues
- The free PostgreSQL plan has limitations (90 days, 1GB storage)

## Troubleshooting

### Database Connection Issues
1. Verify the connection string is correct
2. Check that your database is running
3. Ensure the database user has proper permissions
4. Check service logs for connection errors

### Migration Issues
1. Run `npx prisma generate` to ensure Prisma client is up to date
2. Check if database schema conflicts exist
3. Verify database user has CREATE TABLE permissions

### Performance
- Monitor database query performance
- Consider upgrading to a paid plan for better performance
- Use database indexes for better query performance

## Next Steps
1. Deploy the application
2. Test the database connection
3. Run migrations if needed
4. Verify all features work correctly
5. Monitor performance and usage

## Support
If you encounter issues:
1. Check Render service logs
2. Verify database connectivity
3. Review Prisma migration logs
4. Contact Render support if needed 