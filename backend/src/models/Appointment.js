import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Müşteri bilgisi gereklidir'],
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'İşletme bilgisi gereklidir'],
    },
    service: {
      name: {
        type: String,
        required: [true, 'Hizmet adı gereklidir'],
      },
      duration: {
        type: Number,
        required: [true, 'Hizmet süresi gereklidir'],
      },
      price: {
        type: Number,
        required: [true, 'Hizmet ücreti gereklidir'],
      },
    },
    date: {
      type: Date,
      required: [true, 'Randevu tarihi gereklidir'],
    },
    startTime: {
      type: String, // Format: "14:00"
      required: [true, 'Başlangıç saati gereklidir'],
    },
    endTime: {
      type: String, // Format: "15:00"
      required: [true, 'Bitiş saati gereklidir'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledBy: {
      type: String,
      enum: ['customer', 'business'],
    },
    cancelledAt: {
      type: Date,
    },
    // Ödeme bilgileri (gelecekte kullanılabilir)
    payment: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
      },
      method: {
        type: String,
        enum: ['cash', 'card', 'online'],
      },
      amount: Number,
      paidAt: Date,
    },
    // Hatırlatma
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index'ler - Performans için
appointmentSchema.index({ customer: 1, date: -1 });
appointmentSchema.index({ business: 1, date: -1 });
appointmentSchema.index({ date: 1, startTime: 1 });
appointmentSchema.index({ status: 1 });

// Geçmiş randevuları otomatik olarak completed yapma (opsiyonel)
appointmentSchema.methods.checkAndUpdateStatus = function () {
  const now = new Date();
  const appointmentDateTime = new Date(this.date);
  const [hours, minutes] = this.endTime.split(':');
  appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

  if (now > appointmentDateTime && this.status === 'confirmed') {
    this.status = 'completed';
    return this.save();
  }
};

// Virtual field - tam tarih-saat bilgisi
appointmentSchema.virtual('appointmentDateTime').get(function () {
  const date = new Date(this.date);
  const [hours, minutes] = this.startTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
