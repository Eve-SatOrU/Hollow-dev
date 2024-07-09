const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userInfoSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  
});

userInfoSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    //Hash the password before saving the user to the db
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const userInfoModel = mongoose.model('user_info', userInfoSchema);

module.exports = userInfoModel;
