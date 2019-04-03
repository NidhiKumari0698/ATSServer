const router=require('express').Router()
const otpController=require('./otp.controller')
router.post('/',otpController.createOtp)
router.get('/:candidateId/:otp',otpController.matchOtp)
module.exports=router