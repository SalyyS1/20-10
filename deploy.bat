@echo off
echo 🚀 Deploying 20/10 Gift App to GitHub Pages...

echo 📦 Building application...
call npm run build

echo 🚀 Deploying to GitHub Pages...
call npm run deploy

echo ✅ Deployment completed!
echo 🌐 Your app is now live at: https://YOUR_USERNAME.github.io/20-10-gift-app/
echo.
echo 📋 Next steps:
echo 1. Go to your repository Settings
echo 2. Click Pages
echo 3. Source: Deploy from a branch
echo 4. Branch: gh-pages
echo 5. Folder: / (root)
echo 6. Save
echo.
pause
