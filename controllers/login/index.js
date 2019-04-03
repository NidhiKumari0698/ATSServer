const router=require('express').Router();
const loginController=require('./login.controller')

router.post('/',loginController.getLoginData)
module.exports=router;