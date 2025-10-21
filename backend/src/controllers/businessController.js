import Business from '../models/Business.js';
import User from '../models/User.js';

// @desc    Tüm işletmeleri listele (arama ve filtreleme ile)
// @route   GET /api/businesses
// @access  Public
export const getBusinesses = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      minRating,
      page = 1,
      limit = 10,
    } = req.query;

    // Query oluştur
    const query = { isActive: true };

    // Arama - işletme adı veya açıklamada ara
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Kategori filtresi
    if (category) {
      query.category = category;
    }

    // Şehir filtresi
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    // Rating filtresi
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // İşletmeleri getir
    const businesses = await Business.find(query)
      .populate('owner', 'name email')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Toplam sayı
    const total = await Business.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        businesses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'İşletmeler getirilirken hata oluştu',
    });
  }
};

// @desc    Tek işletme detayı
// @route   GET /api/businesses/:id
// @access  Public
export const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    res.status(200).json({
      success: true,
      data: { business },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'İşletme getirilirken hata oluştu',
    });
  }
};

// @desc    İşletme oluştur
// @route   POST /api/businesses
// @access  Private (Business owner only)
export const createBusiness = async (req, res) => {
  try {
    // Kullanıcı business rolüne sahip mi?
    if (req.user.role !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Sadece işletme hesapları işletme oluşturabilir',
      });
    }

    // Kullanıcının zaten bir işletmesi var mı?
    const existingBusiness = await Business.findOne({ owner: req.user.id });

    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: 'Zaten bir işletmeniz var',
      });
    }

    // İşletme oluştur
    const business = await Business.create({
      owner: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: 'İşletme başarıyla oluşturuldu',
      data: { business },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'İşletme oluşturulurken hata oluştu',
    });
  }
};

// @desc    İşletme güncelle
// @route   PUT /api/businesses/:id
// @access  Private (Business owner only)
export const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    // İşletme sahibi mi kontrol et
    if (business.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu işletmeyi güncelleme yetkiniz yok',
      });
    }

    // Güncelle
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'İşletme başarıyla güncellendi',
      data: { business: updatedBusiness },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'İşletme güncellenirken hata oluştu',
    });
  }
};

// @desc    İşletme sil
// @route   DELETE /api/businesses/:id
// @access  Private (Business owner only)
export const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    // İşletme sahibi mi kontrol et
    if (business.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu işletmeyi silme yetkiniz yok',
      });
    }

    // Soft delete - isActive = false
    business.isActive = false;
    await business.save();

    res.status(200).json({
      success: true,
      message: 'İşletme başarıyla silindi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'İşletme silinirken hata oluştu',
    });
  }
};

// @desc    Kullanıcının kendi işletmesini getir
// @route   GET /api/businesses/my-business
// @access  Private (Business owner only)
export const getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    res.status(200).json({
      success: true,
      data: { business },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'İşletme getirilirken hata oluştu',
    });
  }
};

// @desc    İşletme hizmeti ekle
// @route   POST /api/businesses/:id/services
// @access  Private (Business owner only)
export const addService = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    // İşletme sahibi mi kontrol et
    if (business.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlemi yapma yetkiniz yok',
      });
    }

    // Hizmeti ekle
    business.services.push(req.body);
    await business.save();

    res.status(201).json({
      success: true,
      message: 'Hizmet başarıyla eklendi',
      data: { business },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Hizmet eklenirken hata oluştu',
    });
  }
};

// @desc    İşletme hizmeti güncelle
// @route   PUT /api/businesses/:id/services/:serviceId
// @access  Private (Business owner only)
export const updateService = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    // İşletme sahibi mi kontrol et
    if (business.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlemi yapma yetkiniz yok',
      });
    }

    // Hizmeti bul
    const service = business.services.id(req.params.serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Hizmet bulunamadı',
      });
    }

    // Güncelle
    Object.assign(service, req.body);
    await business.save();

    res.status(200).json({
      success: true,
      message: 'Hizmet başarıyla güncellendi',
      data: { business },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Hizmet güncellenirken hata oluştu',
    });
  }
};

// @desc    İşletme hizmeti sil
// @route   DELETE /api/businesses/:id/services/:serviceId
// @access  Private (Business owner only)
export const deleteService = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    // İşletme sahibi mi kontrol et
    if (business.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlemi yapma yetkiniz yok',
      });
    }

    // Hizmeti sil
    business.services.pull(req.params.serviceId);
    await business.save();

    res.status(200).json({
      success: true,
      message: 'Hizmet başarıyla silindi',
      data: { business },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Hizmet silinirken hata oluştu',
    });
  }
};
