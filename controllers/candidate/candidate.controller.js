const CandidateData = require('../../models/candidate.model')
const AddJobData = require('../../models/AddJob.model')
const LoginData = require('../../models/Login.model')
const JobAndCandidate = require('../../models/JobAndCandidate.model')
const AssignInterviewerData = require('../../models/assignInterviewer.model')
const AddInterviewerData = require('../../models/addInterviewer.model')
module.exports = {
    getCandidates: async (req, res) => {
        const candidateData = await CandidateData.find().sort('PersonalInfo.email');
        res.send(candidateData);
        //console.log('candidateData',candidateData);
    },
    // other methods
    getCandidateJobs: async (req, res) => {
        console.log(req.params.candidateEmail);
        console.log('inside /candidateData/job/');
        const thisCandidate = await CandidateData.findOne({ 'PersonalInfo.email': req.params.candidateEmail });
        //console.log('candidate details is:',thisCandidate);
        console.log('MMMMMMMM', (!thisCandidate));
        var jobarr = [];
        if (thisCandidate) {
            console.log('##########$$$$$$$', thisCandidate.JobDetails);
            for (var i = 0; i < thisCandidate.JobDetails.length; i++) {
                var obj = thisCandidate.JobDetails[i];
                jobarr.push(obj);
            }
        }
        console.log('job arr is', jobarr)
        res.json(jobarr);

    },
    setCandidates: async (req, res) => {
        // CANDIDATE IS UNIQUE OR NOT
        const datas = await CandidateData.find().sort('email');
        var value = 1;
        var index;
        var candidate = {};
        for (var i = 0; i < datas.length; i++) {
            console.log('email in list this time  is:', datas[i].PersonalInfo.email);
            console.log('get email is:', req.body.PersonalInfo.email);
            if (datas[i].PersonalInfo.email == req.body.PersonalInfo.email) {
                console.log('candidate matched');
                value = 0;
                candidate = datas[i];
                index = i;
                break;

            }
        }
        // 
        // WHEN CANDIDATE IS UNIQUE
        if (value) {
            console.log('this candidate is unique');
            // REGISTERING UNIQUE CANDIDATE DATA
            let candidatedata = new CandidateData(req.body)
            candidatedata = await candidatedata.save();
            res.send(candidatedata);
            // ADDIND CANDIDATE IN LIST OF CANDIDATE IN AddJobData's TABLE 
            const addjobdata = await AddJobData.find();
            for (var k = 0; k < addjobdata.length; k++) {
                console.log('addjobdata[k].JobDetails.jobId is:', addjobdata[k]._id);
                console.log('req.body.JobDetails.jobId is:', req.body.JobDetails.jobId);
                console.log('addjobdata[k].JobDetails.jobPostingTitle is:', addjobdata[k].posting_title);
                console.log('req.body.JobDetails.jobPostingTitle is_id:', req.body.JobDetails.jobPostingTitle);
                if (addjobdata[k]._id == req.body.JobDetails.jobId) {
                    console.log(`one more candidate is applied for ${addjobdata[k].posting_title}`)
                    console.log('candidatedata._id is:', candidatedata._id);
                    console.log('candidatedata.PersonalInfo.email is:', candidatedata.PersonalInfo.email)
                    var obj = { candidateId: '', candidateEmail: '' };
                    obj.candidateId = candidatedata._id;
                    obj.candidateEmail = candidatedata.PersonalInfo.email;
                    addjobdata[k].candidateDetails.push(obj);
                    let a = await (addjobdata[k]).save();
                    console.log('a', a);
                    break;


                }
            }
            // 

            // REGISTERING THIS CANDIDATE IN LOGIN DATA
            const logindata = new LoginData({
                email: req.body.PersonalInfo.email,
                password: req.body.password,
                role: "candidate",
                isActive: "true"
            });

            let lData = await logindata.save();
            console.log(lData);
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
        }
        // 
        // WHEN CANDIDATE IS NOT UNIQUE
        else {
            console.log('this candidate is not unique');
            //CHECKING CANDIDATE APPLYING FOR SAME JOB 
            var alljob = [];
            alljob.push(candidate.JobDetails);
            var value2 = 1;
            console.log('all available jobs are;', alljob);
            console.log('all candidate.jobDetails is:', candidate.JobDetails);
            for (var j = 0; j < candidate.JobDetails.length; j++) {
                console.log('candidate.JobDetails.jobPostingTitle is:', candidate.JobDetails[j].jobPostingTitle);
                console.log('req.body.JobDetails.jobPostingTitle is:', req.body.JobDetails.jobPostingTitle);
                if (candidate.JobDetails[j].jobPostingTitle == req.body.JobDetails.jobPostingTitle) {
                    console.log('this candidate is already applied for this job');
                    value2 = 0;
                    break;
                }
            }
            //
            //WHEN CANDIDATE IS APPLIED FOR DIFFERENT JOB 
            if (value2) {
                var obj = req.body.JobDetails;
                alljob.push(obj);
                console.log('alljob is:', alljob);
                candidate.JobDetails.push(obj);
                let candidatedata = await candidate.save();
                const addjobdata = await AddJobData.find();
                for (var k = 0; k < addjobdata.length; k++) {
                    console.log('addjobdata[k].JobDetails.jobId is:', addjobdata[k]._id);
                    console.log('req.body.JobDetails.jobId is:', req.body.JobDetails.jobId);
                    console.log('addjobdata[k].JobDetails.jobPostingTitle is:', addjobdata[k].posting_title);
                    console.log('req.body.JobDetails.jobPostingTitle is_id:', req.body.JobDetails.jobPostingTitle);
                    if (addjobdata[k]._id == req.body.JobDetails.jobId) {
                        console.log(`one more candidate is applied for ${addjobdata[k].posting_title}`)
                        console.log('candidateData._id is:', candidatedata._id);
                        console.log('candidateData.PersonalInfo.email is:', candidatedata.PersonalInfo.email)
                        var obj = { candidateId: '', candidateEmail: '' };
                        obj.candidateId = candidatedata._id;
                        obj.candidateEmail = candidatedata.PersonalInfo.email;
                        addjobdata[k].candidateDetails.push(obj);
                        let a = await (addjobdata[k]).save();
                        console.log('a', a);
                        break;


                    }
                }
                var datanew = {
                    jobId: req.body.JobDetails.jobId,
                    jobPostingTitle: req.body.JobDetails.jobPostingTitle,
                    candidateId: candidatedata._id,
                    candidateEmail: candidatedata.PersonalInfo.email,
                    candidateStatus: 'pending'
                }


                let d = new JobAndCandidate(datanew);
                d = await d.save();
                res.send(d);




            }
            //  
            // WHEN SAME CANDIDATE IS APPLYING FOR SAME JOB
            else {
                console.log('this candidate is already aplied for this job');
            }
            // 
        }
        // 

    }
}
