const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    questions: [{ type: String, required: true }],
    responses: [{ type: Map, of: String }]
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);