const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const validation = require('../validations/cancellationProposalValidation');
const cancellationProposalController = require('../controllers/cancellationProposalController');
const { authAdmin, authSupervisor } = require('../middleware/auth');

router
  .route('/')
  .post(authSupervisor, cancellationProposalController.createProposal)
  .get(authAdmin, cancellationProposalController.getProposals);

router.get('/my', authSupervisor, cancellationProposalController.getMyProposals);

router.patch('/:proposalId/approve', authAdmin, cancellationProposalController.approveProposal);
router.patch('/:proposalId/decline', authAdmin, cancellationProposalController.declineProposal);
router.delete('/:proposalId', authAdmin, validate(validation.requestId), cancellationProposalController.deleteProposal);

module.exports = router;