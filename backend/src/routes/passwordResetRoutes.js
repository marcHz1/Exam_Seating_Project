const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const validation = require('../validations/passwordResetValidation');
const controller = require('../controllers/passwordResetController');
const { authAdmin } = require('../middleware/auth');

router.post('/', validate(validation.createRequest), controller.createRequest);
router.get('/', authAdmin, validate(validation.getRequests), controller.getRequests);
router.patch('/:requestId/approve', authAdmin, validate(validation.approveRequest), controller.approveRequest);
router.patch('/:requestId/decline', authAdmin, validate(validation.requestId), controller.declineRequest);
router.delete('/:requestId', authAdmin, validate(validation.requestId), controller.deleteRequest);

module.exports = router;
