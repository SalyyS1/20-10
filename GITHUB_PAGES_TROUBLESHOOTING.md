# 🔧 GitHub Pages Troubleshooting Guide

## ❌ Vấn đề: Trang web trắng tinh

### ✅ Kiểm tra đã hoàn thành:
- [x] Repository: https://github.com/SalyyS1/20-10
- [x] Branch `gh-pages`: Đã có và có đầy đủ files build
- [x] Build files: index.html, assets/, vite.svg đã sẵn sàng
- [x] Deploy: Đã deploy thành công với `npm run deploy`

### 🔧 Cần cấu hình GitHub Pages:

#### Bước 1: Vào Settings
1. Vào repository: https://github.com/SalyyS1/20-10
2. Click tab **Settings** (gần Code, Issues, Pull requests)

#### Bước 2: Cấu hình Pages
1. Trong menu bên trái, click **Pages**
2. Trong phần **Source**, chọn:
   - **Source:** "Deploy from a branch"
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
3. Click **Save**

#### Bước 3: Đợi deployment
- GitHub Pages sẽ tự động build từ branch `gh-pages`
- Đợi 2-3 phút để hoàn thành
- Sẽ thấy thông báo: "Your site is published at https://salyys1.github.io/20-10/"

### 🚨 Nếu vẫn trắng tinh:

#### Kiểm tra 1: GitHub Pages có được kích hoạt không?
- Vào Settings → Pages
- Kiểm tra có thông báo "Your site is published at..." không
- Nếu không có, cần cấu hình lại

#### Kiểm tra 2: Branch gh-pages có đúng không?
- Vào https://github.com/SalyyS1/20-10/tree/gh-pages
- Kiểm tra có file `index.html` không
- Kiểm tra có folder `assets/` không

#### Kiểm tra 3: Cache browser
- Thử hard refresh (Ctrl+F5)
- Thử incognito mode
- Thử browser khác

#### Kiểm tra 4: GitHub Pages status
- Vào Settings → Pages
- Kiểm tra có thông báo lỗi gì không
- Nếu có lỗi, click "Retry" hoặc "Redeploy"

### 🔗 Links kiểm tra:
- **Repository:** https://github.com/SalyyS1/20-10
- **Branch gh-pages:** https://github.com/SalyyS1/20-10/tree/gh-pages
- **GitHub Pages:** https://salyys1.github.io/20-10/
- **Settings Pages:** https://github.com/SalyyS1/20-10/settings/pages

### 📞 Nếu vẫn không được:
1. Kiểm tra Settings → Pages có cấu hình đúng không
2. Đợi thêm 5-10 phút để GitHub Pages build xong
3. Thử truy cập link khác: https://salyys1.github.io/20-10/index.html
4. Kiểm tra console browser có lỗi gì không (F12)

**Repository đã sẵn sàng 100%! Chỉ cần cấu hình GitHub Pages là xong!** 🚀
