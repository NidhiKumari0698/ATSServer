const mongoose = require('mongoose');
const LoginData = mongoose.model('LoginData', new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  isActive: String,
  //loginId:String


}));

module.exports = LoginData;  