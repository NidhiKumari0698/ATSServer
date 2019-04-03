const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
module.exports = {
  getjobAndCandidate: async (req, res) => {
    const jobAndCandidate = await JobAndCandidate.find();
    // console.log('inside get job and candidate and data is:',jobAndCandidate)
    res.json(jobAndCandidate);
  },
  setjobAndCandidate: async (req, res) => {
    let data = new JobAndCandidate(req.body);
    data = await data.save();
  },
  getjobAndCandidateDetails: async (req, res) => {
    if ((!req.params.jobId) || (!req.params.loginId)) {
      res.json({ status: 'empty request' });
    }
    let jobandcandidate = await JobAndCandidate.findOne({ jobId: req.params.jobId,candidateId:req.params.loginId });
    res.json(jobandcandidate);

  },
  updateStatus: async (req, res) => {
    if ((!req.params.jobId) || (!req.params.candidateId)) {
      res.json({ status: 'empty request' });
    }
    let jobandcandidate = await JobAndCandidate.findOne({ jobId: req.params.jobId, candidateId: req.params.candidateId });
    jobandcandidate.candidateStatus = req.body.status;
    jobandcandidate = await jobandcandidate.save();
    res.json(jobandcandidate)
    // jobandcandidate.save((err, saved)=>{
    //   res.json(saved);
    // });


  },
  updateRecentResponse: async (req, res) => {
    if ((!req.params.jobId) || (!req.params.candidateId)) {
      res.json({ status: 'empty request' });
    }
    let jobandcandidate = await JobAndCandidate.findOne({ jobId: req.params.jobId, candidateId: req.params.candidateId });
    console.log('inside updateRecentResponse')
    console.log('jobandcandidate is:',jobandcandidate)
    console.log('recent response length is:',jobandcandidate.recentResponse.length)
    if ((jobandcandidate.recentResponse.length) > 0) {
      var obj = jobandcandidate.recentResponse[0];
      console.log('obj is:',jobandcandidate.recentResponse[0])
      jobandcandidate.previousResponse.push(obj);
      console.log('previous response is:',jobandcandidate.previousResponse)
      jobandcandidate.recentResponse = new Array();
      console.log('recent response is:',jobandcandidate.recentResponse)
      jobandcandidate.recentResponse.push(req.body);
      console.log('after pushing data recent response is:',jobandcandidate.recentResponse)
      
    }
    else {
      jobandcandidate.recentResponse.push(req.body);
      console.log(jobandcandidate.recentResponse)
    }
    jobandcandidate.save((err, saved) => {
      res.json({saved})
    });



  },

}