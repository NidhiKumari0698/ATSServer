const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoOptions = { useNewUrlParser: true };

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost/ATS', mongoOptions)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('could not connect to mongoDB..', err));

app.get('/', (req, res) => {
  res.send('ATS');
});

const LoginData = mongoose.model('LoginData', new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  isActive: String
}));

app.get('/loginData', async (req, res) => {
  const loginData = await LoginData.find().sort('email');
  res.json(loginData);
});

const JobAndCandidate = mongoose.model('JobAndCandidate', new mongoose.Schema({
  jobPostingTitle: String,
  jobId: String,
  candidateId: String,
  candidateEmail: String,
  candidateStatus: String,
  recentResponse: [{ round: Number, interviewerEmail: String, response: String, date: String, time: String }],
  previousResponse: [{ round: Number, interviewerEmail: String, response: String, date: String, time: String }],


}));
app.get('/jobAndCandidate', async (req, res) => {
  const jobAndCandidate = await JobAndCandidate.find();
  res.send(jobAndCandidate);
});

app.post('/jobAndCandidate', async (req, res) => {
  let data = new JobAndCandidate(req.body);
  data = await data.save();
  //res.send(data);
});


app.get('/jobAndCandidate/Details/:jobId/:candidateEmail', async (req, res) => {
  if ((!req.params.jobId) || (!req.params.candidateEmail)) {
    res.json({ status: 'empty request' });
  }
  // console.log('req status is', req.body.status);
  //  jobId: req.params.jobId, candidateEmail: req.params.candidateEmail
  console.log('jobId is:', req.params.jobId);
  console.log('candidateEmail is:', req.params.candidateEmail);
  console.log('you are here at /jobAndCandidate/Details');
  let jobandcandidate = await JobAndCandidate.findOne({ jobId: req.params.jobId, candidateEmail: req.params.candidateEmail });
  console.log('jobandcandidate is:', jobandcandidate);
  res.json(jobandcandidate);

});

app.get('/assignInterviewerData/Details/:jobId/:candidateEmail', async (req, res) => {
  if ((!req.params.jobId) || (!req.params.candidateEmail)) {
    res.json({ status: 'empty request' });
  }
  console.log('req status is', req.body.status);
  console.log('you are here at /assignInterviewerData/Details');
  let assigndata = await AssignInterviewerData.findOne({ jobId: req.params.jobId, candidate_email: req.params.candidateEmail });
  console.log('jobandcandidate is:', assigndata);
  res.json(assigndata);

});

app.post('/jobAndCandidate/status/:jobId/:candidateId', async (req, res) => {
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

});
app.post('/jobAndCandidate/recentResponse/:jobId/:candidateId', async (req, res) => {
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



})

async function createjobAndCandidate(data2) {
  console.log('hieee');
  let d = new JobAndCandidate(data2);
  d = await d.save();
  // res.send(d);

}
const CandidateData = mongoose.model('CandidateData', new mongoose.Schema({
  PersonalInfo:
  {
    firstname: String,
    lastname: String,
    email: String,
    mobile: Number,
    otp: Number,
    address: {
      city: String,
      state: String,
      postalcode: String,
      country: String,
    },
    resume: String,
    video: String,
  },
  WorkExperience: {
    prev_comp: String,
    prev_sal: String,
    exp_year: Number,
    exp_month: Number,
  },
  ReferenceDetails:
  {
    refname: String,
    refemail: String,
    refrelation: String,
    refmobile: Number,
  },
  JobDetails: [{
    jobId: String,
    jobPostingTitle: String
  }],
  AcademicDetails: {
    HighSchool: { passyear: String, board: String, school: String, percentage: String },
    Intermediate: { passyear: String, board: String, school: String, percentage: String },
    Graduation: { passyear: String, course: String, college: String, university: String, stream: String, cgpa: String },
    Others: { passyear: String, course: String, college: String, university: String, stream: String, cgpa: String }

  },
}));

app.get('/candidateData', async (req, res) => {
  const candidateData = await CandidateData.find().sort('email');
  res.send(candidateData);
});

app.get('/candidateData/job/:candidateEmail', async (req, res) => {
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

})

app.post('/candidateData', async (req, res) => {
  // console.log('req.body',req.body);
  //console.log('address', req.body.address);
  const datas = await CandidateData.find().sort('email');
  /// candidate = datas.find(c => c.PersonalInfo.email == req.body.PersonalInfo.email);
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
  if (value) {
    console.log('this candidate is unique');
    let candidatedata = new CandidateData(req.body)
    candidatedata = await candidatedata.save();
    res.send(candidatedata);
    //setcandidate();
    const addjobdata = await AddJobData.find();
    // const value=JobAndCandidate.find(value => value.jobId==req.body.JobDetails.jobId)
    //console.log('value is :',value);
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
    const logindata = new LoginData({
      email: req.body.PersonalInfo.email,
      password: req.body.password,
      role: "candidate",
      isActive: "true"
    });

    let lData = await logindata.save();
    console.log(lData);
    var datanew = {
      jobId: req.body.JobDetails.jobId,
      jobPostingTitle: req.body.JobDetails.jobPostingTitle,
      candidateId: candidatedata._id,
      candidateEmail: candidatedata.PersonalInfo.email,
      candidateStatus: 'pending'
    }


    createjobAndCandidate(datanew);
  }
  else {
    console.log('this candidate is not unique');
    var alljob = [];
    alljob.push(candidate.JobDetails);
    var value2 = 1;
    console.log('all available jobs are;', alljob);
    console.log('all candidate.jobDetails is:', candidate.JobDetails);
    //const job=alljob.find(c => {c.jobPostingTitle==req.JobDetails.jobPostingTitle})
    for (var j = 0; j < candidate.JobDetails.length; j++) {
      console.log('candidate.JobDetails.jobPostingTitle is:', candidate.JobDetails[j].jobPostingTitle);
      console.log('req.body.JobDetails.jobPostingTitle is:', req.body.JobDetails.jobPostingTitle);
      if (candidate.JobDetails[j].jobPostingTitle == req.body.JobDetails.jobPostingTitle) {
        console.log('this candidate is already applied for this job');
        value2 = 0;
        break;
      }
    }

    if (value2) {
      var obj = req.body.JobDetails;
      alljob.push(obj);
      console.log('alljob is:', alljob);
      candidate.JobDetails.push(obj);
      let candidatedata = await candidate.save();
      //console.log('c', c);
      //  setcandidate();
      //const value = JobAndCandidate.find(value => value.jobId == req.body.JobDetails.jobId)
      //console.log('value is is:', value);
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

      // const jobAndCandidate = new JobAndCandidate({
      //   jobId: req.body.JobDetails.jobId,
      //   jobPostingTitle: req.body.JobDetails.jobPostingTitle,
      //   candidateId: candidateData._id,
      //   candidateEmail: candidateData.PersonalInfo.email,
      //   candidateStatus: 'pending'
      // })
      // let jobandcandidate = await jobAndCandidate.save();
      // console.log('jobandcandidate is', jobandcandidate);

      var datanew = {
        jobId: req.body.JobDetails.jobId,
        jobPostingTitle: req.body.JobDetails.jobPostingTitle,
        candidateId: candidatedata._id,
        candidateEmail: candidatedata.PersonalInfo.email,
        candidateStatus: 'pending'
      }


      createjobAndCandidate(datanew);



    }
    else {
      console.log('this candidate is already aplied for this job');
    }

  }





});
// async setcandidate()
// {

// }

app.delete('/candidateData/:id', async (req, res) => {
  console.log(">>>");
  const candidate = await CandidateData.findByIdAndRemove((req.params.id));
  console.log('hello');
  console.log(candidate);
  // if (!candidate) return res.status(404).send('The candidate with the given ID was not found.');

  res.send(candidate);
});

const AddJobData = mongoose.model('AddJobData', new mongoose.Schema({
  posting_title: String,
  city: String,
  state: String,
  country: String,
  date_open: String,
  date_close: String,
  job_type: String,
  salary: String,
  position_summary: String,
  job_respo: String,
  exp: String,
  candidateDetails: [{ candidateId: String, candidateEmail: String }]

}));
app.get('/addJobData', async (req, res) => {
  const addjobData = await AddJobData.find();
  res.send(addjobData);
});

app.post('/addJobData', async (req, res) => {

  let addjobData = new AddJobData(req.body);
  addjobData = await addjobData.save();
  res.send(addjobData);
});

app.delete('/addJobData/:id', async (req, res) => {
  console.log(">>>");
  const job = await AddJobData.findByIdAndRemove((req.params.id));
  console.log('hello');
  console.log(job);
  // if (!candidate) return res.status(404).send('The candidate with the given ID was not found.');

  res.send(job);
});

const AddInterviewerData = mongoose.model('AddInterviewerData', new mongoose.Schema({
  // name:String,
  email: String,
  mobile: Number,
  role: String
}));

app.get('/addInterviewerData', async (req, res) => {
  const addInterviewerData = await AddInterviewerData.find().sort('email');
  res.send(addInterviewerData);
});

app.post('/addInterviewerData', async (req, res) => {
  // console.log('req.body',req.body);
  let addInterviewerData = new AddInterviewerData(req.body);
  addInterviewerData = await addInterviewerData.save();
  res.send(addInterviewerData);

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



});



const AssignInterviewerData = mongoose.model('AssignInterviewerData', new mongoose.Schema({
  candidate_email: String,
  candidate_id: String,
  interviewer_email: String,
  date: String,
  time: String,
  jobPostingTitle: String,
  jobId: String,
  round: Number,
  resume: String,
  video: String,
  active: Number,
}));
app.get('/assignInterviewerData', async (req, res) => {
  const assignInterviewerData = await AssignInterviewerData.find();
  res.send(assignInterviewerData);
});

app.post('/assignInterviewerData', async (req, res) => {

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



});

app.post('/assignInterviewerData/active/:jobId/:candidateId', (req, res) => {
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


});





const server = app.listen(3001, function () {
  console.log('listen to port 3001');
})



