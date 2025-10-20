# 📅 Randevu Yönetim Sistemi

Modern, kullanıcı dostu randevu yönetim platformu. React Native (Expo) ve Node.js ile geliştirilmiştir.

## 🎯 Özellikler

### Müşteri Özellikleri
- ✅ Kullanıcı kaydı ve girişi
- 📱 İşletme arama ve filtreleme
- 📅 Randevu oluşturma
- 🔔 Bildirimler
- ⭐ İşletme değerlendirme

### İşletme Özellikleri
- ✅ İşletme profili yönetimi
- 📊 Randevu yönetimi
- ⏰ Müsaitlik ayarlama
- 📈 İstatistikler ve raporlar
- 👥 Çalışan yönetimi

## 🏗️ Proje Yapısı

```
reserva/
├── randevu-app/          # React Native (Expo) Frontend
│   ├── src/
│   │   ├── components/   # Reusable UI bileşenleri
│   │   ├── context/      # Global state yönetimi
│   │   ├── navigation/   # Navigasyon yapısı
│   │   ├── screens/      # Uygulama ekranları
│   │   ├── services/     # API servisleri
│   │   └── utils/        # Yardımcı fonksiyonlar
│   └── package.json
│
└── backend/              # Node.js + Express Backend
    ├── src/
    │   ├── config/       # Konfigürasyon dosyaları
    │   ├── controllers/  # İş mantığı
    │   ├── middlewares/  # Middleware'ler
    │   ├── models/       # Database modelleri
    │   ├── routes/       # API route'ları
    │   └── utils/        # Yardımcı fonksiyonlar
    └── package.json
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18+)
- MongoDB (v6+)
- Expo CLI
- iOS Simulator veya Android Emulator (opsiyonel)

### Backend Kurulum

```bash
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# MongoDB'yi başlat
mongod

# Backend'i başlat (development)
npm run dev
```

Backend `http://localhost:5000` adresinde çalışacaktır.

### Frontend Kurulum

```bash
cd randevu-app

# Bağımlılıkları yükle
npm install

# Expo'yu başlat
npx expo start

# iOS Simulator için
i

# Android Emulator için
a

# Web için
w
```

## 🛠️ Teknolojiler

### Frontend
- React Native (Expo)
- React Navigation
- React Native Paper
- Axios
- AsyncStorage

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 📱 Ekran Görüntüleri

(Ekran görüntüleri eklenecek)

## 🔐 API Dokümantasyonu

API endpoints ve kullanımı için [Backend README](./backend/README.md) dosyasına bakın.

## 🧪 Test

```bash
# Backend testleri
cd backend
npm test

# Frontend testleri
cd randevu-app
npm test
```

## 📝 Geliştirme Aşamaları

- [x] Adım 1: Proje yapısı ve temel UI
- [x] Adım 2: Backend API ve authentication
- [ ] Adım 3: Randevu yönetim özellikleri
- [ ] Adım 4: Bildirimler ve takvim entegrasyonu
- [ ] Adım 5: Arama ve filtreleme
- [ ] Adım 6: İstatistikler ve raporlar
- [ ] Adım 7: Production deployment

## 👥 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

ISC

## 📧 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.
