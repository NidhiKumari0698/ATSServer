const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
const encryptPassword = require(`../../utilities/hashPassword`)
module.exports = {
    getCandidates: async (req, res) => {
        const candidateData = await CandidateData.find().sort('PersonalInfo.email');
        res.send(candidateData);
        //console.log('candidateData',candidateData);
    },
    // other methods
    getCandidateJobs: async (req, res) => {
        const thisCandidate = await CandidateData.findOne({ '_id': req.params.loginId });
        var jobarr = [];
        if (thisCandidate) {
            console.log('##########$$$$$$$', thisCandidate.JobDetails);
            for (var i = 0; i < thisCandidate.JobDetails.length; i++) {
                var obj = thisCandidate.JobDetails[i];
                jobarr.push(obj);
            }
        }
        res.json(jobarr);

    },
    getCandidateById:async (req,res)=>{
       const candidate=await CandidateData.findOne({'_id':req.params.loginId});
       console.log('inside getCandidateById')
       console.log('candidate found:',(!candidate))
       if(candidate)
       {
           res.json(candidate);
       }
    },

    updateCandidateById:async(req,res)=>{

console.log('inside updateCandidateById');
console.log('id:',req.params.loginId);
console.log('body:',req.body);
       CandidateData.findByIdAndUpdate({'_id':req.params.loginId},{
           'PersonalInfo.firstname':req.body.PersonalInfo.firstname,
           'PersonalInfo.lastname':req.body. PersonalInfo.lastname,
           'PersonalInfo.mobile':req.body.   PersonalInfo.mobile,
           'PersonalInfo.address':req.body.PersonalInfo.address,
          
           AcademicDetails:req.body.AcademicDetails,
           ReferenceDetails:req.body.ReferenceDetails,
           WorkExperience:req.body.WorkExperience,

       },function(err,result){
           if(err) res.json(err)
           else{
               console.log('result in updateCandidateById',result)
               res.json({success:true,message:'updated successfully'})
           }
       })
    },
    //WHEN A CANDIDATE IS APPLYING FOR MORE THAN ONE JOB (req=>{candLoginId,jobId}) 
    setCandidates2:async(req,res)=>{
    // check if candidate is applying for same job
    let getCand=await CandidateData.findById({_id:req.body.candLoginId})
    
    if(getCand)
    {
        console.log('candidate found');
        
        let JobDetails=getCand.JobDetails
        
        let value3=await JobDetails.find(c=>c.jobId==req.body.jobId)
         // if candidate is applying for same job
         console.log("value3 is",(!value3))
        if(value3)
        {
            res.json({message:'YOU HAVE ALREADY APPLIED FOR THIS JOB'})
            return;
        }
         // if applying candidate is applying for different job
         else{
              //then push the jobId in candidate job field
              let jobdata=await AddJobData.findOne({_id:req.body.jobId})
              let postingTitle=jobdata.posting_title;
              var obj2={
                jobId: '',
                jobPostingTitle:''
              }
              obj2.jobId=req.body.jobId;
              obj2.jobPostingTitle=postingTitle;
              getCand.JobDetails.push(obj2);
              await getCand.save()

              //and push the candidate in job's candidate field
              var obj3={ candidateId: '', candidateEmail:'' }
              obj3.candidateId=req.body.candLoginId
              obj3.candidateEmail=getCand.PersonalInfo.email
              jobdata.candidateDetails.push(obj3)
              jobdata.save()

              // and make a new combination jobId and candId

              var datanew2= {
                jobId: req.body.jobId,
                jobPostingTitle: jobdata.posting_title,
                candidateId: req.body.candLoginId,
                candidateEmail: getCand.PersonalInfo.email,
                candidateStatus: 'pending'
            }

            let d2= new JobAndCandidate(datanew2);
            d2 = await d2.save();
            res.json({message:'SUCCESSFULLY APPLIED FOR JOB'})

         }
       }
   },
    // 
    
    setCandidates: async (req, res) => {
        console.log('inside setCandidates')
        console.log('req.body:',req.body)
        console.log('given email :',req.body.PersonalInfo.email)
        // CANDIDATE IS UNIQUE OR NOT
        const datas=await CandidateData.findOne({'PersonalInfo.email':req.body.PersonalInfo.email})
        console.log('datas:',datas)
        // WHEN CANDIDATE IS UNIQUE
        if (!datas) {
            console.log('this candidate is unique');
            // REGISTERING UNIQUE CANDIDATE DATA
            let candidatedata = new CandidateData(req.body)
            candidatedata = await candidatedata.save();
            //console.log('candidate data is:',candidatedata)
            let senddata=candidatedata;
           // console.log('cand id is:',senddata)
            // ADDING CANDIDATE IN LIST OF CANDIDATE IN AddJobData's TABLE 
            const addjobdata = await AddJobData.find();
            for (var k = 0; k < addjobdata.length; k++) {
                if (addjobdata[k]._id == req.body.JobDetails.jobId) {
                    var obj = { candidateId: '', candidateEmail: '' };
                    obj.candidateId = candidatedata._id;
                    obj.candidateEmail = candidatedata.PersonalInfo.email;
                    addjobdata[k].candidateDetails.push(obj);
                    let a = await (addjobdata[k]).save();
                    break;


                }
            }
            // 

            //DECRYPTING PASSWORD 
            const decryptpass = await encryptPassword.encryptPassword(req.body.password)
            // 
            // REGISTERING THIS CANDIDATE IN LOGIN DATA
            const logindata = new LoginData({
                email: req.body.PersonalInfo.email,
                password: decryptpass,
                role: "candidate",
                isActive: "true",
                loginId: candidatedata._id

            });

            let lData = await logindata.save();
            // 
            //REGISTERING JOB AND CANDIDATE UNIQUE COMBINATION IN JobAndCAndidate TABLE 
            var datanew = {
                jobId: req.body.JobDetails.jobId,
                jobPostingTitle: req.body.JobDetails.jobPostingTitle,
                candidateId: candidatedata._id,
                candidateEmail: candidatedata.PersonalInfo.email,
                candidateStatus: 'pending'
            }

            let d = new JobAndCandidate(datanew);
            d = await d.save();
            // 
            console.log('cand id is:',senddata._id)
            res.json({success:true ,message:"Data Saved Successfully",data:senddata});
        }

        // else
        // {
        //     res.json({success:true ,message:"You are not a unique candidate"});
        // }

    }
}



        // 
        // WHEN CANDIDATE IS NOT UNIQUE
       // else {
            //CHECKING CANDIDATE APPLYING FOR SAME JOB 
            // var alljob = [];
            // alljob.push(candidate.JobDetails);
            // var value2 = 1;
            // for (var j = 0; j < candidate.JobDetails.length; j++) {
            //     if (candidate.JobDetails[j].jobPostingTitle == req.body.JobDetails.jobPostingTitle) {
            //         value2 = 0;
            //         break;
            //     }
            // }
            //
            //WHEN CANDIDATE IS APPLIED FOR DIFFERENT JOB 
            // if (value2) {
            //     var obj = req.body.JobDetails;
            //     alljob.push(obj);
            //     candidate.JobDetails.push(obj);
            //     let candidatedata = await candidate.save();
            //     const addjobdata = await AddJobData.find();
            //     for (var k = 0; k < addjobdata.length; k++) {
            //         if (addjobdata[k]._id == req.body.JobDetails.jobId) {
            //             var obj = { candidateId: '', candidateEmail: '' };
            //             obj.candidateId = candidatedata._id;
            //             obj.candidateEmail = candidatedata.PersonalInfo.email;
            //             addjobdata[k].candidateDetails.push(obj);
            //             let a = await (addjobdata[k]).save();
            //             break;


            //         }
            //     }
            //     var datanew = {
            //         jobId: req.body.JobDetails.jobId,
            //         jobPostingTitle: req.body.JobDetails.jobPostingTitle,
            //         candidateId: candidatedata._id,
            //         candidateEmail: candidatedata.PersonalInfo.email,
            //         candidateStatus: 'pending'
            //     }


            //     let d = new JobAndCandidate(datanew);
            //     d = await d.save();
            //     res.send(d);




            // }
            //  
            // WHEN SAME CANDIDATE IS APPLYING FOR SAME JOB
            // else {
            //     res.json({success:true,message:"You Have already applied for this job"})
            //     console.log('this candidate is already aplied for this job');
            // }
            // 
       // }
        // 

