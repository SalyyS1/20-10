# Firebase Setup Guide

## Bước 1: Tạo Firebase Project

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" hoặc "Create a project"
3. Đặt tên project (ví dụ: "calendar-100-days")
4. Chọn "Enable Google Analytics" (tùy chọn)
5. Click "Create project"

## Bước 2: Thêm Web App

1. Trong Firebase Console, click biểu tượng web `</>`
2. Đặt tên app (ví dụ: "calendar-web")
3. **KHÔNG** check "Set up Firebase Hosting" (vì dùng GitHub Pages)
4. Click "Register app"
5. Copy config object (sẽ có dạng như này):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## Bước 3: Cấu hình Firestore

1. Trong Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Chọn "Start in test mode" (cho development)
4. Chọn location gần nhất (ví dụ: asia-southeast1)
5. Click "Done"

## Bước 4: Cấu hình Security Rules

1. Trong Firestore, click tab "Rules"
2. Thay thế rules hiện tại bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for calendar progress
    match /calendar_progress/{deviceId} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

## Bước 5: Tạo file .env

1. Copy file `env.example` thành `.env`
2. Điền thông tin từ Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
```

## Bước 6: Test

1. Chạy `npm install` để cài Firebase
2. Chạy `npm run dev` để test
3. Mở calendar, thử mở 1 ô → kiểm tra Firestore Console xem có data không

## Lưu ý quan trọng

- **KHÔNG** commit file `.env` lên GitHub (đã có trong .gitignore)
- **KHÔNG** commit Firebase config keys lên public repo
- Để deploy GitHub Pages, cần set environment variables trong GitHub Actions hoặc dùng public config

## Troubleshooting

- Nếu lỗi "Firebase not initialized": kiểm tra .env file
- Nếu lỗi "Permission denied": kiểm tra Firestore rules
- Nếu lỗi "Network": kiểm tra Firebase project ID
