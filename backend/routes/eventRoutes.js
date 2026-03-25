import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    getEvents,
    getEvent,
    registerEvent,
    createEvent
} from '../controllers/eventController.js';
import * as mockController from '../controllers/mockController.js';

const router = express.Router();

const withMockFallback = (realFn, mockFn) => (req, res, next) => {
    if (global.OFFLINE_MODE) {
        return mockFn(req, res);
    }
    return realFn(req, res, next);
};

router.get('/', withMockFallback(getEvents, mockController.mockGetEvents));
router.get('/:id', getEvent); // No mock for single event details yet
router.post('/register', protect, (req, res, next) => {
    console.log('Events: Register request received');
    console.log('Body:', req.body);
    console.log('User:', req.user ? req.user.id : 'No user');
    console.log('Offline Mode:', global.OFFLINE_MODE);
    next();
}, withMockFallback(registerEvent, mockController.mockRegisterEvent));
router.post('/', protect, authorize('admin'), withMockFallback(createEvent, mockController.mockCreateEvent));

export default router;
