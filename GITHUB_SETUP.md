# Hướng dẫn tạo Repository và Deploy lên GitHub

## Bước 1: Tạo Repository trên GitHub

1. Truy cập https://github.com/SalyyS1
2. Click nút **"New"** hoặc **"+"** → **"New repository"**
3. Điền thông tin:
   - **Repository name**: `20thang10-gift`
   - **Description**: `Website chúc mừng ngày Phụ Nữ Việt Nam 20/10 - Món quà đặc biệt với Allay, quà bí mật và quyển sách 100 ngày`
   - **Visibility**: Public ✅
   - **Initialize**: ❌ Không check (vì đã có code local)
4. Click **"Create repository"**

## Bước 2: Kết nối Repository Local với GitHub

Sau khi tạo repository, GitHub sẽ hiển thị URL. Copy URL và chạy lệnh:

```bash
git remote add origin https://github.com/SalyyS1/20thang10-gift.git
git branch -M main
git push -u origin main
```

## Bước 3: Cấu hình GitHub Pages

1. Vào repository → **Settings** → **Pages**
2. **Source**: Chọn **"GitHub Actions"**
3. **Save**

## Bước 4: Cấu hình GitHub Secrets

1. Vào repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Thêm secret:
   - **Name**: `GH_TOKEN`
   - **Value**: Personal Access Token của bạn (cần quyền `repo`, `workflow`)

## Bước 5: Cập nhật cấu hình trong code

Cần thay đổi `yourusername/yourrepo` trong các file:

### File: `.github/workflows/github-issue-proxy.yml`
```yaml
# Thay đổi dòng này:
https://api.github.com/repos/${{ github.repository }}/issues
# Thành:
https://api.github.com/repos/SalyyS1/20thang10-gift/issues
```

### File: `public/api/github-issue-proxy.js`
```javascript
// Thay đổi dòng này:
const GITHUB_REPO = 'yourusername/yourrepo';
// Thành:
const GITHUB_REPO = 'SalyyS1/20thang10-gift';
```

### File: `public/api/github-progress.js`
```javascript
// Thay đổi dòng này:
const GITHUB_REPO = 'yourusername/yourrepo';
// Thành:
const GITHUB_REPO = 'SalyyS1/20thang10-gift';
```

## Bước 6: Push code đã cập nhật

```bash
git add .
git commit -m "fix: Update repository configuration for SalyyS1/20thang10-gift"
git push origin main
```

## Bước 7: Kiểm tra Deployment

1. Vào repository → **Actions** tab
2. Kiểm tra workflow **"Deploy to GitHub Pages"** chạy thành công
3. Vào **Settings** → **Pages** để xem URL website

## URL Website

Sau khi deploy thành công, website sẽ có URL:
**https://salyys1.github.io/20thang10-gift/**

## Troubleshooting

### Lỗi Permission
- Đảm bảo Personal Access Token có đủ quyền
- Kiểm tra repository có public không

### Lỗi Build
- Kiểm tra Actions logs
- Đảm bảo tất cả dependencies được cài đặt

### Lỗi 404
- Kiểm tra GitHub Pages settings
- Đảm bảo workflow chạy thành công

## Tính năng Website

✅ **Trang chúc mừng** với hiệu ứng hoa rơi
✅ **Allay character** bay lượn và tặng quà
✅ **3 hộp quà bí mật** với form nhập thông tin
✅ **Quyển sách 100 ngày** với mật khẩu
✅ **Progress tracking** lưu trên GitHub
✅ **Mobile responsive** hoàn hảo
✅ **API integration** an toàn

Website sẵn sàng để tặng! 💝
