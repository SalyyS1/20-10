# 🎁 20/10 Website

## ✨ Tính năng

- 🎁 **3 hộp quà bí mật:** Gấu bông 🧸, vòng tay 💍, sách 📚
- 📅 **Lịch 100 ngày:** Timer 24h, mở tuần tự từ ngày 1-100
- 🔥 **Firebase:** Lưu progress và thông tin quà
- ✨ **Animations:** Hiệu ứng đẹp, responsive design
- 🎵 **Audio:** Player tích hợp

## 🚀 Demo

**Live Demo:** [https://salyys1.github.io/20-10/](https://salyys1.github.io/20-10/)

## 🛠️ Công nghệ

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **3D Graphics:** Three.js + React Three Fiber
- **Database:** Firebase Firestore
- **Deployment:** GitHub Pages
- **Build Tool:** Vite

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/SalyyS1/20-10.git
cd 20-10

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## 🔧 Cấu hình

### Firebase Setup
1. Tạo project Firebase mới
2. Cấu hình Firestore Database
3. Cập nhật `src/config/firebase-config.ts`

### GitHub Pages
1. Vào Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages`
4. Folder: `/ (root)`

## 📁 Cấu trúc project

```
src/
├── components/     # React components
│   ├── Allay.tsx          # Character component
│   ├── Calendar100.tsx   # 100-day calendar
│   ├── GiftBox3D.tsx     # 3D gift boxes
│   ├── FlowerBloom.tsx   # Flower animation
│   └── ...
├── pages/         # Page components
│   ├── LandingPage.tsx   # Landing page
│   ├── GiftPage.tsx      # Gift selection
│   └── OpenGiftPage.tsx  # Gift opening
├── utils/         # Utilities
│   ├── firebase.ts       # Firebase config
│   ├── progress.ts       # Progress management
│   └── api.ts           # API calls
├── config/        # Configuration
│   ├── index.ts         # App config
│   └── firebase-config.ts # Firebase config
└── styles/         # CSS styles
    └── globals.css      # Global styles
```

## 🚀 Deploy

```bash
# Build ứng dụng
npm run build

# Deploy lên GitHub Pages
npm run deploy
```



## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 💖 Made with Love

Được tạo với ❤️ cho ngày Phụ Nữ Việt Nam 20/10
