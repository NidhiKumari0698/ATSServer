const mongoose = require('mongoose');
const JobAndCandidate = mongoose.model('JobAndCandidate', new mongoose.Schema({
    jobPostingTitle: String,
    jobId: String,
    candidateId: String,
    candidateEmail: String,
    candidateStatus: String,
    recentResponse: [{ round: Number, interviewerEmail: String, response: String, date: String, time: String }],
    previousResponse: [{ round: Number, interviewerEmail: String, response: String, date: String, time: String }],

}));

module.exports = JobAndCandidate;