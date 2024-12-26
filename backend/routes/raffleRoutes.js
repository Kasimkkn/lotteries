import express from 'express';
import {
    createRaffle,
    getAllRaffles,
    getRaffleById,
    updateRaffle,
    deleteRaffle,
} from '../controllers/raffleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/mutler.js';

const router = express.Router();

router
    .route('/')
    .get(protect, getAllRaffles)
    .post(protect, singleUpload, authorize('agent', 'admin'), createRaffle);

router
    .route('/:id')
    .get(protect, getRaffleById)
    .put(protect, singleUpload, authorize('admin', 'agent'), updateRaffle)
    .delete(protect, authorize('admin', 'agent'), deleteRaffle);

export default router;