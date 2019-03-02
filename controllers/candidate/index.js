const router = require('express').Router();
const candidateController = require('./candidate.controller');

router.get('/',candidateController.getCandidates);
router.get('/job/:candidateEmail',candidateController.getCandidateJobs)
//router.post('/',candidateController.setCandidates)
router.post('/',candidateController.setCandidates);


module.exports = router;

