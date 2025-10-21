import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getBusinessAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  getAvailableSlots,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/available-slots/:businessId', getAvailableSlots);

// Protected routes - All authenticated users
router.post('/', protect, createAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

// Protected routes - Business owner only
router.get('/business/appointments', protect, authorize('business'), getBusinessAppointments);
router.put('/:id/confirm', protect, authorize('business'), confirmAppointment);
router.put('/:id/complete', protect, authorize('business'), completeAppointment);

export default router;
