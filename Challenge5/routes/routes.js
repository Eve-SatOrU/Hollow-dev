const express =require("express");
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');

router.get("/" ,usercontroller.getindex);
router.get("/register" ,usercontroller.getRegister);
router.post("/register" ,usercontroller.postRegister);
// router.get("/login" ,usercontroller.getLogin);
// router.post("/login" ,usercontroller.postLogin);
router.get("/logout" ,usercontroller.getLogout);

module.exports = router; 