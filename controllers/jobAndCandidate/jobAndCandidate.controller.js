const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
module.exports = {
  getjobAndCandidate: async (req, res) => {
    const jobAndCandidate = await JobAndCandidate.find();
    res.send(jobAndCandidate);
  },
  setjobAndCandidate: async (req, res) => {
    let data = new JobAndCandidate(req.body);
    data = await data.save();
  },
  getjobAndCandidateDetails: async (req, res) => {
    if ((!req.params.jobId) || (!req.params.candidateEmail)) {
      res.json({ status: 'empty request' });
    }
    console.log('jobId is:', req.params.jobId);
    console.log('candidateEmail is:', req.params.candidateEmail);
    console.log('you are here at /jobAndCandidate/Details');
    let jobandcandidate = await JobAndCandidate.findOne({ jobId: req.params.jobId, candidateEmail: req.params.candidateEmail });
    console.log('jobandcandidate is:', jobandcandidate);
    res.json(jobandcandidate);

  },
  updateStatus: async (req, res) => {
    if ((!req.params.jobId) || (!req.params.candidateId)) {
      res.json({ status: 'empty request' });
    }
    console.log('req status is', req.body.status);
    console.log('you are here at jobAndCandidate/status');
    let jobandcandidate = await JobAndCandidate.findOne({ jobId: req.params.jobId, candidateId: req.params.candidateId });
    console.log('jobandcandidate is:', jobandcandidate);
    jobandcandidate.candidateStatus = req.body.status;
    jobandcandidate = await jobandcandidate.save();
    console.log(jobandcandidate.status, 'status');
    // jobandcandidate.save((err, saved)=>{
    //   res.json(saved);
    // });

    console.log(jobandcandidate);

  },
  updateRecentResponse: async (req, res) => {
    console.log('you are here at /jobAndCandidate/recentResponse')
    if ((!req.params.jobId) || (!req.params.candidateId)) {
      res.json({ status: 'empty request' });
      console.log("empty status");
    }
    let jobandcandidate = await JobAndCandidate.findOne({ jobId: req.params.jobId, candidateId: req.params.candidateId });
    console.log(' data is', jobandcandidate);
    console.log('length of recent data is', jobandcandidate.recentResponse.length);
    if ((jobandcandidate.recentResponse.length) > 0) {
      var obj = jobandcandidate.recentResponse[0];
      jobandcandidate.previousResponse.push(obj);
      console.log('obj is', obj);
      jobandcandidate.recentResponse = new Array();
      jobandcandidate.recentResponse.push(req.body);
    }
    else {
      console.log('length of recent data is', jobandcandidate.recentResponse.length);
      jobandcandidate.recentResponse.push(req.body);
    }
    jobandcandidate.save((err, saved) => {
      //res.json(saved);
      console.log(saved);
    });



  },

}