import express from 'express';
import {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
    logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

import * as mockController from '../controllers/mockController.js';

const router = express.Router();

const withMockFallback = (realFn, mockFn) => (req, res, next) => {
    if (global.OFFLINE_MODE) {
        return mockFn(req, res);
    }
    return realFn(req, res, next);
};

router.post('/register', withMockFallback(register, mockController.mockRegister));
router.post('/login', withMockFallback(login, mockController.mockLogin));
router.post('/logout', protect, logout);
router.get('/me', (req, res, next) => {
    if (global.OFFLINE_MODE) return mockController.mockGetMe(req, res);
    return protect(req, res, () => getMe(req, res, next));
});

router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

export default router;
