const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const studentValidation = require('../validations/studentValidation');
const adminController = require('../controllers/adminController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, adminController.createAdmin)
  .get(authAdmin, adminController.getAdmins);

router
  .route('/:adminId')
  .get(authAdmin, adminController.getAdmin)
  .patch(authAdmin, adminController.updateAdmin)
  .delete(authAdmin, adminController.deleteAdmin);

module.exports = router;
