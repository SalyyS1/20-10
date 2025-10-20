@echo off
echo 🎁 Setting up 20/10 Gift App - New Repository
echo.

echo 📋 Step 1: Create new GitHub repository
echo 1. Go to https://github.com/new
echo 2. Repository name: 20-10-gift-app
echo 3. Description: 🎁 20/10 Gift App - 100-day calendar with 3D gift boxes
echo 4. Public ✅
echo 5. Don't add README, .gitignore, or license
echo 6. Click Create repository
echo.
pause

echo 🔧 Step 2: Setup local repository
echo Removing old remote...
git remote remove origin

echo.
echo 📝 Please enter your GitHub username:
set /p GITHUB_USERNAME=

echo Adding new remote...
git remote add origin https://github.com/%GITHUB_USERNAME%/20-10-gift-app.git

echo.
echo 🚀 Pushing to new repository...
git add .
git commit -m "feat: Initial commit - 20/10 Gift App with full features

🎁 Features:
- 3D gift boxes (teddy bear, bracelet, book)
- 100-day calendar with 24h timer
- Firebase integration for progress saving
- Beautiful animations and responsive design
- Password: haphuong

🚀 Ready for GitHub Pages deployment"

git push -u origin main

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🚀 Deploying to GitHub Pages...
call npm run deploy

echo.
echo ✅ Setup completed!
echo.
echo 🌐 Your app will be available at:
echo https://%GITHUB_USERNAME%.github.io/20-10-gift-app/
echo.
echo 📋 Final step - Configure GitHub Pages:
echo 1. Go to https://github.com/%GITHUB_USERNAME%/20-10-gift-app/settings/pages
echo 2. Source: Deploy from a branch
echo 3. Branch: gh-pages
echo 4. Folder: / (root)
echo 5. Save
echo.
echo 🎉 Your 20/10 Gift App is ready!
pause
