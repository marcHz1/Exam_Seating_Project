const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const buildingService = require('../services/buildingService');

const createBuilding = catchAsync(async (req, res) => {
  const building = await buildingService.createBuilding(req.body);
  res.status(201).json({ success: true, data: building });
});

const getBuildings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['building_name', 'location']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await buildingService.queryBuildings(filter, options);
  res.json({ success: true, data: result });
});

const getBuilding = catchAsync(async (req, res) => {
  const building = await buildingService.getBuildingById(req.params.buildingId);
  if (!building) return res.status(404).json({ success: false, message: 'Building not found' });
  res.json({ success: true, data: building });
});

const updateBuilding = catchAsync(async (req, res) => {
  const building = await buildingService.updateBuildingById(req.params.buildingId, req.body);
  res.json({ success: true, data: building });
});

const deleteBuilding = catchAsync(async (req, res) => {
  await buildingService.deleteBuildingById(req.params.buildingId);
  res.status(204).send();
});

module.exports = {
  createBuilding,
  getBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
};
