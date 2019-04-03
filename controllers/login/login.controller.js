
const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
const hashPassword = require('../../utilities/hashPassword')
const generateToken = require('../../utilities/generateToken')
module.exports = {
    getLoginData: async (req, res) => {
        console.log('inside getLoginData')
        console.log('email is:',req.body.email)
        
        const loginData = await LoginData.findOne({ email: req.body.email }).sort('email');
        if(!loginData){
            res.json({success:false,message:'email not registered'})
            return
        }
        let password = loginData.password;
        

        // decrypt password (req.body(email, password))
        const isValid = await hashPassword.decryptPassword(req, password)
       
        if(!isValid)
        {
            res.json({success:false,message:'Password Incorrect'})
            return
        } 
        
        // generate token
        let role = loginData.role;
        let loginId = loginData.loginId;
        console.log('role is:',role)
        console.log('loginId is',loginId)

        const token = generateToken.token(role, loginId, "nidhikey")
        console.log('token is',token)

        res.json({success : true, token : token})
        //res.json(loginData);
    }
}