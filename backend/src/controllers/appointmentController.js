import Appointment from '../models/Appointment.js';
import Business from '../models/Business.js';

// @desc    Randevu oluştur
// @route   POST /api/appointments
// @access  Private (Customer)
export const createAppointment = async (req, res) => {
  try {
    const { businessId, service, date, startTime, endTime, notes } = req.body;

    // İşletme var mı kontrol et
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    // Çakışma kontrolü
    const conflict = await Appointment.findOne({
      business: businessId,
      date: new Date(date),
      status: { $nin: ['cancelled'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Bu saat dilimi için zaten bir randevu var',
      });
    }

    // Randevu oluştur
    const appointment = await Appointment.create({
      customer: req.user.id,
      business: businessId,
      service,
      date,
      startTime,
      endTime,
      notes,
    });

    // Populate ile detayları getir
    await appointment.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'business', select: 'businessName address phone' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Randevu başarıyla oluşturuldu',
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevu oluşturulurken hata oluştu',
    });
  }
};

// @desc    Kullanıcının randevularını listele
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    // Query oluştur
    const query = { customer: req.user.id };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .populate('business', 'businessName address phone images')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevular getirilirken hata oluştu',
    });
  }
};

// @desc    İşletmenin randevularını listele
// @route   GET /api/appointments/business-appointments
// @access  Private (Business owner)
export const getBusinessAppointments = async (req, res) => {
  try {
    // Kullanıcının işletmesini bul
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    const { status, startDate, endDate } = req.query;

    // Query oluştur
    const query = { business: business._id };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'name email phone')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevular getirilirken hata oluştu',
    });
  }
};

// @desc    Randevu detayı
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('business', 'businessName address phone email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Randevu bulunamadı',
      });
    }

    // Yetki kontrolü - sadece randevunun sahibi veya işletme sahibi görebilir
    const business = await Business.findById(appointment.business._id);

    if (
      appointment.customer._id.toString() !== req.user.id &&
      (!business || business.owner.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Bu randevuyu görme yetkiniz yok',
      });
    }

    res.status(200).json({
      success: true,
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevu getirilirken hata oluştu',
    });
  }
};

// @desc    Randevu güncelle
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Randevu bulunamadı',
      });
    }

    // Yetki kontrolü
    const business = await Business.findById(appointment.business);

    if (
      appointment.customer.toString() !== req.user.id &&
      (!business || business.owner.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Bu randevuyu güncelleme yetkiniz yok',
      });
    }

    // İptal edilmiş veya tamamlanmış randevu güncellenemez
    if (['cancelled', 'completed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'İptal edilmiş veya tamamlanmış randevu güncellenemez',
      });
    }

    // Güncelle
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('customer', 'name email phone')
      .populate('business', 'businessName address phone');

    res.status(200).json({
      success: true,
      message: 'Randevu başarıyla güncellendi',
      data: { appointment: updatedAppointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevu güncellenirken hata oluştu',
    });
  }
};

// @desc    Randevu iptal et
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Randevu bulunamadı',
      });
    }

    // Yetki kontrolü
    const business = await Business.findById(appointment.business);
    let cancelledBy = 'customer';

    if (appointment.customer.toString() === req.user.id) {
      cancelledBy = 'customer';
    } else if (business && business.owner.toString() === req.user.id) {
      cancelledBy = 'business';
    } else {
      return res.status(403).json({
        success: false,
        message: 'Bu randevuyu iptal etme yetkiniz yok',
      });
    }

    // Zaten iptal edilmiş mi?
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Bu randevu zaten iptal edilmiş',
      });
    }

    // İptal et
    appointment.status = 'cancelled';
    appointment.cancelledBy = cancelledBy;
    appointment.cancelledAt = new Date();
    appointment.cancellationReason = req.body.reason || '';

    await appointment.save();

    await appointment.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'business', select: 'businessName address phone' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Randevu başarıyla iptal edildi',
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevu iptal edilirken hata oluştu',
    });
  }
};

// @desc    Randevu onayla (İşletme sahibi)
// @route   PUT /api/appointments/:id/confirm
// @access  Private (Business owner)
export const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Randevu bulunamadı',
      });
    }

    // İşletme sahibi mi kontrol et
    const business = await Business.findById(appointment.business);

    if (!business || business.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu randevuyu onaylama yetkiniz yok',
      });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    await appointment.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'business', select: 'businessName address phone' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Randevu başarıyla onaylandı',
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevu onaylanırken hata oluştu',
    });
  }
};

// @desc    Randevuyu tamamlandı olarak işaretle
// @route   PUT /api/appointments/:id/complete
// @access  Private (Business owner)
export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Randevu bulunamadı',
      });
    }

    // İşletme sahibi mi kontrol et
    const business = await Business.findById(appointment.business);

    if (!business || business.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlemi yapma yetkiniz yok',
      });
    }

    appointment.status = 'completed';
    await appointment.save();

    await appointment.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'business', select: 'businessName address phone' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Randevu tamamlandı olarak işaretlendi',
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Randevu tamamlanırken hata oluştu',
    });
  }
};

// @desc    Belirli bir tarih için müsait saatleri getir
// @route   GET /api/appointments/available-slots/:businessId
// @access  Public
export const getAvailableSlots = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { date, duration = 60 } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Tarih gereklidir',
      });
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'İşletme bulunamadı',
      });
    }

    // O gün için mevcut randevuları getir
    const appointments = await Appointment.find({
      business: businessId,
      date: new Date(date),
      status: { $nin: ['cancelled'] },
    }).select('startTime endTime');

    // Çalışma saatlerini al
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHours = business.workingHours[dayOfWeek];

    if (!workingHours || workingHours.isClosed) {
      return res.status(200).json({
        success: true,
        data: { availableSlots: [] },
        message: 'Bu gün kapalı',
      });
    }

    // Müsait slotları hesapla
    const availableSlots = calculateAvailableSlots(
      workingHours.open,
      workingHours.close,
      appointments,
      parseInt(duration)
    );

    res.status(200).json({
      success: true,
      data: { availableSlots },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Müsait saatler getirilirken hata oluştu',
    });
  }
};

// Yardımcı fonksiyon - Müsait slotları hesapla
function calculateAvailableSlots(openTime, closeTime, bookedSlots, duration) {
  const slots = [];
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);

  let currentHour = openHour;
  let currentMinute = openMinute;

  while (
    currentHour < closeHour ||
    (currentHour === closeHour && currentMinute < closeMinute)
  ) {
    const slotStart = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    // Bitiş saatini hesapla
    let endMinute = currentMinute + duration;
    let endHour = currentHour;

    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    const slotEnd = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

    // Çakışma kontrolü
    const hasConflict = bookedSlots.some((booking) => {
      return (
        (slotStart >= booking.startTime && slotStart < booking.endTime) ||
        (slotEnd > booking.startTime && slotEnd <= booking.endTime) ||
        (slotStart <= booking.startTime && slotEnd >= booking.endTime)
      );
    });

    if (!hasConflict) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
      });
    }

    // Bir sonraki slota geç (30 dakika aralıklarla)
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentHour++;
      currentMinute = 0;
    }
  }

  return slots;
}
