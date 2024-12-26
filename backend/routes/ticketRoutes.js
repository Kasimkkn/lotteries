import express from 'express';
import { purchaseTicket, getTicketsByUser, getAllTickets, getTicketById, deleteTicket } from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, purchaseTicket);
router.get('/:userId', protect, getTicketsByUser);
router.get('/', protect, authorize('admin', 'agent'), getAllTickets);
router.get('/:id', protect, authorize('admin', 'agent'), getTicketById);
router.delete('/:id', protect, authorize('admin', 'agent'), deleteTicket);

export default router;
