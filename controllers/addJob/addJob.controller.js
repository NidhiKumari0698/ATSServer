const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
module.exports = {

  getAddJobData: async (req, res) => {
    const addjobData = await AddJobData.find();
    res.send(addjobData);
  },

  postAddJobData: async (req, res) => {

    let addjobData = new AddJobData(req.body);
    addjobData = await addjobData.save();
    res.send(addjobData);
  }

}