# 🔧 **SỬA LỖI GITHUB PAGES** 🔧

## ❌ **Vấn đề hiện tại:**
```
Branch "main" is not allowed to deploy to github-pages due to environment protection rules.
The deployment was rejected or didn't satisfy other protection rules.
```

## 🎯 **Nguyên nhân:**
GitHub Pages đang được cấu hình để deploy từ branch `main` thay vì branch `gh-pages`.

## ✅ **CÁCH SỬA:**

### **Bước 1: Vào GitHub Pages Settings**
1. Vào: https://github.com/SalyyS1/20-10/settings/pages
2. **Source:** Chọn "Deploy from a branch"
3. **Branch:** Chọn `gh-pages` (KHÔNG phải `main`)
4. **Folder:** Chọn `/ (root)`
5. **Click Save**

### **Bước 2: Kiểm tra cấu hình**
Đảm bảo cấu hình như sau:
- ✅ **Source:** Deploy from a branch
- ✅ **Branch:** `gh-pages` 
- ✅ **Folder:** `/ (root)`

### **Bước 3: Xóa GitHub Actions (nếu cần)**
Nếu vẫn có lỗi, có thể cần xóa GitHub Actions workflow:
1. Vào: https://github.com/SalyyS1/20-10/actions
2. Xóa workflow `deploy.yml` nếu có
3. Hoặc disable GitHub Actions trong Settings

## 🚀 **Sau khi sửa:**

### **Kiểm tra:**
1. Vào: https://github.com/SalyyS1/20-10/tree/gh-pages
2. Đảm bảo có file `index.html` và folder `assets/`
3. Kiểm tra URL: https://salyys1.github.io/20-10/

### **Nếu vẫn không hoạt động:**
1. **Redeploy thủ công:**
   ```bash
   npm run deploy
   ```

2. **Kiểm tra branch gh-pages:**
   - Đảm bảo branch `gh-pages` có đầy đủ files
   - File `index.html` có base path `/20-10/`

3. **Clear cache:**
   - Thử Incognito mode
   - Hard refresh (Ctrl+F5)

## 📋 **Cấu hình đúng:**

### **GitHub Pages Settings:**
- **Source:** Deploy from a branch
- **Branch:** `gh-pages`
- **Folder:** `/ (root)`

### **Vite Config:**
```typescript
export default defineConfig({
  base: '/20-10/',
  // ... other config
})
```

### **Expected URL:**
**https://salyys1.github.io/20-10/**

## 🎯 **Kết quả mong đợi:**
- ✅ Trang web hiển thị đầy đủ
- ✅ Assets load đúng path `/20-10/assets/`
- ✅ Animations hoạt động
- ✅ Firebase integration hoạt động

---

## 🚨 **LƯU Ý QUAN TRỌNG:**
**KHÔNG sử dụng GitHub Actions để deploy GitHub Pages!**
**Chỉ sử dụng branch `gh-pages` với `npm run deploy`!**
