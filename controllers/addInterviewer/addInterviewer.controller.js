const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
module.exports = {

  getInterviewerData: async (req, res) => {
    const addInterviewerData = await AddInterviewerData.find().sort('email');
    res.send(addInterviewerData);
  },

  postInterviewerData: async (req, res) => {
    // console.log('req.body',req.body);
    let addInterviewerData = new AddInterviewerData(req.body);
    addInterviewerData.save((err, result) => {
      if (err) {
        throw err;
      }
      else {
        res.send(result);
      }
    })
    // addInterviewerData = await addInterviewerData.save();
    // res.send(addInterviewerData);

    console.log('req.body.email:', req.body.email);
    console.log('req.body.password:', req.body.password)
    const logindata = new LoginData({

      email: req.body.email,
      password: req.body.password,
      role: "interviewer",
      isActive: "true"
    });

    let lData = await logindata.save();
    console.log(lData);



  }

}