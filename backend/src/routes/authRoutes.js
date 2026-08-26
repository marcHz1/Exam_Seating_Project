const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const authValidation = require('../validations/authValidation');
const authController = require('../controllers/authController');
const { authStudent, authAdmin, authSupervisor } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public auth routes with rate limiting
router.post('/student/login', authLimiter, validate(authValidation.loginStudent), authController.loginStudent);
router.post('/admin/login', authLimiter, validate(authValidation.loginAdmin), authController.loginAdmin);
router.post('/supervisor/login', authLimiter, validate(authValidation.loginSupervisor), authController.loginSupervisor);

// Protected me routes
router.get('/student/me', authStudent, authController.getMe);
router.get('/admin/me', authAdmin, authController.getMe);
router.get('/supervisor/me', authSupervisor, authController.getMe);

module.exports = router;
