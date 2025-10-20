# 🚀 Setup Repository Mới - 20/10 Gift App

## 📋 Hướng dẫn tạo repository mới

### Bước 1: Tạo repository trên GitHub
1. Vào https://github.com/new
2. **Repository name:** `20-10-gift-app`
3. **Description:** `🎁 20/10 Gift App - 100-day calendar with 3D gift boxes, Firebase integration, and beautiful animations`
4. **Public** ✅
5. **Add a README file** ❌ (không cần)
6. **Add .gitignore** ❌ (không cần)
7. **Choose a license** ❌ (không cần)
8. Click **Create repository**

### Bước 2: Setup local repository
```bash
# Xóa remote cũ
git remote remove origin

# Thêm remote mới (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/20-10-gift-app.git

# Push code lên repository mới
git push -u origin main
```

### Bước 3: Deploy lên GitHub Pages
```bash
# Deploy lên GitHub Pages
npm run deploy
```

### Bước 4: Cấu hình GitHub Pages
1. Vào repository mới: https://github.com/YOUR_USERNAME/20-10-gift-app
2. Click **Settings** → **Pages**
3. **Source:** "Deploy from a branch"
4. **Branch:** `gh-pages`
5. **Folder:** `/ (root)`
6. Click **Save**

## 🎁 Tính năng ứng dụng

- **3 hộp quà bí mật:** Gấu bông 🧸, vòng tay 💍, sách 📚
- **Lịch 100 ngày:** Timer 24h, mở tuần tự từ ngày 1-100
- **Mật khẩu:** `haphuong`
- **Firebase:** Lưu progress và thông tin quà
- **Animations:** Hiệu ứng đẹp, responsive design

## 🔧 Cấu hình cần thiết

### Firebase Setup
1. Tạo project Firebase mới
2. Cấu hình Firestore Database
3. Cập nhật `src/config/firebase-config.ts`

### GitHub Pages
- Repository phải public
- Branch `gh-pages` sẽ được tạo tự động
- Cấu hình Settings → Pages

## 📁 Cấu trúc project

```
20-10-gift-app/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── utils/         # Utilities (Firebase, API)
│   ├── config/        # Configuration
│   └── styles/         # CSS styles
├── public/            # Static assets
├── dist/             # Build output (auto-generated)
└── package.json       # Dependencies
```

## 🚀 Deploy Commands

```bash
# Build ứng dụng
npm run build

# Deploy lên GitHub Pages
npm run deploy

# Development server
npm run dev
```

**Sau khi setup xong, trang web sẽ hoạt động tại:** `https://YOUR_USERNAME.github.io/20-10-gift-app/` 🎉
