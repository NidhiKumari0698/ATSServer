const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
module.exports = {
  getAssignInterviewerDetails: async (req, res) => {
    if ((!req.params.jobId) || (!req.params.candidateEmail)) {
      res.json({ status: 'empty request' });
    }
    console.log('req status is', req.body.status);
    console.log('you are here at /assignInterviewerData/Details');
    let assigndata = await AssignInterviewerData.findOne({ jobId: req.params.jobId, candidate_email: req.params.candidateEmail });
    console.log('jobandcandidate is:', assigndata);
    res.json(assigndata);

  },
  getAssignInterviewerData: async (req, res) => {
    const assignInterviewerData = await AssignInterviewerData.find();
    res.send(assignInterviewerData);
  },

  postAssignInterviewerData: async (req, res) => {

    console.log("body in post is:" + JSON.stringify(req.body));
    //const assignInterviewerData = await AssignInterviewerData.find({});
    //console.log('full assign interviewer data is:',assignInterviewerData);
    // let assigninterviewerdata= await AssignInterviewerData.findOne({jobId:req.body.jobId,candidateId:req.body.candidate_id});

    AssignInterviewerData.findOne({ candidate_id: req.body.candidate_id, jobId: req.body.jobId }, async (err, assigninterviewerdata) => {
      if (err) console.log(err);
      console.log(assigninterviewerdata);
      if (!assigninterviewerdata) {
        console.log('hghfhgfg');
        let assigninterviewerData = new AssignInterviewerData(req.body);
        assigninterviewerData = await assigninterviewerData.save();
        console.log("assignInterviewerdata API", assigninterviewerData);
        res.send(assigninterviewerData);
        console.log('round before:', assigninterviewerData.round);
        assigninterviewerData.round = 0;
        console.log('round after:', assigninterviewerData.round);
        assigninterviewerData.save((err, saved) => {
          //res.json(saved);
        });
      } else {
        console.log('this details need to be updated', assigninterviewerdata);
        var round = assigninterviewerdata.round;
        console.log('round before', round);
        assigninterviewerdata.round = (round + 1);
        console.log('round after', assigninterviewerdata.round);
        assigninterviewerdata.interviewer_email = req.body.interviewer_email;
        assigninterviewerdata.date = req.body.date;
        assigninterviewerdata.time = req.body.time;
        assigninterviewerdata.active = 1;
        assigninterviewerdata.save((err, saved) => {
          //res.json(saved);
        });

      }
    });
  },

  postActiveAssignInterviewerData: (req, res) => {
    if ((!req.params.jobId) || (!req.params.candidateId)) {
      res.json({ status: 'empty request' });
    }
    console.log('you are inside /assignInterviewerData/active')
    console.log('req status is', req.body.active);

    AssignInterviewerData.findOneAndUpdate({ jobId: req.params.jobId, candidate_id: req.params.candidateId }, {
      $set: {
        active: req.body.active
      }
    }, { new: true }, (err, assigninterviewerdata1) => {

      console.log('assigninterviewerdata1 is:', assigninterviewerdata1);
      console.log(assigninterviewerdata1);
    });


  }

}