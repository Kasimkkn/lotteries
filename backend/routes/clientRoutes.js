import express from 'express';
import { createNewClient, deleteClient, getAllClients, updateClient, updatedCookieStatusAccept, updatedCookieStatusDeny } from '../controllers/clientController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/status-update-accept').put(updatedCookieStatusAccept);
router.route('/status-update-deny').put(updatedCookieStatusDeny);

router
    .route('/')
    .get(protect, getAllClients)
    .post(protect, authorize('agent', 'admin'), createNewClient);

router
    .route('/:id').put(protect, authorize('admin', 'agent'), updateClient)
    .delete(protect, authorize('admin', 'agent'), deleteClient);


export default router;