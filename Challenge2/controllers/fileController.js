// controllers/fileController.js
const fs = require('fs');
const path = require('path');
const fileInfoModel = require('../models/fileInfo.js');
const { authorize, uploadFileToDrive } = require('../services/googleDrive'); // Adjust path as necessary

const getFiles = async function (req, res) {
    try {
        const data = await fileInfoModel.find({});
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getFileByID = async function(req, res) {
    try {
        const id = req.params.id;
        const file = await fileInfoModel.findOne({ _id: id });
        res.json(file);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const uploadFile = async function(req, res) {
    try {
        const { originalname, mimetype, size } = req.file;
        const filePath = path.join(__dirname, '..', 'upload', originalname);

        // Save file info to database
        const fileInfo = new fileInfoModel({
            filename: originalname,
            size: size.toString(),
            description: req.body.description || '',
            mime_type: mimetype
        });
        await fileInfo.save();

        // Upload a copy to Google Drive
        const authClient = await authorize();
        const driveFile = await uploadFileToDrive(authClient, filePath, originalname);

        res.json({ message: 'Uploaded Successfully!', file: fileInfo, driveFileId: driveFile.id });
    } catch (error) {
        console.error('Error during upload:', error);
        res.status(500).send(error.message);
    }
};

const updateFileInfoByID = async function(req, res){
    try {
        const id = req.params.id;
        const updates = req.body;

        const file = await fileInfoModel.findOneAndUpdate({ _id: id }, updates, { new: true });

        if (!file) {
            return res.status(404).send('File not found');
        }

        res.json({ message: 'File updated successfully', file });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteFileByID = async function(req, res) {
    try {
        const id = req.params.id;
        const file = await fileInfoModel.findOne({ _id: id });

        if (!file) {
            return res.status(404).send('File not found');
        }

        fs.unlink(path.join(__dirname, '..', 'upload', file.filename), async (err) => {
            if (err) {
                return res.status(500).send('Error deleting file from server');
            }

            await fileInfoModel.findByIdAndDelete(id);
            res.send('File deleted successfully');
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getFiles,
    getFileByID,
    uploadFile,
    updateFileInfoByID,
    deleteFileByID
};
