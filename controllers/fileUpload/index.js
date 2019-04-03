const router = require('express').Router();
const fileUploadController = require('./fileUpload.controller');
const fsmid=require('../../middleware/multer/multer.middleware');

// router.get('/:filename', (req, res) => {
//     console.log('hiit');
//     res.json()
// })

router.get('/:filename',fileUploadController.getFileUpload)
router.post('/:id',fsmid.candidateUploads,fileUploadController.setFileUpload);

  
module.exports = router;

