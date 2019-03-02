const mongoose = require('mongoose')

const AddInterviewerData = mongoose.model('AddInterviewerData', new mongoose.Schema({
  // name:String,
  email: String,
  mobile: Number,
  role: String
}));

module.exports = AddInterviewerData