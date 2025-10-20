import User from '../models/User.js';
import Business from '../models/Business.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Kullanıcı kayıt
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, businessName } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor',
      });
    }

    // Kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    // Eğer işletme kaydıysa, işletme profili de oluştur
    if (role === 'business' && businessName) {
      await Business.create({
        owner: user._id,
        businessName,
        email: email,
        phone: phone,
      });
    }

    // Token oluştur
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Kayıt sırasında bir hata oluştu',
    });
  }
};

// @desc    Kullanıcı giriş
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gereklidir',
      });
    }

    // Kullanıcıyı bul (password'u da dahil et)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre',
      });
    }

    // Rol kontrolü
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'Bu hesap için yanlış rol seçildi',
      });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre',
      });
    }

    // Aktif mi kontrol et
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Hesabınız aktif değil',
      });
    }

    // Token oluştur
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Giriş sırasında bir hata oluştu',
    });
  }
};

// @desc    Profil bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Profil bilgileri alınırken hata oluştu',
    });
  }
};

// @desc    Profil bilgilerini güncelle
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı',
      });
    }

    // Güncellenebilir alanlar
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profil güncellendi',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Profil güncellenirken hata oluştu',
    });
  }
};

// @desc    Şifre değiştir
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mevcut şifre ve yeni şifre gereklidir',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Mevcut şifreyi kontrol et
    const isPasswordValid = await user.matchPassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mevcut şifre hatalı',
      });
    }

    // Yeni şifreyi kaydet
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Şifre başarıyla değiştirildi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Şifre değiştirilirken hata oluştu',
    });
  }
};
