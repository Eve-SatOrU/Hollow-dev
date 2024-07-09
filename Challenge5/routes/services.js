const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.get('/list', servicesController.listServices);
router.post('/start', servicesController.startService);
router.post('/stop', servicesController.stopService);

module.exports = router;