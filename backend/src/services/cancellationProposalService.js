const CancellationProposal = require('../models/CancellationProposal');
const SupervisorAssignment = require('../models/SupervisorAssignment');
const Supervisor = require('../models/Supervisor');
const ApiError = require('../utils/ApiError');

const createProposal = async (body, supervisorId) => {
  const assignment = await SupervisorAssignment.findById(body.supervisor_assignment_id)
    .populate('exam_hall_id');

  if (!assignment) throw ApiError.notFound('Assignment not found');
  
  // FIXED: Call .toString() on BOTH sides
  if (assignment.supervisor_id.toString() !== supervisorId.toString()) {
    throw ApiError.forbidden('You can only cancel your own assignments');
  }

  const existing = await CancellationProposal.findOne({
    supervisor_assignment_id: body.supervisor_assignment_id,
    status: 'pending',
  });
  if (existing) throw ApiError.conflict('A pending cancellation request already exists for this assignment');

  return CancellationProposal.create({
    supervisor_assignment_id: body.supervisor_assignment_id,
    supervisor_id: supervisorId,
    exam_hall_id: assignment.exam_hall_id._id,
    reason: body.reason,
  });
};

const queryProposals = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : '-createdAt';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const proposals = await CancellationProposal.find(filter)
    .populate('supervisor_id', 'full_name email')
    .populate({
      path: 'exam_hall_id',
      populate: [
        { path: 'exam_id', populate: { path: 'subject_id', select: 'subject_name' } },
        { path: 'hall_id', select: 'hall_name' }
      ]
    })
    .populate('replacement_supervisor_id', 'full_name email')
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await CancellationProposal.countDocuments(filter);
  return { proposals, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getProposalById = async (id) => {
  return CancellationProposal.findById(id)
    .populate('supervisor_id', 'full_name email')
    .populate('exam_hall_id')
    .populate('replacement_supervisor_id', 'full_name email');
};

const approveProposal = async (id, replacementId, adminResponse) => {
  const proposal = await getProposalById(id);
  if (!proposal) throw ApiError.notFound('Proposal not found');
  if (proposal.status !== 'pending') throw ApiError.badRequest('Proposal is already ' + proposal.status);

  const replacement = await Supervisor.findById(replacementId);
  if (!replacement) throw ApiError.notFound('Replacement supervisor not found');

  // Check if replacement is already assigned to this exact exam hall
  const existingAssignment = await SupervisorAssignment.findOne({
    exam_hall_id: proposal.exam_hall_id._id,
    supervisor_id: replacementId,
  });
  if (existingAssignment) {
    throw ApiError.conflict('Replacement supervisor is already assigned to this hall');
  }

  // Get the old assignment to preserve role
  const oldAssignment = await SupervisorAssignment.findById(proposal.supervisor_assignment_id);
  const role = oldAssignment ? oldAssignment.role : 'invigilator';

  // Delete old assignment
  await SupervisorAssignment.deleteOne({ _id: proposal.supervisor_assignment_id });

  // Create new assignment with replacement
  await SupervisorAssignment.create({
    exam_hall_id: proposal.exam_hall_id._id,
    supervisor_id: replacementId,
    role: role,
  });

  // Update proposal
  proposal.status = 'approved';
  proposal.replacement_supervisor_id = replacementId;
  proposal.admin_response = adminResponse || '';
  await proposal.save();

  return proposal;
};

const declineProposal = async (id, adminResponse) => {
  const proposal = await getProposalById(id);
  if (!proposal) throw ApiError.notFound('Proposal not found');
  if (proposal.status !== 'pending') throw ApiError.badRequest('Proposal is already ' + proposal.status);

  proposal.status = 'declined';
  proposal.admin_response = adminResponse || '';
  await proposal.save();

  return proposal;
};

module.exports = {
  createProposal,
  queryProposals,
  getProposalById,
  approveProposal,
  declineProposal,
};