import express from 'express';
import {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getJobStats,
    applyJob
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

import * as mockController from '../controllers/mockController.js';

const router = express.Router();

// Helper to switch between real and mock controllers
const withMockFallback = (realFn, mockFn) => (req, res, next) => {
    if (global.OFFLINE_MODE) {
        return mockFn(req, res);
    }
    return realFn(req, res, next);
};

router.get('/', (req, res, next) => {
    if (global.OFFLINE_MODE) return mockController.mockGetJobs(req, res);
    return getJobs(req, res, next);
});
router.get('/stats', protect, getJobStats);
router.get('/my/posts', protect, getMyJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('alumni', 'recruiter', 'admin'), withMockFallback(createJob, mockController.mockCreateJob));
router.put('/:id', protect, updateJob);
// Middleware to mock protect if needed
const mockProtect = (req, res, next) => {
    if (req.headers.authorization) return next();
    return res.status(401).json({ message: 'Not authorized' });
};


router.post('/apply', protect, (req, res, next) => {
    console.log('Jobs: Apply request received');
    console.log('Body:', req.body);
    console.log('User:', req.user ? req.user.id : 'No user');
    next();
}, withMockFallback(applyJob, mockController.mockApplyJob));
router.delete('/:id', protect, deleteJob);

export default router;
