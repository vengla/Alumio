import express from 'express';
import {
    getUsers,
    getUserById,
    getDirectoryStats,
    getPendingUsers,
    approveUser,
    rejectUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import * as mockController from '../controllers/mockController.js';

const router = express.Router();

const withMockFallback = (realFn, mockFn) => (req, res, next) => {
    if (global.OFFLINE_MODE) {
        return mockFn(req, res);
    }
    return realFn(req, res, next);
};

router.get('/', protect, withMockFallback(getUsers, mockController.mockGetUsers));
router.get('/stats', protect, withMockFallback(getDirectoryStats, mockController.mockGetDirectoryStats));
router.get('/pending', protect, authorize('admin'), withMockFallback(getPendingUsers, mockController.mockGetPendingUsers));
router.get('/:id', protect, withMockFallback(getUserById, mockController.mockGetUserById));
router.put('/:id/approve', protect, authorize('admin'), withMockFallback(approveUser, mockController.mockApproveUser));
router.put('/:id/reject', protect, authorize('admin'), withMockFallback(rejectUser, mockController.mockRejectUser));

export default router;
