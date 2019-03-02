const router = require('express').Router();
const candidateRouter = require('./candidate/index');
const loginRouter=require('./login/index');
const jobAndCandidateRouter=require('./jobAndCandidate/index')
const assignInterviewerRouter=require('./assignInterviewer/index')
const addJobRouter=require('./addJob/index')
const addInterviewer=require('./addInterviewer/index')

router.use('/candidateData', candidateRouter);
router.use('/loginData',loginRouter);
router.use('/jobAndCandidate',jobAndCandidateRouter);
router.use('/assignInterviewerData',assignInterviewerRouter);
router.use('/addJobData',addJobRouter)
router.use('/addInterviewerData',addInterviewer)

module.exports = router;