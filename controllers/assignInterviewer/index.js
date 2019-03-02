const router=require('express').Router()
const assignInterviewerController=require('./assignInterviewer.controller')

router.get('/',assignInterviewerController.getAssignInterviewerData)
router.post('/',assignInterviewerController.postAssignInterviewerData)
router.get('/Details/:jobId/:candidateEmail',assignInterviewerController.getAssignInterviewerDetails)
router.post('/active/:jobId/:candidateId',assignInterviewerController.postActiveAssignInterviewerData)


module.exports=router