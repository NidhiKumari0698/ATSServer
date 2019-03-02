const router=require('express').Router()
const addInterviewerController=require('./addInterviewer.controller')

router.get('/',addInterviewerController.getInterviewerData)
router.post('/',addInterviewerController.postInterviewerData)


module.exports=router