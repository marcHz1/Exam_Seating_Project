const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');
const { authAdmin } = require('../middleware/auth');

router
  .route('/')
  .post(authAdmin, buildingController.createBuilding)
  .get(authAdmin, buildingController.getBuildings);

router
  .route('/:buildingId')
  .get(authAdmin, buildingController.getBuilding)
  .patch(authAdmin, buildingController.updateBuilding)
  .delete(authAdmin, buildingController.deleteBuilding);

module.exports = router;
