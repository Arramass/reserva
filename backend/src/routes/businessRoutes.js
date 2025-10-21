import express from 'express';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getMyBusiness,
  addService,
  updateService,
  deleteService,
} from '../controllers/businessController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBusinesses);
router.get('/:id', getBusinessById);

// Protected routes - Business owner only
router.get('/my/business', protect, authorize('business'), getMyBusiness);
router.post('/', protect, authorize('business'), createBusiness);
router.put('/:id', protect, authorize('business'), updateBusiness);
router.delete('/:id', protect, authorize('business'), deleteBusiness);

// Service management routes
router.post('/:id/services', protect, authorize('business'), addService);
router.put('/:id/services/:serviceId', protect, authorize('business'), updateService);
router.delete('/:id/services/:serviceId', protect, authorize('business'), deleteService);

export default router;
