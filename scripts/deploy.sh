#!/bin/bash

# 🚀 Ribbon Calculator Deployment Script for Render
# This script helps automate the deployment process

echo "🎀 Ribbon Calculator - Render Deployment"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not found. Please initialize git first."
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes."
    echo "   Please commit your changes before deploying:"
    echo "   git add . && git commit -m 'Your commit message'"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Pre-deployment checks passed!"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push to GitHub. Please check your git configuration."
    exit 1
fi

echo ""
echo "🎉 Deployment files are ready!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create a new PostgreSQL database"
echo "3. Create a new Web Service"
echo "4. Connect your GitHub repository: aminhaidar/craftcalculator"
echo "5. Use the configuration from render.yaml"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔗 Your repository: https://github.com/aminhaidar/craftcalculator"
echo "📚 Deployment guide: DEPLOYMENT.md"
echo ""
echo "✨ Happy deploying!" 