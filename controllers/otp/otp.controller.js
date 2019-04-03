const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
const encryptPassword = require(`../../utilities/hashPassword`)
const Otp=require('../../models/otp.model')
const Request=require('request')

module.exports={
    createOtp: (req, res) => {
        console.log('inside createOtp')
        console.log('req body of createOtp is:',req.body)
        let valueOtp = Math.floor(100000 + Math.random() * 900000);
        let otpInfo = new Otp({
          userId: req.body.userId,
          role: req.body.role,
          timestamp: Date.now(),
          valueOtp: valueOtp,
          type: req.body.type,
          expiry: ""
        });
        // send message on user phone
        CandidateData.findById(req.body.userId, (err, res) => {
          if (err) throw err;
          console.log('mobile is:',res.PersonalInfo.mobile)
          Request.get(
            `https://2factor.in/API/V1/a0dca13c-3f4c-11e9-8806-0200cd936042/SMS/${res.PersonalInfo.mobile}/${valueOtp}`,
            (err, msg) => {
              if (err) throw err;
              console.log("Message Sent");
            }
          );
        });
        otpInfo.save((err, data) => {
          if (err) throw err;
          else console.log("otp generated");
          res.status(200).send({ data });
        });
      },
      matchOtp: (req, res) => {
          console.log('inside matchOtp')
          console.log('params of matchOtp is',req.params)
        Otp.findOne(
          { userId: req.params.candidateId, valueOtp: req.params.otp },
          (err, data) => {
            if (err) throw err;
            let status = "true";
    
            if (data === null) {
              status = "false";
              res.status(200).send({ status: status });
            } else {
              console.log("Hey mad ", req.params.candidateId);
              CandidateData.findByIdAndUpdate(
                req.params.candidateId,
                {
                  $set: { isVerifiedOtp: true }
                },
                { new: true },
                (err, saved) => {
                  console.log(saved);
                  res.status(200).send({ status: status });
                }
              );
            }
          }
        );
      }
    };
    
