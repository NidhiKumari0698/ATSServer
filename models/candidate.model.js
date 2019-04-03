const mongoose = require('mongoose');
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
  WorkExperience: [{
    prev_comp: String,
    prev_sal: String,
    exp_year: Number,
    exp_month: Number,
  }],
  ReferenceDetails:
  [{
    refname: String,
    refemail: String,
    refrelation: String,
    refmobile: Number,
  }],
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
  isVerifiedOtp:Boolean
  
}));

module.exports = CandidateData;