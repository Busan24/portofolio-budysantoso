# Vercel Deployment Setup

## Environment Variables Required

To enable admin features, add these environment variables in Vercel Dashboard:

### 📍 How to Add in Vercel:
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

### 🔥 Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### ☁️ Cloudinary Configuration
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📝 Notes

- **The app will build successfully without these variables** (dummy values are used during build)
- **Admin features will NOT work** without proper Firebase configuration
- **Public pages** (home, portfolio, contact) work fine without configuration
- After adding environment variables, trigger a new deployment

## 🚀 Quick Deploy

After setting up environment variables:
```bash
git push origin main
```

Vercel will automatically deploy with the new configuration.
