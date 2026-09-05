const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const cancellationProposalService = require('../services/cancellationProposalService');

const createProposal = catchAsync(async (req, res) => {
  const proposal = await cancellationProposalService.createProposal(req.body, req.user._id);
  res.status(201).json({ success: true, data: proposal });
});

const getProposals = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await cancellationProposalService.queryProposals(filter, options);
  res.json({ success: true, data: result });
});

const getMyProposals = catchAsync(async (req, res) => {
  const filter = { supervisor_id: req.user._id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await cancellationProposalService.queryProposals(filter, options);
  res.json({ success: true, data: result });
});

const approveProposal = catchAsync(async (req, res) => {
  const proposal = await cancellationProposalService.approveProposal(
    req.params.proposalId,
    req.body.replacement_supervisor_id,
    req.body.admin_response
  );
  res.json({ success: true, data: proposal });
});

const declineProposal = catchAsync(async (req, res) => {
  const proposal = await cancellationProposalService.declineProposal(
    req.params.proposalId,
    req.body.admin_response
  );
  res.json({ success: true, data: proposal });
});

const deleteProposal = catchAsync(async (req, res) => {
  await cancellationProposalService.deleteProposal(req.params.proposalId);
  res.status(204).send();
});

module.exports = {
  createProposal,
  getProposals,
  getMyProposals,
  approveProposal,
  declineProposal,
  deleteProposal,
};