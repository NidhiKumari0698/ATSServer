const mongoose = require('mongoose')
const AddJobData = mongoose.model('AddJobData', new mongoose.Schema({
  posting_title: String,
  city: String,
  state: String,
  country: String,
  date_open: String,
  date_close: String,
  job_type: String,
  salary: String,
  position_summary:[ {position_summary:String}],
  job_respo:[{job_respo:String} ],
  exp: String,
  candidateDetails: [{ candidateId: String, candidateEmail: String }]

}));

module.exports = AddJobData;
