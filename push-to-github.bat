@echo off
echo ========================================
echo    PUSH WEBSITE 20/10 LEN GITHUB
echo ========================================
echo.

echo [1/4] Kiem tra git status...
git status

echo.
echo [2/4] Them remote origin (neu chua co)...
git remote -v
if %errorlevel% neq 0 (
    echo Chua co remote, dang them...
    git remote add origin https://github.com/SalyyS1/20thang10-gift.git
) else (
    echo Da co remote origin
)

echo.
echo [3/4] Chuyen branch sang main...
git branch -M main

echo.
echo [4/4] Push len GitHub...
git push -u origin main

echo.
echo ========================================
echo    HOAN THANH!
echo ========================================
echo.
echo Website se co URL: https://salyys1.github.io/20thang10-gift/
echo.
echo Nho cau hinh GitHub Pages:
echo 1. Vao Settings ^> Pages
echo 2. Source: GitHub Actions
echo 3. Them GH_TOKEN vao Secrets
echo.
pause
