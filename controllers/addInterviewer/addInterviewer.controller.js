const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
const encryptPassword = require('../../utilities/hashPassword')
module.exports = {

  getInterviewerData: async (req, res) => {
    const addInterviewerData = await AddInterviewerData.find().sort('email');
    res.send(addInterviewerData);
  },

  postInterviewerData: async (req, res) => {

    let addInterviewerData = new AddInterviewerData(req.body);
    addInterviewerData.save(async (err, result) => {
      if (err) {
        throw err;
      }
      else {
        res.send({success:true,message:"data saved successfully"});
        //BCRPT PASSWORD
        const decryptpass = await encryptPassword.encryptPassword(req.body.password)
        // 


        const logindata = new LoginData({

          email: req.body.email,
          password: decryptpass,
          role: "interviewer",
          isActive: "true",
          loginId: result._id
        });

        let lData = await logindata.save();
        console.log(lData);
      }
    })
    // addInterviewerData = await addInterviewerData.save();
    // res.send(addInterviewerData);





  }

}