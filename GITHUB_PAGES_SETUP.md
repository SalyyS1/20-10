# GitHub Pages Setup Guide

## Cấu hình GitHub Pages

1. **Vào GitHub repository:** https://github.com/SalyyS1/20-10

2. **Vào Settings → Pages**

3. **Cấu hình:**
   - **Source:** "Deploy from a branch"
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
   - **Save**

4. **Đợi 2-3 phút** để GitHub Pages build xong

5. **Kiểm tra:** https://salyys1.github.io/20-10/

## Tính năng ứng dụng

- 🎁 **3 hộp quà bí mật:** Gấu bông, vòng tay, sách
- 📅 **Lịch 100 ngày:** Timer 24h, mở tuần tự
- 🔐 **Mật khẩu:** `haphuong`
- 🔥 **Firebase:** Lưu progress và thông tin quà
- ✨ **Animations:** Hiệu ứng đẹp, responsive

## Deploy thủ công

```bash
npm run deploy
```

## Troubleshooting

- Nếu trang trắng: Kiểm tra Settings → Pages có chọn branch `gh-pages` không
- Nếu lỗi 404: Đợi thêm 2-3 phút để GitHub Pages build xong
- Nếu lỗi permissions: Kiểm tra repository permissions
