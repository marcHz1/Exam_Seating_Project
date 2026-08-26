const Building = require('../models/Building');
const Hall = require('../models/Hall');
const ApiError = require('../utils/ApiError');

const createBuilding = async (body) => {
  return Building.create(body);
};

const queryBuildings = async (filter, options) => {
  const { sortBy, limit = 10, page = 1 } = options;
  const sort = sortBy ? sortBy.split(':').join(' ') : 'building_name';
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const buildings = await Building.find(filter)
    .sort(sort)
    .limit(parseInt(limit, 10))
    .skip(skip);

  const count = await Building.countDocuments(filter);
  return { buildings, totalPages: Math.ceil(count / limit), currentPage: page, total: count };
};

const getBuildingById = async (id) => {
  return Building.findById(id);
};

const updateBuildingById = async (id, body) => {
  const building = await getBuildingById(id);
  if (!building) throw ApiError.notFound('Building not found');
  Object.assign(building, body);
  await building.save();
  return building;
};

const deleteBuildingById = async (id) => {
  const building = await getBuildingById(id);
  if (!building) throw ApiError.notFound('Building not found');
  
  // BLOCK: Cannot delete if halls exist
  const hallCount = await Hall.countDocuments({ building_id: id });
  if (hallCount > 0) {
    throw ApiError.badRequest('Cannot delete building with existing halls. Delete halls first.');
  }
  
  await Building.deleteOne({ _id: id });
  return building;
};

module.exports = {
  createBuilding,
  queryBuildings,
  getBuildingById,
  updateBuildingById,
  deleteBuildingById,
};