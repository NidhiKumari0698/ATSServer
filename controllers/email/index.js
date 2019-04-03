const router=require('express').Router()
const emailController=require('./email.controller')
router.post('/',emailController.sendEmail)
module.exports=router;