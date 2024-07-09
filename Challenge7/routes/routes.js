const express =require("express");
const router = express.Router();
const usercontroller = require('../controllers/controller');

router.get("/" ,usercontroller.getindex);

module.exports = router; 