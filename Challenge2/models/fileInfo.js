const mongoose = require('mongoose');

const fileInfoSchema = new mongoose.Schema({
    filename: String,
    size: String,
    description: String,
    mime_type: String,
});

const fileInfoModel = mongoose.model("files_info",fileInfoSchema);

module.exports = fileInfoModel;