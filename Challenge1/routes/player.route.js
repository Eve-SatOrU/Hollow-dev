const express = require('express');
const player = require('../models/player.model.js');
const router = express.Router();
const validatePlayer = require('../middleware/validation.js');
const {getplayers,getplayer,createplayer, updatedplayer, deleteplayer} = require('../controllers/player.controller.js');


router.get('/', getplayers);
router.get("/:id",getplayer);
router.post("/",validatePlayer,createplayer);
router.put("/:id",validatePlayer,updatedplayer);
router.delete("/:id",deleteplayer);



module.exports=router;