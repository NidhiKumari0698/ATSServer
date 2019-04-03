const router=require('express').Router()
const jobAndCandController=require('./jobAndCandidate.controller')
router.get('/',jobAndCandController.getjobAndCandidate)
router.post('/',jobAndCandController.setjobAndCandidate)
router.get('/Details/:jobId/:loginId',jobAndCandController.getjobAndCandidateDetails)
router.post('/status/:jobId/:candidateId',jobAndCandController.updateStatus)
router.post('/recentResponse/:jobId/:candidateId',jobAndCandController.updateRecentResponse)
module.exports=router;