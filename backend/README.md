# Randevu Yönetim Sistemi - Backend API

Node.js + Express + MongoDB ile geliştirilmiş RESTful API

## 🚀 Başlangıç

### Gereksinimler

- Node.js (v18 veya üstü)
- MongoDB (v6 veya üstü)
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# MongoDB'yi başlat (lokalde)
mongod

# Development modda başlat
npm run dev

# Production modda başlat
npm start
```

### Environment Variables

`.env` dosyasını oluşturun ve aşağıdaki değişkenleri ayarlayın:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/randevu-db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:19006
```

## 📚 API Endpoints

### Authentication

#### Kayıt Ol
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456",
  "role": "customer", // veya "business"
  "phone": "05551234567",
  "businessName": "Ahmet Kuaför" // sadece business için
}
```

#### Giriş Yap
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmet@example.com",
  "password": "123456",
  "role": "customer" // opsiyonel
}
```

#### Profil Bilgilerini Getir
```
GET /api/auth/me
Authorization: Bearer {token}
```

#### Profil Güncelle
```
PUT /api/auth/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Ahmet Yeni İsim",
  "phone": "05559876543"
}
```

#### Şifre Değiştir
```
PUT /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

## 🗂️ Proje Yapısı

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB bağlantısı
│   ├── controllers/
│   │   └── authController.js    # Auth işlemleri
│   ├── middlewares/
│   │   ├── auth.js              # JWT doğrulama
│   │   └── errorHandler.js      # Hata yönetimi
│   ├── models/
│   │   ├── User.js              # Kullanıcı modeli
│   │   └── Business.js          # İşletme modeli
│   ├── routes/
│   │   └── authRoutes.js        # Auth route'ları
│   ├── utils/
│   │   └── jwt.js               # JWT yardımcıları
│   └── server.js                # Ana sunucu dosyası
├── .env.example                 # Environment değişkenler örneği
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Güvenlik

- Şifreler bcryptjs ile hash'leniyor
- JWT token ile kimlik doğrulama
- CORS koruması
- Input validasyonu
- Rate limiting (gelecek güncellemede)

## 📝 Modeller

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer/business),
  phone: String,
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Business Schema
```javascript
{
  owner: ObjectId (User),
  businessName: String,
  description: String,
  category: String,
  address: Object,
  location: GeoJSON,
  phone: String,
  email: String,
  website: String,
  images: [String],
  workingHours: Object,
  services: [Object],
  rating: Object,
  isActive: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Test

```bash
# Tests (gelecek)
npm test
```

## 📄 Lisans

ISC
