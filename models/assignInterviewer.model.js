const mongoose = require('mongoose')

const AssignInterviewerData = mongoose.model('AssignInterviewerData', new mongoose.Schema({
  candidate_email: String,
  candidate_id: String,
  interviewer_email: String,
  date: String,
  time: String,
  jobPostingTitle: String,
  jobId: String,
  round: Number,
  resume: String,
  video: String,
  active: Number,
}));

module.exports = AssignInterviewerData;