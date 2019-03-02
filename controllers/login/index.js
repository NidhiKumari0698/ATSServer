const router=require('express').Router();
const loginController=require('./login.controller')

router.get('/',loginController.getLoginData)
module.exports=router;