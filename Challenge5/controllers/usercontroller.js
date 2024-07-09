const User = require('../models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

const { Op } = require('sequelize');

//index
exports.getindex = async(req, res, next) => {
    const user = req.session.user;
    res.render('index', { user });
}
//hashing password
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt();
    user.userPassword = await bcrypt.hash(user.userPassword, salt);
  });
function validateStrongPassword(password) {
  if (password.length < 8) {
    return false;
  }
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
    if (!letterRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
      return false;
    }
    return true;
  }


exports.getRegister =async(req,res) =>{

  res.render('register', {});}
exports.postRegister = async (req, res) => {
  const { userName, userPassword, email } = req.body;
    
  if (!validateStrongPassword(userPassword)) {
    return res.render('register', { error: 'Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters.' });
  }
  const existingUser = await User.findOne({
    where: { 
      [Op.or]: [
        { userName },
        { email }
      ]
    }
  });
  if (existingUser) {
    return res.render('register', { error: 'Username or email is already taken.' });
  }
  try {
    const user = await User.create({
      userName,
      userPassword,
      email
    });
    res.redirect('/login');
  } catch (error) {
    res.render('register', { error: 'Error creating user.' });
  }
}

  exports.getLogin = (req, res, next) => {
    res.render('login', {
      path: '/login',
      pageTitle: 'login'
    });
  };
  exports.postLogin= (async (req, res) => {
    const { email, userPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(500).send('Something broke!');
    }
    const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
    if (!isPasswordValid) {
      return res.status(500).send('your password wrong try again!');
    }
    else{
      req.session.user = user;
      req.session.userId = user.id; // Store user ID in session
      res.redirect('/');
        }
  });
// delete user account 
exports.deleteUserAccount = (req, res) => {
  // user in session 
  const user = req.session.user;
  if (!user) {
    return res.redirect('/login');
  }

  const userId = req.params.id;
  User.destroy({ where: { id: userId } })
    .then(() => {
      res.redirect('/login');
    })
    .catch((error) => {
      console.error('Error deleting user account:', error);
      res.status(500).send('An error occurred while deleting the user account');
    });
}
//update user account
exports.getUpdateUserAccount = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('/login');
  }

  const userId = req.params.id;
  const userData = await User.findByPk(userId);

  res.render('update-user', { user: userData });
};

exports.postUpdateUserAccount = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('/login');
  }

  const userId = req.params.id;
  const { userName, email, phone } = req.body;

  User.update({ userName, email, phone }, { where: { id: userId } })
    .then(() => {
      res.redirect(`/profile/${userId}`);
    })
    .catch((error) => {
      console.error('Error updating user account:', error);
      res.status(500).send('An error occurred while updating the user account');
    });
};

//profile
exports.getprofile = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('profile', { user }); 
};
//logout
  exports.getLogout=async(req, res) => {
  //show that user in the session
  console.log("User in session:", req.session.user);
    req.session.destroy();
    res.redirect('/offer2/login');
};  