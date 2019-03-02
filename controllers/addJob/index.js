const router=require('express').Router()
const addJobController=require('./addJob.controller')

router.get('/',addJobController.getAddJobData)
router.post('/',addJobController.postAddJobData)

module.exports=router