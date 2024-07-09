const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const validatefile = require('../middlewares/validation');
const { userRegister, userLog} = require('../controllers/fileController');


// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', 'upload')); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});

// Multer instance with configuration
const upload = multer({ storage: storage });
router.get('/', getFiles);
router.get('/:id', getFileByID);

router.post('/', validatefile, upload.single('file'), function (req, res) {
    res.json({ message: 'Uploaded Successfully!', file: req.file });
});

router.patch('/:id', validatefile, updateFileInfoByID);
router.delete('/:id', deleteFileByID);

module.exports = router;