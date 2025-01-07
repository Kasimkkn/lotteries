import express from 'express';
import { createTransaction, deleteTransaction, getAllTransactions, getSingleTransaction, getUserTransactions } from '../controllers/transactionController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/', protect, authorize('admin', 'agent'), getAllTransactions);
// router.get('/:id', protect, getSingleTransaction);
router.get('/user', protect, getUserTransactions);
router.delete('/:id', protect, authorize('admin', 'agent'), deleteTransaction);

export default router;
